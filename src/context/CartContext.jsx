// CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  // Cập nhật localStorage khi cart thay đổi
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    const existing = cart.find(
      (c) => c.product_id === item.product_id && c.variant_id === item.variant_id
    );
    let newCart;
    if (existing) {
      newCart = cart.map((c) =>
        c.product_id === item.product_id && c.variant_id === item.variant_id
          ? { ...c, quantity: c.quantity + item.quantity }
          : c
      );
    } else {
      newCart = [...cart, item];
    }
    setCart(newCart);
  };

  const updateQty = (variant_id, product_id, quantity) => {
    const newCart = cart.map((c) =>
      c.product_id === product_id && c.variant_id === variant_id
        ? { ...c, quantity }
        : c
    );
    setCart(newCart);
  };

  const removeFromCart = (variant_id, product_id) => {
    const newCart = cart.filter(
      (c) => !(c.product_id === product_id && c.variant_id === variant_id)
    );
    setCart(newCart);
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
