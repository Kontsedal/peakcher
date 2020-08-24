/* eslint-disable no-case-declarations,default-case */
import merge from "lodash/merge";
import { RootState } from "common/store";
import { getImageSizes } from "utils/file";
import {
  ImageData,
  RemoteSpaceInfo,
  Settings,
  UploadStatusMap,
} from "common/interfaces";

export interface RootStateV1 {
  isAuthorized: boolean;
  files: {
    [key: string]: ImageData;
  };
  tags: {
    [key: string]: { name: string; files: string[] };
  };
  remoteSpaceInfo: RemoteSpaceInfo;
  uploadStatus: UploadStatusMap;
  settings: Settings;
}

export class MigrationService {
  async migrateState(state: RootState | RootStateV1): Promise<RootState> {
    let stateVersion = 1;
    const newState: RootStateV1 = merge({}, state);
    if ("stateVersion" in state) {
      stateVersion = state.stateVersion;
    }
    switch (stateVersion) {
      case 1:
        const oldTags: {
          [key: string]: { name: string; files: string[] };
        } = (state as RootStateV1).tags;
        const migratedTags = {};
        Object.entries(oldTags).forEach(([tagName, { files }]) => {
          migratedTags[tagName] = files;
        });
        newState.tags = migratedTags;
        ((newState as unknown) as RootState).stateVersion = 2;
    }
    return this.fixCorruptedFiles((newState as unknown) as RootState);
  }

  async fixCorruptedFiles(state: RootState): Promise<RootState> {
    const newState = { ...state };
    const corruptedFiles = Object.values(state.files).filter(
      (file) => !file.height || !file.width
    );
    await Promise.all(
      corruptedFiles.map(async (file) => {
        const sizes = await getImageSizes(file.publicUrl);
        if (!sizes.width || !sizes.height) {
          delete newState.files[file.id];
          return;
        }
        newState.files[file.id].width = sizes.width;
        newState.files[file.id].height = sizes.height;
      })
    );
    return newState;
  }
}
