const User = require('../models/user.model');
const passport = require('passport');

exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Error logging out' });
        }
        res.redirect('/');
    });
};

exports.getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'email', 'role']
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.loginSuccess = (req, res) => {
    if (req.user) {
        res.json({
            success: true,
            message: 'User authenticated',
            user: {
                id: req.user.id,
                email: req.user.email,
                role: req.user.role
            }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Not authenticated'
        });
    }
};

exports.loginFailed = (req, res) => {
    res.status(401).json({
        success: false,
        message: 'Authentication failed'
    });
};