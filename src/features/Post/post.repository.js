import { getPool } from "../../database/init.js";

async function getFeed(userId) {
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT p.id, p.photoUrl
FROM Post p
INNER JOIN Upload u
    ON p.id = u.idPost
INNER JOIN Follow f
    ON u.idUser = f.id
WHERE f.idFollower = ?
ORDER BY p.date DESC;`,
    [userId],
  );
  return rows;
}

async function createPost(desc, photoUrl) {
  const pool = await getPool();
  const [result] = await pool.query(
    `INSERT INTO Post (description, photoUrl) VALUES (?, ?)`,
    [desc, photoUrl],
  );
  return { insertId: result.insertId };
}

async function deletePost(id) {
  const pool = await getPool();
  await pool.query(`DELETE FROM Post WHERE id=?`, [id]);
}

async function updatePost(id, desc, photoUrl) {
  const pool = await getPool();
  await pool.query(
    `UPDATE Post 
    SET description = ?,
    photoUrl = ?
    WHERE id = ?`,
    [desc, photoUrl, id],
  );
}

async function getPostById(id) {
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT * FROM Post 
    WHERE id = ?`,
    [id],
  );
  return rows;
}

export default {
  getFeed,
  createPost,
  deletePost,
  updatePost,
  getPostById,
};
