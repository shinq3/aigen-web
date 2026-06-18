import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

const host = (process.env.RDS_ENDPOINT || "").trim();
const user = process.env.RDS_USER || "";
const password = process.env.RDS_PASSWORD || "";
const database = process.env.RDS_DATABASE || "dauchy";
const port = parseInt(process.env.RDS_PORT || "5432", 10);

if (!host || !user || !password) {
  throw new Error("RDS_ENDPOINT, RDS_USER, RDS_PASSWORD must all be set");
}

export const pool = new Pool({
  host,
  port,
  user,
  password,
  database,
  ssl: { rejectUnauthorized: false },
});

export const db = drizzle(pool, { schema });
