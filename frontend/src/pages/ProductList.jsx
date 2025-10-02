// src/pages/ProductList.js
import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("products==", products);
 
  useEffect(() => {
  const fetchProducts = async () => {
    setLoading(true);
    try {
      let data;
      try {
        // Try local API first
        const response = await fetch('http://localhost:4000/api/products');
        if (!response.ok) {
          throw new Error(`Local API error: ${response.status}`);
        }
        data = await response.json();
      } catch (localError) {
        console.error('Local API failed:', localError.message);
        // Fallback to dummy API
        const response = await fetch('https://dummyjson.com/products');
        if (!response.ok) {
          throw new Error(`Dummy API error: ${response.status}`);
        }
        data = await response.json();
      }

      // Handle different response formats
      if (Array.isArray(data)) setProducts(data);
      else if (data.products && Array.isArray(data.products)) setProducts(data.products);
      else setProducts([]);
    } catch (err) {
      console.error('Fetch failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div>
      <h2>Products</h2>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {products?.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
