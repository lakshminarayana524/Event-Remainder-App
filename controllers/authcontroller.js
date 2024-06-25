const User = require('../models/user');

const registerUser = async (req, res) => {
    const { email, password, phoneNumber, name } = req.body;
    try {
        const user = new User({ email, password, phoneNumber, name });
        await user.save();
        req.session.userId = user._id;
        req.session.email = user.email;
        req.session.phoneNumber = user.phoneNumber;
        req.session.name = user.name;
        console.log("User registered and session set:", req.session);
        res.status(201).json({ msg: 'User Created Successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid email or password' });
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid email or password' });
        }
        req.session.userId = user._id;
        req.session.email = user.email;
        req.session.phoneNumber = user.phoneNumber;
        req.session.name = user.name;
        console.log("User logged in and session set:", req.session);
        res.json({ msg: 'Login Successful' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.clearCookie('connect.sid');
        console.log("User logged out and session destroyed");
        res.json({ message: 'User logged out successfully' });
    });
};

module.exports = { registerUser, loginUser, logoutUser };
