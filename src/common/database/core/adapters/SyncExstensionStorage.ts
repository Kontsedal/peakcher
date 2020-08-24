import { DatabaseAdapter } from "./interfaces";

export class SyncExtensionStorageAdapter implements DatabaseAdapter {
  constructor(public tableName: string) {}

  async getTable<T>(): Promise<T | void> {
    const tableData = await getData(this.tableName);
    try {
      return JSON.parse(tableData);
    } catch (error) {
      return undefined;
    }
  }

  async saveTable<T>(tableData: T): Promise<void> {
    await setData(this.tableName, JSON.stringify(tableData));
  }
}

function getData(key): Promise<string> {
  return new Promise((resolve) => {
    chrome.storage.sync.get([key], (result) => {
      resolve(result[key]);
    });
  });
}

function setData(key: string, value: string | number | boolean | void) {
  const mutator = { [key]: value };
  return new Promise((resolve) => {
    chrome.storage.sync.set(mutator, () => {
      resolve();
    });
  });
}
