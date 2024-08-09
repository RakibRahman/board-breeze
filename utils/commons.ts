import { DB_Tables } from "../db/Tables";

export const updateColumnsById = (
  id: string | number,
  tableName: keyof typeof DB_Tables,
  payload: Record<string, any>
): { sql: string; keys: string[]; values: any[] } => {
  const keys = Object.keys(payload);
  const values = Object.values(payload);
  const columnsToUpdate = keys.map((col, i) => `${col}=$${i + 1}`).toString();
  const idPlaceholder = "$" + (values.length + 1);
  const sql = `UPDATE ${tableName} SET ${columnsToUpdate} WHERE id=${idPlaceholder} RETURNING *;`;
  return { sql, keys, values: [...values, id] };
};
