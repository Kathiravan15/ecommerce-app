// backend/routes/productRoutes.js

const express = require('express');
const router = express.Router();
const { fetchProducts } = require('../data/products');

// GET /api/products
router.get('/', async (req, res) => {
  const products = await fetchProducts();
  res.json(products);
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  const products = await fetchProducts();
  const product = products.find(p => p.id === parseInt(req.params.id));

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json(product);
});

module.exports = router;
