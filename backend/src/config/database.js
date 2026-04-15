const mysql = require("mysql2/promise");
require("dotenv").config();

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool;

/**
 * Obtiene el pool de conexiones
 * Si no existe, lo crea
 * Reutiliza el mismo pool en todas las llamadas
 */
async function getPool() {
  if (!pool) {
    console.log("Conectando a MySQL...");
    pool = await mysql.createPool(config);
    console.log("✅ Conexión exitosa a MySQL");
  }
  return pool;
}

async function query(queryText) {
  const pool = await getPool();
  const [rows] = await pool.execute(queryText);
  return rows;
}

module.exports = {
  query,
  mysql,
  getPool,
};
