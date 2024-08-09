import { pg_query } from "../../db/db";
import { CustomError } from "../../models/types";
import { updateColumnsById } from "../../utils/commons";
import { generateJWT } from "../../utils/generateToken";
import { hashPassword, isValidPassword } from "../../utils/hashPassword";
import { User } from "./users.schema";

export const userRegistration = async (payload: User) => {
  const { name, email, password } = payload;
  const securedPassword = await hashPassword(password);
  const insert_sql = `INSERT INTO users (name,email,password) values($1,$2,$3)`;
  const get_sql = `SELECT id,name,email from users where email=$1`;

  try {
    await pg_query(insert_sql, [name, email, securedPassword]);
    const user = await pg_query(get_sql, [email]);

    return user.rows[0];
  } catch (err: any) {
    if (err?.code === "23505" && err.constraint === "users_email_key") {
      err.detail;
      throw new Error(`Account already registered with ${email}`);
    }
    throw err;
  }
};

export const userLogin = async (payload: Omit<User, "name">) => {
  const { email, password } = payload;

  const sql = `SELECT * FROM users WHERE email=$1;`;

  try {
    const admin = await pg_query(sql, [email]);
    const user = admin.rows[0];

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const verifyPassword = await isValidPassword(user.password, password);

    if (verifyPassword) {
      const data = { id: user.id, email, name: user.name };
      const token = generateJWT(data);
      return { token };
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async (id: string) => {
  const get_user_sql = `SELECT id,name,email,avatar,created_at from users where id=$1`;
  const get_user_boards_sql = `SELECT id,name FROM boards WHERE creator_id=$1`;
  const get_recent_tasks_sql = `SELECT id,title FROM tasks WHERE creator_id=$1 ORDER BY created_at DESC LIMIT 10`;
  const user = await pg_query(get_user_sql, [id]);
  const boards = await pg_query(get_user_boards_sql, [id]);
  const tasks = await pg_query(get_recent_tasks_sql, [id]);
  const payload = {
    profile: user.rows[0],
    boards: boards.rows,
    recent_tasks: tasks.rows,
  };
  return user.rows[0] ? payload : null;
};

export const updateUserProfile = async (
  id: string,
  payload: Partial<User & { avatar: string }>
) => {
  const { sql, values, keys } = updateColumnsById(id, "USERS", payload);

  if (!keys.length) {
    throw new CustomError("Invalid data provided", 422);
  }
  try {
    const user = await pg_query(sql, values);

    return user.rowCount ? user.rows[0] : null;
  } catch (err: any) {
    if (err?.code === "23505" && err.constraint === "users_email_key") {
      err.detail;
      throw new Error(`Account already registered with ${payload.email}`);
    }
    throw new Error(err);
  }
};
