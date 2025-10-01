import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeItem,
  updateQty,
  clearOrderResult,
  placeOrder,
} from "../store/cartSlice";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";

export default function CartPage() {
  const items = useSelector((state) => state.cart.items || []);
  const placingOrder = useSelector((state) => state.cart.placingOrder);
  const orderResult = useSelector((state) => state.cart.orderResult);
  const orderError = useSelector((state) => state.cart.error);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [localMessage, setLocalMessage] = useState(null);

  const total = items.reduce((s, i) => s + i.price * (i.quantity || 1), 0);

  const handleUpdateQty = (id, qty) => {
    dispatch(updateQty({ id, quantity: qty }));
  };

    const handleRemove = (id) => {
    dispatch(removeItem(id));

    // If removing the last item, redirect after 2 seconds
    if (items.length === 1) {
      setTimeout(() => {
        navigate("/"); // go to product page
      }, 2000);
    }
  };

  const handlePlaceOrder = () => {
    setLocalMessage(null);

    if (!firstName.trim() || !lastName.trim() || !address.trim()) {
      setLocalMessage({
        type: "error",
        text: "Please provide first name, last name and address.",
      });
      return;
    }
    if (items.length === 0) {
      setLocalMessage({ type: "error", text: "Cart is empty." });
      return;
    }

    dispatch(placeOrder({ firstName, lastName, address, items }));
  };

  // Clear messages after 5s and navigate on success
  useEffect(() => {
    let t;
    if (orderResult || orderError || localMessage) {
      t = setTimeout(() => {
        dispatch(clearOrderResult());
        setLocalMessage(null);

        if (orderResult) navigate("/"); // redirect to products
      }, 2000);
    }
    return () => clearTimeout(t);
  }, [orderResult, orderError, localMessage, dispatch, navigate]);

  return (
    <div className="cart-page">
      <h2>Cart</h2>

      {/* Messages */}
      {orderResult && (
        <div className="cart-page__message cart-page__message--success">
          {orderResult.message || "Order placed successfully!"}
        </div>
      )}
      {orderError && (
        <div className="cart-page__message cart-page__message--error">
          {orderError}
        </div>
      )}
      {localMessage && (
        <div
          className={`cart-page__message ${
            localMessage.type === "error"
              ? "cart-page__message--error"
              : "cart-page__message--success"
          }`}
        >
          {localMessage.text}
        </div>
      )}

      {/* Cart content */}
      {items.length === 0 && !orderResult ? (
        <p>Your cart is empty.</p>
      ) : items.length > 0 ? (
        <div className="cart-page__content">
          {/* Items */}
          <div className="cart-page__items">
            {items.map((it) => (
              <div key={it.id} className="cart-page__item">
                <img src={it.thumbnail} alt={it.title} />
                <div className="cart-page__item-info">
                  <div>
                    <strong>{it.title}</strong>
                    <span>${(it.price * (it.quantity || 1)).toFixed(2)}</span>
                  </div>
                  <div className="cart-page__qty">
                    Qty:
                    <input
                      type="number"
                      min="1"
                      value={it.quantity}
                      onChange={(e) =>
                        handleUpdateQty(it.id, Number(e.target.value || 1))
                      }
                    />
                    <button
                      className="cart-page__remove-btn"
                      onClick={() => handleRemove(it.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <aside className="cart-page__summary">
            <h3>Order Summary</h3>
            <p>
              Total: <strong>${total.toFixed(2)}</strong>
            </p>
            <div className="shipping-row">
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
              />
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
              />
            </div>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              placeholder="Address"
            />
            <button onClick={handlePlaceOrder} disabled={placingOrder}>
              {placingOrder ? "Placing order..." : "Place Order"}
            </button>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
