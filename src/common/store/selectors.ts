import { RootState } from "./index";
import { createSelector } from "reselect";
import { File } from "common/interfaces";

export const getFiles = (state: RootState) => (state ? state.files : undefined);
export const getFilesArray = createSelector(getFiles, (files = {}): File[] =>
  Object.values(files)
);
export const getTags = (state: RootState) => (state ? state.tags : undefined);
export const getTagsArray = createSelector(getTags, (tags) =>
  Object.keys(tags)
);
export const getSettings = (state: RootState) =>
  state ? state.settings : undefined;
export const getSearchColumnsCount = createSelector(
  getSettings,
  (settings) => settings.searchColumnsCount
);
