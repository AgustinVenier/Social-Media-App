const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Token not found" });
    }

    const decoded = jwt.verify(token, "mysecretkey");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = {
  verifyToken,
};
