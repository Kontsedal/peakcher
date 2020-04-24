import { DatabaseAdapter } from "./interfaces";

export class LocalStorageAdapter implements DatabaseAdapter {
  constructor(public tableName: string) {}

  public async getTable() {
    let tableData = window.localStorage.getItem(this.tableName);
    if (tableData) {
      tableData = JSON.parse(tableData);
    }
    return tableData;
  }

  public async saveTable(tableData: object) {
    window.localStorage.setItem(this.tableName, JSON.stringify(tableData));
  }
}
