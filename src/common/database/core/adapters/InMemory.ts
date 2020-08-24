import { DatabaseAdapter } from "./interfaces";

const IN_MEMORY_SYMBOL = Symbol.for("IN_MEMORY_BB");
if (!window[IN_MEMORY_SYMBOL]) {
  window[IN_MEMORY_SYMBOL] = {};
}

export class InMemoryAdapter implements DatabaseAdapter {
  constructor(public tableName: string) {}

  async getTable<T>(): Promise<T | void> {
    return window[IN_MEMORY_SYMBOL][this.tableName];
  }

  async saveTable<T>(tableData: T): Promise<void> {
    window[IN_MEMORY_SYMBOL][this.tableName] = tableData;
  }
}
