import { DB_Tables } from "../db/Tables";

export class CustomError extends Error {
  statusCode?: number;

  constructor(message?: string, statusCode?: number) {
    super(message);
    this.statusCode = statusCode;
  }
}


export type TableNames = {
  [K in keyof typeof DB_Tables]: typeof DB_Tables[K];
};
