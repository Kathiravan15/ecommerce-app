import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaStore } from "react-icons/fa"; // Store icon
import "./Header.css";

export default function Header() {
  const items = useSelector((state) => state.cart.items || []);
  const count = items.reduce((s, i) => s + (i.quantity || 0), 0);
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header__logo" onClick={() => navigate("/")}>
        <FaStore style={{ marginRight: "8px", color: "#1a73e8" }} size={28} />
        <h2 className="header__logo-text">MyShop</h2>
      </div>
      <nav className="header__nav">
        <Link to="/">Products</Link>
        <Link to="/cart" className="header__cart">
          Cart ({count})
        </Link>
      </nav>
    </header>
  );
}
