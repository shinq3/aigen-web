#!/usr/bin/env node
// RDS migration helper: runs drizzle-kit push using RDS credentials
import { execSync } from "child_process";

const host = (process.env.RDS_ENDPOINT || "").trim();
const password = process.env.RDS_PASSWORD || "";
const user = process.env.RDS_USER || process.env.RDS_USERNAME || "postgres";
const database = process.env.RDS_DATABASE || "dauchy";
const port = process.env.RDS_PORT || "5432";

if (!host) {
  console.error("RDS_ENDPOINT is not set");
  process.exit(1);
}

const encodedPass = encodeURIComponent(password);
const url = `postgresql://${user}:${encodedPass}@${host}:${port}/${database}?sslmode=require`;

console.log(`Connecting to RDS: ${host}:${port}/${database} as ${user}`);
console.log("Running drizzle-kit push...");

try {
  execSync("npx drizzle-kit push", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: url, NODE_TLS_REJECT_UNAUTHORIZED: "0" },
  });
  console.log("Schema pushed successfully!");
} catch (err) {
  console.error("Migration failed:", err.message);
  process.exit(1);
}
