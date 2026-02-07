const jwt = require('jsonwebtoken');

const VerifyToken = (req, res, next) => {
  // Try to get token from cookie first
  let token = req.cookies?.accessToken;

  // If not in cookie, try Authorization header
  if (!token) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  // If no token found in either place
  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No token provided" });
  }

  // Verify the token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden - Invalid token" });
    }

    req.user = decoded.UserInfo.id;
    req.role = decoded.UserInfo.role;
    next();
  });
};

module.exports = VerifyToken;
