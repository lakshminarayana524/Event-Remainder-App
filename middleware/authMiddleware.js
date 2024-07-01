const jwt = require('jsonwebtoken');

const verifySession = (req, res, next) => {
  try {
      const token = req.cookies.token;
      if (!token) {
        console.log("No token");
          return res.status(401).json({ isAuthenticated: false, msg: 'No token, authorization denied middleware' });
      }
      const decoded = jwt.verify(token, process.env.SESSION_SECRET);
      req.session.user = decoded
      next();
  } catch (err) {
      res.status(401).json({ isAuthenticated: false, msg: 'Token is not valid' });
  }
};

module.exports = verifySession;
