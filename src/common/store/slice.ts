/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  File,
  Settings,
  RemoteSpaceInfo,
  UploadStatus,
  UploadFileInfo,
} from "common/interfaces";
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
    popupHeight: CONFIG.MIN_POPUP_HEIGHT,
    popupWidth: CONFIG.MIN_POPUP_WIDTH,
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
    setSettingValue: (
      state,
      action: PayloadAction<{
        settingName: string;
        settingValue: string | boolean | number;
      }>
    ) => {
      let { settingName, settingValue } = action.payload;
      if (
        typeof state.settings[settingName] === "undefined" ||
        typeof settingValue === "undefined"
      ) {
        return state;
      }
      const allowedRanges = {
        popupHeight: {
          min: CONFIG.MIN_POPUP_HEIGHT,
          max: CONFIG.MAX_POPUP_HEIGHT,
        },
        popupWidth: {
          min: CONFIG.MIN_POPUP_WIDTH,
          max: CONFIG.MAX_POPUP_WIDTH,
        },
        searchColumnsCount: {
          min: CONFIG.MIN_IMAGES_IN_ROW,
          max: CONFIG.MAX_IMAGES_IN_ROW,
        },
      };
      if (
        allowedRanges[settingName] &&
        settingValue < allowedRanges[settingName].min
      ) {
        settingValue = allowedRanges[settingName].min;
      }
      if (
        allowedRanges[settingName] &&
        settingValue > allowedRanges[settingName].max
      ) {
        settingValue = allowedRanges[settingName].max;
      }
      state.settings[settingName] = settingValue;
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
    addFileTag: (state, action) => {
      const { fileId, tag } = action.payload;
      if (!fileId || !tag || !state.files[fileId]) {
        return state;
      }
      if (!state.files[fileId].tags.includes(tag)) {
        state.files[fileId].tags.push(tag);
      }
      if (!state.tags[tag]) {
        state.tags[tag] = [];
      }
      state.tags[tag].push(fileId);
      return state;
    },
    removeFileTag: (state, action) => {
      const { fileId, tag } = action.payload;
      if (!fileId || !tag || !state.files[fileId]) {
        return state;
      }
      state.files[fileId].tags = state.files[fileId].tags.filter(
        (item) => item !== tag
      );
      state.tags[tag] = state.tags[tag].filter((item) => item !== fileId);
      if (state.tags[tag].length === 0) {
        delete state.tags[tag];
      }
      return state;
    },
    setState: (state, action) => action.payload,
    setRemoteState: (state, action) => {
      return merge(state, action.payload);
    },
    setUploadFileStatus: (state, action: PayloadAction<UploadFileInfo>) => {
      const fileInfo = action.payload;
      state.uploadStatus[fileInfo.id] = fileInfo;
    },
    removeUploadFileStatus: (
      state,
      action: PayloadAction<{ uploadId: string }>
    ) => {
      const { uploadId } = action.payload;
      delete state.uploadStatus[uploadId];
    },
  },
});
