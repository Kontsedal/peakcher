import { LocalStorageAdapter } from "./core/adapters/LocalStorage";
import { DataTable } from "./core/DataTable";

export class AuthTable extends DataTable {
  constructor() {
    super({ adapter: new LocalStorageAdapter("auth") });
  }

  setAuthToken(token: string) {
    return this.setValue("token", token);
  }

  getAuthToken() {
    return this.getValue("token");
  }

  setSessionId(sessionId: string) {
    return this.setValue("sessionId", sessionId);
  }

  getSessionId() {
    return this.getValue("sessionId");
  }
}
