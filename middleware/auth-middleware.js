const jwt = require('jsonwebtoken');
function verifyToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        if (error?.message === 'jwt expired') {
            return res.status(401).json({ error: 'Session expired', expiredAt: error?.expiredAt })
        }
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = verifyToken;