import { DatabaseAdapter } from "./interfaces";

export class SyncExtensionStorageAdapter implements DatabaseAdapter {
  constructor(public tableName: string) {}

  async getTable() {
    let tableData = await getData(this.tableName);
    if (tableData && typeof tableData === "string") {
      tableData = JSON.parse(tableData);
    }
    return tableData;
  }

  async saveTable(tableData: object) {
    return setData(this.tableName, JSON.stringify(tableData));
  }
}

function getData(key) {
  return new Promise((resolve) => {
    chrome.storage.sync.get([key], (result) => {
      resolve(result[key]);
    });
  });
}

function setData(key: string, value: any) {
  const mutator = { [key]: value };
  return new Promise((resolve) => {
    chrome.storage.sync.set(mutator, () => {
      resolve();
    });
  });
}
