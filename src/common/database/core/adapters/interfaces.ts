export interface DatabaseAdapter {
  tableName: string;
  getTable(): Promise<any>;
  saveTable(tableData: object): Promise<any>;
}
