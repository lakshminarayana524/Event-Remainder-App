const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Function to format phone number with +91 prefix
const formatPhoneNumber = (phoneNumber) => {
    return `+91${phoneNumber.replace(/\D/g, '')}`;
};

const registerUser = async (req, res) => {
    const { email, password, phoneNumber, name } = req.body;
    try {
        // Format the phone number
        const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

        const user = new User({ email, password, phone: formattedPhoneNumber, name });
        await user.save();
        res.status(201).json({ msg: 'User Created Successfully', userId: user._id });
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
        res.json({ msg: 'Login Successful', userId: user._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const verifySession = async (req, res) => {
    const userId = req.headers['user-id'];
    if (!userId) {
        return res.status(401).json({ isAuthenticated: false, msg: 'No userId, authorization denied' });
    }

    try {
        const user = await User.findById(userId).lean();
        if (!user) {
            return res.status(401).json({ isAuthenticated: false, msg: 'User not found' });
        }
        res.status(200).json({ isAuthenticated: true, user: { _id: user._id, email: user.email, name: user.name, phoneNumber: user.phone } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { registerUser, loginUser, verifySession };
