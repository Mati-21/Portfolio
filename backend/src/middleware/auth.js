const jwt = require("jsonwebtoken");

/**
 * Middleware to protect routes.
 * Reads JWT from the httpOnly cookie named "token".
 * Attaches decoded payload to req.admin on success.
 */
function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized — no token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized — invalid or expired token" });
  }
}

module.exports = { requireAuth };
