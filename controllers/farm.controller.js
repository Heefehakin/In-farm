const Farm = require('../models/farm.model');
const Investment = require('../models/investment.model');
const Flutterwave = require('flutterwave-node-v3');

const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

exports.getAllFarms = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const farms = await Farm.findAndCountAll({
            where: { status: 'available' },
            limit,
            offset
        });

        res.json({
            farms: farms.rows,
            totalPages: Math.ceil(farms.count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createFarm = async (req, res) => {
    try {
        const { name, location, duration, pricePerUnit } = req.body;
        const farm = await Farm.create({
            name,
            location,
            duration,
            pricePerUnit,
            status: 'available'
        });
        res.status(201).json(farm);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.investInFarm = async (req, res) => {
    try {
        const { units } = req.body;
        const farm = await Farm.findByPk(req.params.id);

        if (!farm || farm.status !== 'available') {
            return res.status(400).json({ error: 'Farm not available' });
        }

        const totalAmount = units * farm.pricePerUnit;

        // Initialize Flutterwave payment
        const payload = {
            tx_ref: `INV-${Date.now()}`,
            amount: totalAmount,
            currency: 'NGN',
            redirect_url: `${req.protocol}://${req.get('host')}/payment/callback`,
            customer: {
                email: req.user.email
            },
            customizations: {
                title: `Investment in ${farm.name}`,
                description: `Purchase of ${units} units`
            }
        };

        const response = await flw.Charge.create(payload);
        
        // Create investment record
        await Investment.create({
            userId: req.user.id,
            farmId: farm.id,
            units,
            totalAmount,
            paymentStatus: 'pending'
        });

        res.status(200).json({
            success: true,
            farmName: farm.name,
            paymentLink: response.data.link
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateFarmStatus = async (req, res) => {
    try {
        const farm = await Farm.findByPk(req.params.id);
        if (!farm) {
            return res.status(404).json({ error: 'Farm not found' });
        }

        farm.status = farm.status === 'available' ? 'not available' : 'available';
        await farm.save();

        res.json(farm);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};