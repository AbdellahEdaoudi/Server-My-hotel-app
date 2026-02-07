const jwt = require('jsonwebtoken');

const VerifyAdmin = (req, res, next) => {
    const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Forbidden: Invalid token' });

        // Check if role is admin
        if (decoded.UserInfo.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Require Admin Role' });
        }

        req.user = decoded.UserInfo.id;
        req.role = decoded.UserInfo.role;
        next();
    });
};

module.exports = VerifyAdmin;
