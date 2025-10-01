// backend/data/products.js
const axios = require('axios');

// Fetch products dynamically from Fake Store API
async function fetchProducts() {
  try {
    const response = await axios.get('https://dummyjson.com/products');
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching products:", error.message);
    return [];
  }
}

module.exports = { fetchProducts };
