const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/authcontroller');

const router = express.Router();

router.post('/login',loginUser);
router.post('/signup',registerUser)
router.post('/logout',logoutUser)

module.exports= router;