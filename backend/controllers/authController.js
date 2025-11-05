const jwt = require('jsonwebtoken');
const User = require('../models/User');


const signToken = (user) => {
return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};


exports.signup = async (req, res) => {
try {
const { name, email, password } = req.body;
let user = await User.findOne({ email });
if (user) return res.status(400).json({ message: 'Email already registered' });
user = await User.create({ name, email, password });
const token = signToken(user);
res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
} catch (err) {
res.status(500).json({ message: err.message });
}
};


exports.login = async (req, res) => {
try {
const { email, password } = req.body;
const user = await User.findOne({ email });
if (!user) return res.status(400).json({ message: 'Invalid credentials' });
const isMatch = await user.comparePassword(password);
if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
const token = signToken(user);
res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
} catch (err) {
res.status(500).json({ message: err.message });
}
};