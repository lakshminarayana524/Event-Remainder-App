const express = require('express');
const { registerUser, loginUser,verifySession } = require('../controllers/authcontroller');
// const verifySession = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/login', loginUser);
router.post('/signup', registerUser);
// router.post('/logout', logoutUser);

router.get('/verify-session', verifySession);

module.exports = router;
