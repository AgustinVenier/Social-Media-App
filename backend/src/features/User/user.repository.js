import { getPool } from "../../database/init.js";
import crypto from "crypto";

async function createUser(username, password) {
  const pool = await getPool();
  const id = crypto.randomUUID();
  await pool.query(
    "INSERT INTO User (id, username, password) VALUES (?, ?, ?)",
    [id, username, password],
  );
  return { id, username };
}

async function searchUserByName(username) {
  const pool = await getPool();
  const [rows] = await pool.query(
    "SELECT id, username, password, urlPhoto FROM User WHERE username = ?",
    [username],
  );
  return rows;
}

async function getUserById(id) {
  const pool = await getPool();
  const [rows] = await pool.query(
    "SELECT id, username, urlPhoto FROM User WHERE id = ?",
    [id],
  );
  return rows.length > 0 ? rows[0] : null;
}

async function updateUser(id, username, urlPhoto) {
  const pool = await getPool();
  await pool.query(
    `UPDATE User SET username = ?, urlPhoto = ? WHERE id = ?`,
    [username, urlPhoto, id],
  );
}

async function updateUserPhoto(id, urlPhoto) {
  const pool = await getPool();
  await pool.query(`UPDATE User SET urlPhoto = ? WHERE id = ?`, [
    urlPhoto,
    id,
  ]);
}

async function deleteUser(id) {
  const pool = await getPool();
  const [result] = await pool.query(`DELETE FROM User WHERE id = ?`, [id]);
  return result;
}

export {
  createUser,
  searchUserByName,
  getUserById,
  updateUser,
  updateUserPhoto,
  deleteUser,
};
