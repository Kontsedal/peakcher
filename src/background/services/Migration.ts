/* eslint-disable no-case-declarations,default-case */
import merge from "lodash/merge";
import { CONFIG } from "../../config";
import { RootState } from "../../common/store";
import { getImageSizes } from "../../utils/file";

export class MigrationService {
  async migrateState(state) {
    const stateVersion = state.stateVersion || 1;
    if (stateVersion === CONFIG.CURRENT_STATE_VERSION) {
      return this.fixCorruptedFiles(state);
    }
    const newState: RootState = merge({}, state);
    switch (stateVersion) {
      case 1:
        newState.stateVersion = 2;
        const oldTags: { [key: string]: { name: string; files: string[] } } =
          state.tags;
        const migratedTags = {};
        Object.entries(oldTags).forEach(([tagName, { files }]) => {
          migratedTags[tagName] = files;
        });
        newState.tags = migratedTags;
    }

    return newState;
  }

  async fixCorruptedFiles(state: RootState) {
    const corruptedFiles = Object.values(state.files).filter(
      (file) => !file.height || !file.width
    );
    await Promise.all(
      corruptedFiles.map(async (file) => {
        let sizes = await getImageSizes(file.publicUrl);
        if (!sizes.width || !sizes.height) {
          delete state.files[file.id];
          return;
        }
        state.files[file.id].width = sizes.width;
        state.files[file.id].height = sizes.height;
      })
    );
    return state;
  }
}
