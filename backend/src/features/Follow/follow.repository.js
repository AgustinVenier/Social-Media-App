import { getPool } from "../../database/init.js";

async function followUser(idFollower, idFollowed) {
  const pool = await getPool();
  await pool.query(
    "INSERT INTO Follow (idFollower, idFollowed) VALUES (?, ?)",
    [idFollower, idFollowed],
  );
}

async function unfollowUser(idFollower, idFollowed) {
  const pool = await getPool();
  const [result] = await pool.query(
    "DELETE FROM Follow WHERE idFollower = ? AND idFollowed = ?",
    [idFollower, idFollowed],
  );
  return result;
}

async function isUserFollowed(idFollower, idFollowed) {
  const pool = await getPool();
  const [rows] = await pool.query(
    "SELECT * FROM Follow WHERE idFollower = ? AND idFollowed = ?",
    [idFollower, idFollowed],
  );
  return rows.length > 0;
}

async function getFollowers(idFollowed) {
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT u.id, u.username, u.urlPhoto 
     FROM Follow f 
     INNER JOIN User u ON f.idFollower = u.id 
     WHERE f.idFollowed = ?`,
    [idFollowed],
  );
  return rows;
}

async function getFollowing(idFollower) {
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT u.id, u.username, u.urlPhoto 
     FROM Follow f 
     INNER JOIN User u ON f.idFollowed = u.id 
     WHERE f.idFollower = ?`,
    [idFollower],
  );
  return rows;
}

async function getFollowersCount(idFollowed) {
  const pool = await getPool();
  const [rows] = await pool.query(
    "SELECT COUNT(*) as count FROM Follow WHERE idFollowed = ?",
    [idFollowed],
  );
  return rows[0].count;
}

async function getFollowingCount(idFollower) {
  const pool = await getPool();
  const [rows] = await pool.query(
    "SELECT COUNT(*) as count FROM Follow WHERE idFollower = ?",
    [idFollower],
  );
  return rows[0].count;
}

export {
  followUser,
  unfollowUser,
  isUserFollowed,
  getFollowers,
  getFollowing,
  getFollowersCount,
  getFollowingCount,
};
