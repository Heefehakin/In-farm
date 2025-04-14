const router = require('express').Router();
const investmentController = require('../controllers/investment.controller');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, investmentController.getUserInvestments);
router.get('/:id', isAuthenticated, investmentController.getInvestmentDetails);
router.get('/:id/verify-payment', isAuthenticated, investmentController.verifyPayment);

module.exports = router;