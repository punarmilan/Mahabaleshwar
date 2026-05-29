const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Property = require('../models/Property');
const auth = require('../middleware/auth');

// Middleware to check if user is admin
const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied. Admins only.' });
  }
  next();
};

// Get all users (Admin only)
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get all properties (Admin only)
router.get('/properties', auth, adminAuth, async (req, res) => {
  try {
    const properties = await Property.find().populate('owner', 'name email');
    res.json(properties);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Update property price (Admin only)
router.put('/property/:id/price', auth, adminAuth, async (req, res) => {
  try {
    const { price } = req.body;
    const property = await Property.findByIdAndUpdate(req.params.id, { price }, { new: true });
    res.json(property);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Approve/Reject property (Admin only)
router.put('/property/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    const property = await Property.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(property);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
