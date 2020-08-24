export interface DatabaseAdapter {
  tableName: string;
  getTable<T>(): Promise<T | void>;
  saveTable<T>(tableData: T): Promise<void>;
}
