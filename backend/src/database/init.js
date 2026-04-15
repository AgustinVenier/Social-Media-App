import mysql from "mysql2/promise";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

let pool;

const configWithoutDb = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  port: process.env.DB_PORT || 3306,
};

const configWithDb = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
};

async function initDatabase() {
  let connection;
  try {
    console.log("Variables de entorno:", {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
    });

    console.log("Conectando a MySQL...");
    connection = await mysql.createConnection(configWithoutDb);
    console.log("✅ Conexión exitosa a MySQL");

    console.log("Creando base de datos...");
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``,
    );
    console.log("✅ Base de datos creada");

    await connection.end();

    connection = await mysql.createConnection(configWithDb);
    console.log("✅ Conectado a la base de datos");

    console.log("Creando tablas...");

    // Tabla User
    await connection.query(`
      CREATE TABLE IF NOT EXISTS User (
        id VARCHAR(100) PRIMARY KEY,
        username VARCHAR(100) UNIQUE,
        password VARCHAR(100),
        urlPhoto VARCHAR(255)
      )
    `);
    console.log("✅ Tabla User creada");

    // Tabla Post
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Post (
        id INT AUTO_INCREMENT PRIMARY KEY,
        idUser VARCHAR(100) NOT NULL,
        description VARCHAR(255),
        photoUrl VARCHAR(255),
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_post_user FOREIGN KEY (idUser) REFERENCES User(id) ON DELETE CASCADE
      )
    `);
    console.log("✅ Tabla Post creada");

    // Tabla Comment
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Comment (
        id VARCHAR(100) PRIMARY KEY,
        idPost INT NOT NULL,
        idUser VARCHAR(100) NOT NULL,
        description VARCHAR(500),
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_comment_post FOREIGN KEY (idPost) REFERENCES Post(id) ON DELETE CASCADE,
        CONSTRAINT fk_comment_user FOREIGN KEY (idUser) REFERENCES User(id) ON DELETE CASCADE
      )
    `);
    console.log("✅ Tabla Comment creada");

    // Tabla Like
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`Like\` (
        id INT AUTO_INCREMENT PRIMARY KEY,
        idPost INT NOT NULL,
        idUser VARCHAR(100) NOT NULL,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_like_post FOREIGN KEY (idPost) REFERENCES Post(id) ON DELETE CASCADE,
        CONSTRAINT fk_like_user FOREIGN KEY (idUser) REFERENCES User(id) ON DELETE CASCADE,
        UNIQUE KEY unique_like (idPost, idUser)
      )
    `);
    console.log("✅ Tabla Like creada");

    // Tabla Follow
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Follow (
        idFollower VARCHAR(100) NOT NULL,
        idFollowed VARCHAR(100) NOT NULL,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (idFollower, idFollowed),
        CONSTRAINT fk_follow_follower FOREIGN KEY (idFollower) REFERENCES User(id) ON DELETE CASCADE,
        CONSTRAINT fk_follow_followed FOREIGN KEY (idFollowed) REFERENCES User(id) ON DELETE CASCADE
      )
    `);
    console.log("✅ Tabla Follow creada");

    console.log("✅ Tablas creadas");
    console.log("\n✅ Base de datos y tablas creadas exitosamente");
    await connection.end();
  } catch (error) {
    console.error("\n❌ Error al inicializar la base de datos:");
    console.error("Mensaje:", error.message);
    console.error("Código:", error.code);
    process.exit(1);
  }
}

async function getPool() {
  if (!pool) {
    pool = await mysql.createPool(configWithDb);
  }
  return pool;
}

async function closePool() {
  if (pool) {
    await pool.end();
  }
}

export { initDatabase, getPool, closePool };
