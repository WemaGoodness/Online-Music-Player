const User = require('../models/usermodel');
const jwt = require('jsonwebtoken');

// Controller to handle user signup
exports.signup = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Create new user instance and save to database
        const user = new User({ username, password });
        await user.save();

        // Generate JWT token for the user, valid for 30 days
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        res.status(201).json({ token }); // Send token to client
    } catch (error) {
        res.status(500).json({ message: 'Error signing up', error: error.message });
    }
};

// Controller to handle user login
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists in the database
        const user = await User.findOne({ username });

        // Validate password, return error if invalid
        if (!user || !(await user.match_password(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token for the user, valid for 30 days
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        res.status(200).json({ token }); // Send token to client
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};
