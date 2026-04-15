import { getPool } from "../../database/init.js";

async function likePost(idPost, idUser) {
  const pool = await getPool();
  const [result] = await pool.query(
    `INSERT INTO Like (idPost, idUser) VALUES (?, ?)`,
    [idPost, idUser],
  );
  return { insertId: result.insertId };
}

async function unlikePost(idPost, idUser) {
  const pool = await getPool();
  const [result] = await pool.query(
    `DELETE FROM Like WHERE idPost = ? AND idUser = ?`,
    [idPost, idUser],
  );
  return { affectedRows: result.affectedRows };
}

async function checkIfUserLikedPost(idPost, idUser) {
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT * FROM Like WHERE idPost = ? AND idUser = ?`,
    [idPost, idUser],
  );
  return rows.length > 0;
}

async function getLikesCount(idPost) {
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT COUNT(*) as count FROM Like WHERE idPost = ?`,
    [idPost],
  );
  return rows[0].count;
}

async function getLikesOfPost(idPost) {
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT l.id, l.idUser, l.date, u.username, u.urlPhoto 
     FROM Like l
     INNER JOIN User u ON l.idUser = u.id
     WHERE l.idPost = ?
     ORDER BY l.date DESC`,
    [idPost],
  );
  return rows;
}

async function deleteLikesByPost(idPost) {
  const pool = await getPool();
  await pool.query(`DELETE FROM Like WHERE idPost = ?`, [idPost]);
}

async function deleteLikesByUser(idUser) {
  const pool = await getPool();
  await pool.query(`DELETE FROM Like WHERE idUser = ?`, [idUser]);
}

export {
  likePost,
  unlikePost,
  checkIfUserLikedPost,
  getLikesCount,
  getLikesOfPost,
  deleteLikesByPost,
  deleteLikesByUser,
};
