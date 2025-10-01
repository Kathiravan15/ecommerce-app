import React from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '../store/cartSlice';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  if (!product) return null;

  const productTitle = product.title || product.name || 'Product';
  const productPrice = Number(product.price) || 0;
  const productThumbnail =
    product.thumbnail ||
    product.image ||
    (product.images && product.images[0]) ||
    'https://via.placeholder.com/250x160?text=No+Image';

  const addToCart = () => {
    dispatch(
      addItem({
        id: product.id,
        title: productTitle,
        price: productPrice,
        thumbnail: productThumbnail,
      })
    );
  };

  return (
    <div className="product-card">
      <img
        src={productThumbnail}
        alt={productTitle}
        className="product-card__image"
      />
      <h3 className="product-card__title">{productTitle}</h3>
      <p className="product-card__desc">{product.description || 'No description available'}</p>
      <div className="product-card__footer">
        <span className="product-card__price">${productPrice.toFixed(2)}</span>
        <button className="product-card__btn" onClick={addToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
