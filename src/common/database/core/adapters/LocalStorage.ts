import { DatabaseAdapter } from "./interfaces";

export class LocalStorageAdapter implements DatabaseAdapter {
  constructor(public tableName: string) {}

  public async getTable<T>(): Promise<T | void> {
    const tableData = window.localStorage.getItem(this.tableName);
    try {
      return JSON.parse(tableData);
    } catch (error) {
      return undefined;
    }
  }

  public async saveTable<T>(tableData: T): Promise<void> {
    window.localStorage.setItem(this.tableName, JSON.stringify(tableData));
  }
}
