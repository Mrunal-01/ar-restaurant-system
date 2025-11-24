// backend/routes/orders.js
const express = require('express');
const {
  createOrder,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Public: customer creates order (no auth for now)
router.post('/', createOrder);

// Protected: staff/owner can view and update orders
router.get('/', requireAuth, requireRole('staff', 'owner'), getAllOrders);

router.patch(
  '/status/:id',
  requireAuth,
  requireRole('staff', 'owner'),
  updateOrderStatus
);

module.exports = router;
