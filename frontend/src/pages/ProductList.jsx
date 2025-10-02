// src/pages/ProductList.js
import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("products==", products);
  useEffect(() => {
    fetch('http://localhost:4000/api/products')
    // fetch("https://dummyjson.com/products")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch products");
        return r.json();
      })
      .then((data) => {
        // support both: array OR object with products property
        if (Array.isArray(data)) setProducts(data);
        else if (data.products && Array.isArray(data.products))
          setProducts(data.products);
        else setProducts([]);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
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
