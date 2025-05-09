const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Extract token from the Authorization header
  const token = req.header('Authorization')?.split(' ')[1];

  // Check if token is missing or empty
  if (!token || token === '') {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Attach user info to request object
    next();
  } catch (err) {
    console.error(`JWT error: ${err.message} in token verification`);
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
