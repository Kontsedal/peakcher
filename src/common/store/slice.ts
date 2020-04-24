/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  File,
  Settings,
  RemoteSpaceInfo,
  UploadStatus,
  UploadFileInfo,
} from "common/interfaces";
import difference from "lodash/difference";
import merge from "lodash/merge";
import { CONFIG } from "../../config";

export interface RootState {
  stateVersion: string | undefined;
  isAuthorized: boolean;
  files: {
    [key: string]: File;
  };
  tags: {
    [key: string]: string[];
  };
  remoteSpaceInfo: RemoteSpaceInfo;
  uploadStatus: UploadStatus;
  settings: Settings;
}

const initialState: RootState = {
  stateVersion: undefined,
  isAuthorized: false,
  files: {},
  tags: {},
  remoteSpaceInfo: {
    total: 0,
    used: 0,
  },
  uploadStatus: {},
  settings: {
    popupHeight: CONFIG.MAX_POPUP_HEIGHT,
    popupWidth: CONFIG.MAX_POPUP_WIDTH,
    searchColumnsCount: 3,
    protectFromDataConflicts: false,
  },
};

export const slice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setIsAuthorized: (state, action: PayloadAction<boolean>) => {
      state.isAuthorized = action.payload;
    },
    addFile: (state, action: PayloadAction<File>) => {
      const file = action.payload;
      state.files[file.id] = file;
    },
    setSettings: (state, action: PayloadAction<Settings>) => {
      state.settings = action.payload;
    },
    deleteFile: (state, action: PayloadAction<string>) => {
      const fileId = action.payload;
      if (!fileId || !state.files[fileId]) {
        return state;
      }
      state.files[fileId].tags.forEach((tagName) => {
        state.tags[tagName] = state.tags[tagName].filter(
          (item) => item !== fileId
        );
      });
      delete state.files[fileId];
      return state;
    },
    deleteTag: (state, action: PayloadAction<string>) => {
      const tagName = action.payload;
      if (!tagName || !state.tags[tagName]) {
        return state;
      }
      state.tags[tagName].forEach((fileId) => {
        if (!state.files[fileId]) {
          return;
        }
        state.files[fileId].tags = state.files[fileId].tags.filter(
          (item) => item !== tagName
        );
      });
      delete state[tagName];
      return state;
    },
    setRemoteSpaceInfo: (state, action: PayloadAction<RemoteSpaceInfo>) => {
      state.remoteSpaceInfo = action.payload;
    },
    logOut: () => {
      return initialState;
    },
    setFileTags: (
      state,
      action: PayloadAction<{ fileId: string; tags: string[] }>
    ) => {
      const { tags, fileId } = action.payload;
      const removedTags = difference(state.files[fileId].tags, tags.sort());
      removedTags.forEach((tag: string) => {
        if (state.tags[tag]) {
          state.tags[tag] = state.tags[tag].filter((file) => file !== fileId);
        }
      });
      state.files[fileId].tags = [];
      tags.forEach((tag) => {
        if (!state.tags[tag]) {
          state.tags[tag] = [];
        }
        if (!state.tags[tag].includes(fileId)) {
          state.tags[tag].push(fileId);
        }
        state.files[fileId].tags.push(tag);
      });
    },
    setState: (state, action) => action.payload,
    setRemoteState: (state, action) => {
      return merge(state, action.payload);
    },
    setUploadFileStatus: (state, action: PayloadAction<UploadFileInfo>) => {
      const fileInfo = action.payload;
      state.uploadStatus[fileInfo.id] = fileInfo;
    },
  },
});
