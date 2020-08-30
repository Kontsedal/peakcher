import debounce from "lodash/debounce";
import mime from "mime";
import { v4 as uuid } from "uuid";
import { Store } from "redux";

import { FileToUpload } from "common/interfaces";
import { AuthTable } from "common/database/AuthTable";
import { Queue } from "common/utils/queue";
import { RootState, actions } from "common/store";
import { getImageSizes } from "utils/file";
import { Logger } from "common/services/Logger";
import { DropboxService } from "./Dropdox";
import { CONFIG } from "../../config";
import { NotificationsService } from "./Notifications";
import { MigrationService } from "./Migration";

export interface RemoteSession {
  sessionId: string;
}

export class AppService {
  public static generateFileNameToUpload(
    fileName: string,
    mimeType?: string
  ): string {
    let extension = fileName.split(".").pop();
    if (mimeType && mime.getExtension(mimeType)) {
      extension = mime.getExtension(mimeType);
    }
    return `${CONFIG.IMAGES_FOLDER}/${uuid()}.${extension}`;
  }

  private uploadQueue: Queue;

  private authToken: string | void;

  private sessionId: string;

  private authTable: AuthTable;

  private lastUploadedSerializedState: string;

  private store: Store<RootState>;

  constructor(store: Store<RootState>) {
    this.store = store;
    this.uploadStateToRemote = debounce(
      this.uploadStateToRemote.bind(this),
      CONFIG.STORE_UPLOAD_TO_REMOTE_FREQUENCY
    );

    this.uploadQueue = new Queue({ concurrentTasksCount: 3 });
  }

  public async init(): Promise<void> {
    this.authTable = new AuthTable();
    await this.authTable.init();
    this.authToken = await this.authTable.getAuthToken();
    this.sessionId = await this.getSessionId();
  }

  public canAuthorize(): boolean {
    return !!this.authToken;
  }

  public async authenticate({
    code,
    tabId,
  }: {
    code: string;
    tabId: number;
  }): Promise<void> {
    if (!code) {
      return;
    }
    this.authToken = await DropboxService.authenticate(code);
    if (this.authToken) {
      chrome.tabs.remove(tabId);
      await this.authTable.setAuthToken(this.authToken);
      await this.refreshUsedSpace();
      try {
        await this.loadRemoteState();
        NotificationsService.authSuccess();
      } catch (e) {
        DropboxService.createFolderIfDoesntExist({
          path: CONFIG.IMAGES_FOLDER,
          token: this.authToken,
        }).then(() => {
          this.store.dispatch(actions.setIsAuthorized(true));
          NotificationsService.authSuccess();
        });
      }
    }
  }

  public async uploadFiles({
    files,
    notifyUser = false,
  }: {
    files: FileToUpload[];
    notifyUser?: boolean;
  }): Promise<void> {
    this.store.dispatch(actions.cleanUploadStatus());
    try {
      await Promise.all(
        files.map((fileToUpload) => {
          this.store.dispatch(
            actions.setUploadFileStatus({
              id: fileToUpload.uploadId,
              uploading: true,
              error: false,
              progress: 0,
            })
          );
          return this.uploadQueue.push(async () => {
            await this.uploadFile(fileToUpload, notifyUser);
          });
        })
      );
    } finally {
      this.store.dispatch(actions.cleanUploadStatus());
    }
  }

  public async uploadFile(
    fileToUpload: FileToUpload,
    notifyUser?: boolean
  ): Promise<void> {
    const fileBlob = await fetch(fileToUpload.fileUrl).then((response) =>
      response.blob()
    );
    const fileData = { ...fileToUpload };
    if (!this.authToken) {
      throw new Error("Unauthorized");
    }
    try {
      const uploadResult = await DropboxService.uploadFile({
        file: fileBlob,
        token: this.authToken,
        makePublic: true,
        fileName: AppService.generateFileNameToUpload(
          fileToUpload.name,
          fileToUpload.type
        ),
        onProgress: (event) => {
          const progress = +((event.loaded / event.total) * 100).toFixed(2);
          this.store.dispatch(
            actions.setUploadFileStatus({
              id: fileToUpload.uploadId,
              uploading: true,
              error: false,
              progress,
            })
          );
        },
      });
      if (!fileData.width || !fileData.height) {
        const sizes = await getImageSizes(uploadResult.publicUrl);
        if (!sizes.width || !sizes.height) {
          NotificationsService.uploadFailed();
          return;
        }
        fileData.width = sizes.width;
        fileData.height = sizes.height;
      }
      await this.checkStateRelevance();
      this.store.dispatch(
        actions.addFile({
          id: uploadResult.name,
          name: uploadResult.name,
          size: uploadResult.size,
          publicUrl: uploadResult.publicUrl,
          path: uploadResult.path,
          type: fileData.type,
          width: fileData.width,
          height: fileData.height,
          usedTimes: 0,
          tags: [],
          createdAt: Date.now(),
        })
      );

      this.refreshUsedSpace().catch((error) =>
        Logger.error("AppService:::uploadFile refreshUsedSpace error", error)
      );
      if (notifyUser) {
        NotificationsService.uploadSuccess(uploadResult.publicUrl);
      }
    } catch (error) {
      if (notifyUser) {
        NotificationsService.uploadFailed();
      }
      actions.setUploadFileStatus({
        id: fileToUpload.uploadId,
        uploading: false,
        error: true,
        progress: 0,
      });
    }
  }

  public async deleteFile(
    { fileId, force = false }: { fileId: string; force?: boolean },
    callback: (result: { error: Error | boolean; success: boolean }) => void
  ): Promise<void> {
    if (!this.authToken) {
      throw new Error("Unauthorized");
    }
    const state = this.store.getState();
    const file = state.files[fileId];
    if (!fileId) {
      callback({
        error: new Error("ImageData doesn't exist"),
        success: false,
      });
      return;
    }
    try {
      await DropboxService.deleteFile({
        path: file.path,
        token: this.authToken,
      });
      await this.checkStateRelevance();
      this.store.dispatch(actions.deleteFile(fileId));
      callback({ error: false, success: true });
    } catch (error) {
      if (force) {
        await this.checkStateRelevance();
        this.store.dispatch(actions.deleteFile(fileId));
        callback({ error: false, success: true });
        return;
      }
      callback({ error, success: false });
    }
  }

  public async fetchRemoteState(): Promise<RootState> {
    if (!this.authToken) {
      throw new Error("User is not authenticated");
    }
    return DropboxService.downloadFile<RootState>({
      fileName: CONFIG.DB_FILE_NAME,
      token: this.authToken,
    });
  }

  public async loadRemoteState(): Promise<void> {
    const remoteState = await this.fetchRemoteState();
    const migrationService = new MigrationService();
    const validState = await migrationService.migrateState(remoteState);
    this.store.dispatch(actions.setRemoteState(validState));
    this.store.dispatch(actions.setIsAuthorized(true));
  }

  public async uploadStateToRemote(state: RootState): Promise<void> {
    const stateToUpload = { ...state };
    if (stateToUpload.uploadStatus) {
      delete stateToUpload.uploadStatus;
    }
    if (!stateToUpload.isAuthorized) {
      return;
    }
    if (!this.authToken) {
      return;
    }
    const serializedState = JSON.stringify(stateToUpload);
    if (serializedState === this.lastUploadedSerializedState) {
      Logger.warn(
        "[AppService::uploadStateToRemote] Skip same state to upload"
      );
      return;
    }
    const file = new Blob([serializedState], {
      type: "application/json",
    });
    DropboxService.uploadFile({
      fileName: CONFIG.DB_FILE_NAME,
      file,
      token: this.authToken,
      makePublic: false,
    }).then(() => {
      this.lastUploadedSerializedState = serializedState;
    });
  }

  public async checkStateRelevance(): Promise<void> {
    const state = this.store.getState();
    if (!state.settings.protectFromDataConflicts) {
      return;
    }
    if (!this.authToken) {
      throw new Error(
        "[AppService::checkStateRelevance] User is not authenticated"
      );
    }
    const sessionIsRelevant = await this.isCurrentSessionRelevant();
    if (!sessionIsRelevant) {
      await this.loadRemoteState();
      await this.uploadSessionToRemote();
    }
  }

  public async refreshUsedSpace(): Promise<void> {
    if (!this.authToken) {
      throw new Error(
        "[AppService::refreshUsedSpace] User is not authenticated"
      );
    }
    return DropboxService.getSpaceUsage({
      token: this.authToken,
    }).then(async (usage) => {
      await this.checkStateRelevance();
      this.store.dispatch(
        actions.setRemoteSpaceInfo({
          total: usage.total,
          used: usage.used,
        })
      );
    });
  }

  private async getSessionId(): Promise<string> {
    if (this.sessionId) {
      return this.sessionId;
    }
    let sessionId = await this.authTable.getSessionId();
    if (!sessionId) {
      sessionId = uuid();
      await this.authTable.setSessionId(sessionId as string);
    }
    return sessionId as string;
  }

  private doesAnySessionExist(): Promise<boolean> {
    if (!this.authToken) {
      throw new Error("Unauthorized");
    }
    return DropboxService.doesPathExist({
      path: CONFIG.SESSION_FILE_NAME,
      token: this.authToken,
    });
  }

  private getRemoteSession(): Promise<RemoteSession> {
    if (!this.authToken) {
      throw new Error("Unauthorized");
    }
    return DropboxService.downloadFile<RemoteSession>({
      fileName: CONFIG.SESSION_FILE_NAME,
      token: this.authToken,
    });
  }

  private async isCurrentSessionRelevant(): Promise<boolean> {
    const sessionExist = await this.doesAnySessionExist();
    if (!sessionExist) {
      return false;
    }
    const remoteState: RemoteSession = await this.getRemoteSession();
    return remoteState.sessionId === this.sessionId;
  }

  private async uploadSessionToRemote(): Promise<void> {
    if (!this.authToken) {
      throw new Error("Unauthorized");
    }
    const session: RemoteSession = { sessionId: this.sessionId };
    const file = new Blob([JSON.stringify(session)], {
      type: "application/json",
    });

    try {
      await DropboxService.uploadFile({
        fileName: CONFIG.SESSION_FILE_NAME,
        token: this.authToken,
        file,
        makePublic: false,
      });
    } catch (error) {
      Logger.error(
        "[AppService::uploadSessionToRemote] Failed to upload session",
        error
      );
      throw error;
    }
  }
}
