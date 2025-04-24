const router = require('express').Router();
const passport = require('passport');
const authController = require('../controllers/auth.controller');

// Google OAuth login route
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    accessType: 'offline',
    prompt: 'consent'
  })
);

// Google OAuth callback route
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/auth/login-failed',
    session: true 
  }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

// Get current user
router.get('/current-user', authController.getCurrentUser);

// Login success
router.get('/login-success', authController.loginSuccess);

// Login failed
router.get('/login-failed', authController.loginFailed);

// Logout route
router.get('/logout', authController.logout);

module.exports = router;