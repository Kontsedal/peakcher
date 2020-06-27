import debounce from "lodash/debounce";
import mime from "mime";
import { v4 as uuid } from "uuid";
import { Store } from "redux";
import { CONFIG } from "../../config";

import { FileToUpload } from "../../common/interfaces";
import { AuthTable } from "../../common/database/AuthTable";
import { Queue } from "../../common/utils/queue";
import { DropboxService } from "./Dropdox";
import { RootState, actions } from "../../common/store";
import { NotificationsService } from "./Notifications";
import { MigrationService } from "./Migration";

export interface RemoteSession {
  sessionId: string;
}

export class AppService {
  public static generateFileNameToUpload(fileName, mimeType): string {
    let extension = fileName.split(".").pop();
    if (mimeType && mime.getExtension(mimeType)) {
      extension = mime.getExtension(mimeType);
    }
    return `${CONFIG.IMAGES_FOLDER}/${uuid()}.${extension}`;
  }

  private uploadQueue: Queue;

  private authToken: string;

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

  public async init() {
    this.authTable = new AuthTable();
    await this.authTable.init();
    this.authToken = await this.authTable.getAuthToken();
    this.sessionId = await this.getSessionId();
  }

  public canAuthorize() {
    return !!this.authToken;
  }

  public async authenticate({ code, tabId }: { code: string; tabId: number }) {
    if (!code) {
      return;
    }
    this.authToken = await DropboxService.authenticate(code);
    if (this.authToken) {
      chrome.tabs.remove(tabId);
      await this.authTable.setAuthToken(this.authToken);
      this.refreshUsedSpace();
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
    files.forEach((fileToUpload) => {
      this.uploadQueue.push(async () => {
        try {
          await this.uploadFile(fileToUpload, notifyUser);
        } catch (error) {
          if (notifyUser) {
            NotificationsService.uploadFailed();
          }
        }
      });
    });
  }

  public async uploadFile(fileToUpload: FileToUpload, notifyUser?: boolean) {
    const fileBlob = await fetch(fileToUpload.fileUrl).then((response) =>
      response.blob()
    );
    this.store.dispatch(
      actions.setUploadFileStatus({
        id: fileToUpload.uploadId,
        uploading: true,
        error: false,
        progress: 0,
      })
    );
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
      this.store.dispatch(
        actions.removeUploadFileStatus({
          uploadId: fileToUpload.uploadId,
        })
      );
      await this.checkStateRelevance();
      this.store.dispatch(
        actions.addFile({
          id: uploadResult.name,
          name: uploadResult.name,
          size: uploadResult.size,
          publicUrl: uploadResult.publicUrl,
          path: uploadResult.path,
          type: fileToUpload.type,
          width: fileToUpload.width,
          height: fileToUpload.height,
          usedTimes: 0,
          tags: [],
          createdAt: Date.now(),
        })
      );
      this.refreshUsedSpace().catch(
        console.error.bind(null, "refreshUsedSpace:: ")
      );
      if (notifyUser) {
        NotificationsService.uploadSuccess(uploadResult.publicUrl);
      }
    } catch (error) {
      actions.setUploadFileStatus({
        id: fileToUpload.uploadId,
        uploading: false,
        error: true,
        progress: 0,
      });
    }
  }

  public async deleteFile({ fileId, force = false }, callback) {
    const state = this.store.getState();
    const file = state.files[fileId];
    if (!fileId) {
      callback({
        error: new Error("File doesn't exist"),
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

  public async fetchRemoteState() {
    if (!this.authToken) {
      throw new Error("User is not authenticated");
    }
    return DropboxService.downloadFile({
      fileName: CONFIG.DB_FILE_NAME,
      token: this.authToken,
    });
  }

  public async loadRemoteState() {
    const remoteState = await this.fetchRemoteState();
    const validState = MigrationService.migrateState(remoteState);
    this.store.dispatch(actions.setRemoteState(validState));
    this.store.dispatch(actions.setIsAuthorized(true));
  }

  public async uploadStateToRemote(state) {
    state = { ...state };
    if (state.uploadStatus) {
      delete state.uploadStatus;
    }
    if (!state.isAuthorized) {
      return;
    }
    if (!this.authToken) {
      return;
    }
    const serializedState = JSON.stringify(state);
    if (serializedState === this.lastUploadedSerializedState) {
      console.warn("Skip same state to upload");
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

  public async checkStateRelevance() {
    const state = this.store.getState();
    if (!state.settings.protectFromDataConflicts) {
      return;
    }
    if (!this.authToken) {
      throw new Error("User is not authenticated");
    }
    const sessionIsRelevant = await this.isCurrentSessionRelevant();
    if (!sessionIsRelevant) {
      await this.loadRemoteState();
      await this.uploadSessionToRemote();
    }
  }

  public async refreshUsedSpace() {
    if (!this.authToken) {
      throw new Error("User is not authenticated");
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

  private async getSessionId() {
    if (this.sessionId) {
      return this.sessionId;
    }
    let sessionId = await this.authTable.getSessionId();
    if (!sessionId) {
      sessionId = uuid();
      await this.authTable.setSessionId(sessionId);
    }
    return sessionId;
  }

  private doesAnySessionExist() {
    return DropboxService.doesPathExist({
      path: CONFIG.SESSION_FILE_NAME,
      token: this.authToken,
    });
  }

  private getRemoteSession() {
    return DropboxService.downloadFile({
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

  private uploadSessionToRemote() {
    const session: RemoteSession = { sessionId: this.sessionId };
    const file = new Blob([JSON.stringify(session)], {
      type: "application/json",
    });

    return DropboxService.uploadFile({
      fileName: CONFIG.SESSION_FILE_NAME,
      token: this.authToken,
      file,
      makePublic: false,
    });
  }
}
