const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/authcontroller');
// const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login',loginUser);
router.post('/signup',registerUser)
router.post('/logout',logoutUser)

router.get('/verify-session', (req, res) => {
    if (req.session && req.session.userId) {
        res.json({ isAuthenticated: true, user: req.session });
    } else {
        res.json({ isAuthenticated: false });
    }
});
module.exports= router;