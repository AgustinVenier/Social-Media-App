import { getPool } from "../../database/init.js";

async function getFeed(userId) {
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT p.id, p.description, p.photoUrl, p.date, p.idUser, u.username, u.urlPhoto
     FROM Post p
     INNER JOIN Follow f ON p.idUser = f.idFollowed
     INNER JOIN User u ON p.idUser = u.id
     WHERE f.idFollower = ?
     ORDER BY p.date DESC`,
    [userId],
  );
  return rows;
}

async function createPost(idUser, description, photoUrl) {
  const pool = await getPool();
  const [result] = await pool.query(
    `INSERT INTO Post (idUser, description, photoUrl) VALUES (?, ?, ?)`,
    [idUser, description, photoUrl],
  );
  return { insertId: result.insertId };
}

async function deletePost(id) {
  const pool = await getPool();
  const [result] = await pool.query(`DELETE FROM Post WHERE id = ?`, [id]);
  return result;
}

async function updatePost(id, description, photoUrl) {
  const pool = await getPool();
  const [result] = await pool.query(
    `UPDATE Post SET description = ?, photoUrl = ? WHERE id = ?`,
    [description, photoUrl, id],
  );
  return result;
}

async function getPostById(id) {
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT * FROM Post WHERE id = ?`,
    [id],
  );
  return rows;
}

async function getPostsByUser(idUser) {
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT * FROM Post WHERE idUser = ? ORDER BY date DESC`,
    [idUser],
  );
  return rows;
}

export {
  getFeed,
  createPost,
  deletePost,
  updatePost,
  getPostById,
  getPostsByUser,
};
