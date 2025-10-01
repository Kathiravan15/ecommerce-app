// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();

// POST /api/orders
router.post('/', (req, res) => {
  const { firstName, lastName, address, items } = req.body;

  if (!firstName || !lastName || !address) {
    return res.status(400).json({ error: 'firstName, lastName, and address are required.' });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart items are required.' });
  }

  const total = items.reduce((sum, it) => sum + (it.price * (it.quantity || 1)), 0);

  const order = {
    id: Date.now(),
    firstName,
    lastName,
    address,
    items,
    total,
    createdAt: new Date().toISOString()
  };

  console.log("=== NEW ORDER ===");
  console.log(JSON.stringify(order, null, 2));
  console.log("=================");

  res.json({ message: "Order placed successfully!", orderId: order.id });
});

module.exports = router;
