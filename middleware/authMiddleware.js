const authMiddleware = (req, res, next) => {
    if (req.session && req.session.userId) {
        console.log("User is authenticated:", req.session.userId);
        next(); // User is authenticated, proceed to the next middleware or route handler
    } else {
        console.log("Unauthorized: No session available");
        res.status(401).json({ msg: 'Unauthorized: No session available' });
    }
};

module.exports = authMiddleware;
