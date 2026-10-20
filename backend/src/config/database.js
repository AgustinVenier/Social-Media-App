import "./environment.js";
import mysql from "mysql2/promise";
import { readFileSync } from "node:fs";
let pool;
export function databaseConfig() {
  return {
    host: process.env.DB_HOST, user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || "", database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT || 3306), connectTimeout: 10000,
    ...(process.env.DB_SSL === "true" ? { ssl: {
      rejectUnauthorized: true,
      ...(process.env.DB_SSL_CA_PATH ? { ca: readFileSync(process.env.DB_SSL_CA_PATH, "utf8") } : {}),
    }} : {}),
  };
}
export async function getPool() {
  pool ??= mysql.createPool({ ...databaseConfig(), waitForConnections: true, connectionLimit: 10, queueLimit: 100 });
  return pool;
}
export async function closePool() { if (pool) { await pool.end(); pool = undefined; } }
