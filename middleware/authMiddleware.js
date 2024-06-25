const authMiddleware = (req, res, next) => {
    if (req.session && req.session.userId) {
        next(); // User is authenticated, proceed to the next middleware or route handler
    } else {
        res.status(401).json({ msg: 'Unauthorized: No session available' });
    }
};

module.exports = authMiddleware;
