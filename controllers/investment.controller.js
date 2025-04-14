const Investment = require('../models/investment.model');
const Farm = require('../models/farm.model');

exports.getUserInvestments = async (req, res) => {
    try {
        const investments = await Investment.findAll({
            where: { userId: req.user.id },
            include: [{
                model: Farm,
                attributes: ['name', 'location', 'duration']
            }]
        });
        
        res.json(investments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getInvestmentDetails = async (req, res) => {
    try {
        const investment = await Investment.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            },
            include: [{
                model: Farm,
                attributes: ['name', 'location', 'duration', 'pricePerUnit']
            }]
        });

        if (!investment) {
            return res.status(404).json({ error: 'Investment not found' });
        }

        res.json(investment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { transaction_id } = req.query;
        const investment = await Investment.findOne({
            where: { id: req.params.id, userId: req.user.id }
        });

        if (!investment) {
            return res.status(404).json({ error: 'Investment not found' });
        }

        // Verify payment with Flutterwave
        const response = await flw.Transaction.verify({ id: transaction_id });
        
        if (response.data.status === "successful") {
            investment.paymentStatus = 'completed';
            await investment.save();
            res.json({ message: 'Payment verified successfully' });
        } else {
            investment.paymentStatus = 'failed';
            await investment.save();
            res.status(400).json({ error: 'Payment verification failed' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};