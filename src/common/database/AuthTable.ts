import { LocalStorageAdapter } from "./core/adapters/LocalStorage";
import { DataTable } from "./core/DataTable";

type AuthTableFields = {
  token: string;
  sessionId: string;
};

export class AuthTable extends DataTable<AuthTableFields> {
  constructor() {
    super({ adapter: new LocalStorageAdapter("auth") });
  }

  setAuthToken(token: string): Promise<void> {
    return this.setValue("token", token);
  }

  getAuthToken(): Promise<string | void> {
    return this.getValue("token");
  }

  setSessionId(sessionId: string): Promise<void> {
    return this.setValue("sessionId", sessionId);
  }

  getSessionId(): Promise<string | void> {
    return this.getValue("sessionId");
  }
}
