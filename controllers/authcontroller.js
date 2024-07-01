// authcontroller.js
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.SESSION_SECRET, { expiresIn:'3h' });
};

const registerUser = async (req, res) => {
    const { email, password, phoneNumber, name } = req.body;
    try {
        const user = new User({ email, password, phoneNumber, name });
        await user.save();
        const token = generateToken(user);
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 3 * 60 * 60 * 1000 });
        res.status(201).json({ msg: 'User Created Successfully', token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
          console.log("no user found")
            return res.status(400).json({ msg: 'Invalid email or password' });
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
          console.log("password mismatch")
            return res.status(400).json({ msg: 'Invalid email or password' });
        }
        const token = generateToken(user);
        console.log("User Logged in");
        res.cookie('token',token,{httpOnly:true,secure: process.env.NODE_ENV === 'production', maxAge: 3 * 60 * 60 * 1000 });
        res.json({ msg: 'Login Successful', token });
    } catch (err) {
      console.log("login error")
        res.status(500).json({ error: err.message });
    }
};

const verifySession = (req, res) => {
  try {
      const token = req.cookies.token;
      if (!token) {
          return res.status(401).json({ isAuthenticated: false, msg: 'No token, authorization denied auth' });
      }
      const decoded = jwt.verify(token, process.env.SESSION_SECRET);
      res.status(200).json({ isAuthenticated: true, user: decoded });
  } catch (err) {
      res.status(401).json({ isAuthenticated: false, msg: 'Token is not valid' });
  }
};



module.exports = { registerUser, loginUser,verifySession };
