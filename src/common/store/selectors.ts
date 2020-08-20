import { createSelector } from "reselect";
import { ImageData } from "common/interfaces";
import { RootState } from "./index";

export const getFiles = (state: RootState) => (state ? state.files : undefined);
export const getFilesArray = createSelector(
  getFiles,
  (files = {}): ImageData[] => Object.values(files)
);
export const getTags = (state: RootState) => (state ? state.tags : undefined);
export const getTagsArray = createSelector(getTags, (tags) =>
  Object.keys(tags)
);
export const getSettings = (state: RootState) => state.settings;
export const getSearchColumnsCount = createSelector(
  getSettings,
  (settings) => settings.searchColumnsCount
);

export const getRemoteSpaceInfo = (state) => state.remoteSpaceInfo;
export const getUploadStatus = (state) => state.uploadStatus;
