const router = require('express').Router();
const userController = require('../controllers/user.controller');
const { isAuthenticated } = require('../middleware/auth');

// Get user profile
router.get('/profile', isAuthenticated, userController.getUserProfile);

// Update user profile
router.put('/profile', isAuthenticated, userController.updateUserProfile);

// Delete user account
router.delete('/account', isAuthenticated, userController.deleteAccount);

module.exports = router;