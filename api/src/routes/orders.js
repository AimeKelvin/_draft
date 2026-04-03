const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createOrder, getOrders, updateOrderStatus } = require('../controllers/orderController');

// Waiters/admins create orders
router.post('/', auth, createOrder);

// Get orders (with optional filters)
router.get('/', auth, getOrders);

// Update order status (kitchen/admin can call this; role checks can be added if needed)
router.patch('/:id/status', auth, updateOrderStatus);

module.exports = router;
