import mysql from "mysql2/promise";
import { databaseConfig } from "../config/database.js";
export { getPool, closePool } from "../config/database.js";
// Ejecutar explicitamente; la base debe existir y el usuario debe tener permisos DDL.
export async function initDatabase() {
  const connection = await mysql.createConnection(databaseConfig());
  try {
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


  } finally { await connection.end(); }
}
