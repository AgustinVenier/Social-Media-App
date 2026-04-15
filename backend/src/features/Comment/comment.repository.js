import { getPool } from "../../database/init.js";
import crypto from "crypto";

async function createComment(idPost, idUser, description) {
  const pool = await getPool();
  const id = crypto.randomBytes(16).toString("hex");
  const [result] = await pool.query(
    `INSERT INTO Comment (id, idPost, idUser, description, date) VALUES (?, ?, ?, ?, NOW())`,
    [id, idPost, idUser, description],
  );
  return { id, insertId: result.insertId };
}

async function updateComment(id, description) {
  const pool = await getPool();
  const [result] = await pool.query(
    `UPDATE Comment SET description = ? WHERE id = ?`,
    [description, id],
  );
  return { affectedRows: result.affectedRows };
}

async function deleteComment(id) {
  const pool = await getPool();
  const [result] = await pool.query(`DELETE FROM Comment WHERE id = ?`, [id]);
  return { affectedRows: result.affectedRows };
}

async function getCommentById(id) {
  const pool = await getPool();
  const [rows] = await pool.query(`SELECT * FROM Comment WHERE id = ?`, [id]);
  return rows.length > 0 ? rows[0] : null;
}

async function getCommentsByPost(idPost) {
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT c.id, c.idPost, c.idUser, c.description, c.date, u.username, u.urlPhoto
     FROM Comment c
     INNER JOIN User u ON c.idUser = u.id
     WHERE c.idPost = ?
     ORDER BY c.date DESC`,
    [idPost],
  );
  return rows;
}

async function getCommentsCountByPost(idPost) {
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT COUNT(*) as count FROM Comment WHERE idPost = ?`,
    [idPost],
  );
  return rows[0].count;
}

async function deleteCommentsByPost(idPost) {
  const pool = await getPool();
  await pool.query(`DELETE FROM Comment WHERE idPost = ?`, [idPost]);
}

async function deleteCommentsByUser(idUser) {
  const pool = await getPool();
  await pool.query(`DELETE FROM Comment WHERE idUser = ?`, [idUser]);
}

async function getCommentsByUser(idUser) {
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT c.id, c.idPost, c.idUser, c.description, c.date, u.username, u.urlPhoto
     FROM Comment c
     INNER JOIN User u ON c.idUser = u.id
     WHERE c.idUser = ?
     ORDER BY c.date DESC`,
    [idUser],
  );
  return rows;
}

async function getCommentsCountByUser(idUser) {
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT COUNT(*) as count FROM Comment WHERE idUser = ?`,
    [idUser],
  );
  return rows[0].count;
}

async function getCommentsByPostWithPagination(idPost, limit = 10, offset = 0) {
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT c.id, c.idPost, c.idUser, c.description, c.date, u.username, u.urlPhoto
     FROM Comment c
     INNER JOIN User u ON c.idUser = u.id
     WHERE c.idPost = ?
     ORDER BY c.date DESC
     LIMIT ? OFFSET ?`,
    [idPost, limit, offset],
  );
  return rows;
}

export {
  createComment,
  updateComment,
  deleteComment,
  getCommentById,
  getCommentsByPost,
  getCommentsCountByPost,
  deleteCommentsByPost,
  deleteCommentsByUser,
  getCommentsByUser,
  getCommentsCountByUser,
  getCommentsByPostWithPagination,
};
