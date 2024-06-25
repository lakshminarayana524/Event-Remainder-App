const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/authcontroller');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login',loginUser);
router.post('/signup',registerUser)
router.post('/logout',logoutUser)

router.get('/verify-session', authMiddleware, (req, res) => {
    res.json({ msg: 'Session is valid', user: req.session });
});

module.exports= router;