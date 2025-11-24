// backend/routes/dishes.js
const express = require('express');
const {
  getAllDishes,
  getDishById,
  createDish,
  updateDish,
  deleteDish,
} = require('../controllers/dishController');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Public: customers
router.get('/', getAllDishes);
router.get('/:id', getDishById);

// Owner only: manage dishes
router.post('/', requireAuth, requireRole('owner'), createDish);
router.put('/:id', requireAuth, requireRole('owner'), updateDish);
router.delete('/:id', requireAuth, requireRole('owner'), deleteDish);

module.exports = router;
