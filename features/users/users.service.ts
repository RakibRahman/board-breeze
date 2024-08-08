import { query } from "express";
import { hashPassword, isValidPassword } from "../../utils/hashPassword";
import { User } from "./users.schema";
import { pg_query } from "../../db/db";
import { log } from "console";
import { generateJWT } from "../../utils/generateToken";

export const userRegistration = async (payload: User) => {
  const { name, email, password } = payload;
  const securedPassword = await hashPassword(password);
  const sql = `INSERT INTO users (name,email,password) values($1,$2,$3)`;
  try {
    await pg_query(sql, [name, email, securedPassword]);
    const user = await pg_query(
      `SELECT id,name,email from users where email=$1`,
      [email]
    );

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
