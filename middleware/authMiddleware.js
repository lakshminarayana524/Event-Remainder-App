const jwt = require('jsonwebtoken');
const User = require('../models/user');

const verifySession = async (req, res, next) => {
    const userId = req.headers['user-id'];
    if (!userId) {
        return res.status(401).json({ msg: 'No user ID provided, authorization denied' });
    }

    try {
        const user = await User.findById({_id:userId});
        if (!user) {
            return res.status(401).json({ msg: 'User not found, authorization denied' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error verifying session:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

module.exports = verifySession;



// const verifySession = (req, res, next) => {
//   try {
//       const token = req.cookies.token;
//       if (!token) {
//         console.log("No token");
//           return res.status(401).json({ isAuthenticated: false, msg: 'No token, authorization denied middleware' });
//       }
//       const decoded = jwt.verify(token, process.env.SESSION_SECRET);
//       req.session.user = decoded
//       next();
//   } catch (err) {
//       res.status(401).json({ isAuthenticated: false, msg: 'Token is not valid' });
//   }
// };

// module.exports = verifySession;
