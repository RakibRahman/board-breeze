import dotenv from "dotenv";
import { Express } from "express";
import { createApp } from "./createApp";
dotenv.config();

const app: Express = createApp();

const PORT = process.env.PORT;

if (!PORT) {
  throw new Error("Missing env variables");
}

app.listen(PORT, () => {
  console.log(`listening the app from port:${PORT}`);
});
