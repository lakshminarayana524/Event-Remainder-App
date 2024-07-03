const express = require('express');
const { registerUser, loginUser, verifySession } = require('../controllers/authcontroller');
const router = express.Router();

router.post('/login', loginUser);
router.post('/signup', registerUser);
router.get('/verify-session', verifySession);

module.exports = router;
