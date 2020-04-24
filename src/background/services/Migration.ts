/* eslint-disable no-case-declarations,default-case */
import merge from "lodash/merge";
import { CONFIG } from "../../config";

export class MigrationService {
  static migrateState(state) {
    const stateVersion = state.stateVersion || 1;
    if (stateVersion === CONFIG.CURRENT_STATE_VERSION) {
      return state;
    }
    const newState = merge({}, state);
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
}
