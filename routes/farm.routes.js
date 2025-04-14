const router = require('express').Router();
const farmController = require('../controllers/farm.controller');
const { isAuthenticated, isAdmin } = require('../middleware/auth.js');

// Get all farms (paginated)
router.get('/', farmController.getAllFarms);

// Create new farm (admin only)
router.post('/', isAuthenticated, isAdmin, farmController.createFarm);

// Update farm status (admin only)
router.patch('/:id/status', isAuthenticated, isAdmin, farmController.updateFarmStatus);

// Make investment in a farm
router.post('/:id/invest', isAuthenticated, farmController.investInFarm);

module.exports = router;