import { createSelector } from "reselect";
import {
  ImageData,
  ImageDataMap,
  RemoteSpaceInfo,
  Settings,
  UploadStatusMap,
} from "common/interfaces";
import { RootState } from "./index";

export const getFiles = (state: RootState): ImageDataMap => state.files;
export const getFilesArray = createSelector(
  getFiles,
  (files = {}): ImageData[] => Object.values(files)
);
export const getTags = (state: RootState): { [key: string]: string[] } =>
  state.tags;
export const getTagsArray = createSelector(getTags, (tags) =>
  Object.keys(tags)
);
export const getSettings = (state: RootState): Settings => state.settings;
export const getSearchColumnsCount = createSelector(
  getSettings,
  (settings) => settings.searchColumnsCount
);

export const getRemoteSpaceInfo = (state: RootState): RemoteSpaceInfo =>
  state.remoteSpaceInfo;
export const getUploadStatus = (state: RootState): UploadStatusMap =>
  state.uploadStatus;
