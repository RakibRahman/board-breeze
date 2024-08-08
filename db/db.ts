import dotenv from "dotenv";
import fs from "fs";
import pg from "pg";
import path from "path";

dotenv.config();
const env = process.env;

if (!env) {
  throw new Error("Missing required db variables");
}

const sqlFilePath = path.join(__dirname, "./kanban.sql");
const { Pool } = pg;

const pool = new Pool({
  host: env.DB_HOST,
  port: parseInt(env.DB_PORT!, 10),
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const query = (text: string, values?: any[]) => pool.query(text, values);

export const initializeDatabase = async () => {
  try {
    const client = await pool.connect();

    if (client) {
      fs.readFile(sqlFilePath, "utf-8", async (err, data) => {
        if (err) {
          throw err;
        }
        await query(`${data}`);
      });
    }
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1); // Exit the application if connection fails
  }
};
