const mysql = require("mysql2/promise");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

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

    console.log("Creando base de datos Nodejs...");
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`,
    );
    console.log("✅ Base de datos creada");

    await connection.end();

    // Conectarse a la base de datos creada
    connection = await mysql.createConnection(configWithDb);
    console.log("✅ Conectado a la base de datos");

    console.log("Creando tablas...");

    // Crear tabla users
    await connection.query(`
      CREATE TABLE IF NOT EXISTS User(
        id varchar(100) PRIMARY KEY,
        username VARCHAR(100),
        password varchar(100),
        urlPhoto varchar(255),
      )
      CREATE TABLE IF NOT EXISTS Post(
        id INT IDENTITY(1,1) PRIMARY KEY,
        date datetime,
        description varchar(255),
        photoUrl varchar(255)
      )
        CREATE TABLE IF NOT EXISTS Upload(
        idPost varchar(100) PRIMARY KEY,
        idUser varchar(100)
        CONSTRAINT fk_upload_post FOREIGN KEY (idPost) REFERENCES Post(id) ON DELETE CASCADE,
        CONSTRAINT fk_upload_user FOREIGN KEY (idUser) REFERENCES User(id) ON DELETE CASCADE
      )
        CREATE TABLE IF NOT EXISTS Follow(
        idFollower varchar(100),
        id varchar(100),
        CONSTRAINT fk_follow_follower FOREIGN KEY (idFollower) REFERENCES User(id) ON DELETE CASCADE,
        CONSTRAINT fk_follow_followed FOREIGN KEY (id) REFERENCES User(id) ON DELETE CASCADE
      )
      CREATE TABLE IF NOT EXISTS Comment(
        id varchar(100) PRIMARY KEY,
        idPost varchar(100),
        idUser varchar(100),
        date datetime,
        description varchar(255),
        CONSTRAINT fk_comment_post FOREIGN KEY (idPost) REFERENCES Post(id) ON DELETE CASCADE,
        CONSTRAINT fk_comment_user FOREIGN KEY (idUser) REFERENCES User(id) ON DELETE CASCADE
        )
    `);
    console.log("✅ Tablas creadas");

    console.log("\n✅ Base de datos y tablas creadas exitosamente");
    await connection.end();
  } catch (error) {
    console.error("\n❌ Error al inicializar la base de datos:");
    console.error("Mensaje:", error.message);
    console.error("Código:", error.code);
    console.error("Stack:", error.stack);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase };
