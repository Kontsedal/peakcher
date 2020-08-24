import { DatabaseAdapter } from "./adapters/interfaces";

export class DataTable<U> {
  protected adapter: DatabaseAdapter;

  constructor({ adapter }: { adapter: DatabaseAdapter }) {
    this.adapter = adapter;
  }

  public async init(): Promise<void> {
    await this.createTableIfNotExist();
  }

  private async createTableIfNotExist() {
    const tableData = await this.adapter.getTable<U>();
    if (!tableData) {
      await this.adapter.saveTable({});
    }
  }

  public async getValue(key: keyof U): Promise<U[keyof U] | void> {
    const tableData = await this.adapter.getTable<U>();
    if (!tableData) {
      return undefined;
    }
    return tableData[key];
  }

  public async setValue(key: keyof U, value: U[keyof U]): Promise<void> {
    const tableData = await this.adapter.getTable<U>();
    if (!tableData) {
      return;
    }
    tableData[key] = value;
    await this.adapter.saveTable<U>(tableData);
  }

  public async removeKey(key: keyof U): Promise<void> {
    const tableData = await this.adapter.getTable<U>();
    if (!tableData) {
      return;
    }
    delete tableData[key];
    await this.adapter.saveTable<U>(tableData);
  }

  public async getTable(): Promise<U | void> {
    return this.adapter.getTable<U>();
  }

  public async saveTable<U>(data: U): Promise<void> {
    await this.adapter.saveTable(data);
  }
}
