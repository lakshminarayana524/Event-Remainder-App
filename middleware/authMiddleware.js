const authMiddleware = (req, res, next) => {
    console.log("Session data:", req.session.userId);
    if (req.session && req.session.userId) {
      console.log("User is authenticated:", req.session.userId);
      next();
      // res.json({isAuthenticated:true})
    } else {
      console.log("Unauthorized: No session available");
      res.status(401).json({ msg: 'Unauthorized: No session available',isAuthenticated:false });
    }
  };
  
  module.exports = authMiddleware;
  