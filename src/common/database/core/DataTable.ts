import { DatabaseAdapter } from "./adapters/interfaces";

export class DataTable {
  protected adapter: DatabaseAdapter;

  constructor({ adapter }: { adapter: DatabaseAdapter }) {
    this.adapter = adapter;
  }

  public async init() {
    await this.createTableIfNotExist();
  }

  private async createTableIfNotExist() {
    const tableData = await this.adapter.getTable();
    if (!tableData) {
      await this.adapter.saveTable({});
    }
  }

  public async getValue(key) {
    const tableData = await this.adapter.getTable();
    return tableData[key];
  }

  public async setValue(key, value) {
    const tableData = await this.adapter.getTable();
    tableData[key] = value;
    await this.adapter.saveTable(tableData);
  }

  public async removeKey(key) {
    const tableData = await this.adapter.getTable();
    delete tableData[key];
    await this.adapter.saveTable(tableData);
  }

  public async getTable() {
    return this.adapter.getTable();
  }

  public async saveTable(data) {
    return this.adapter.saveTable(data);
  }
}
