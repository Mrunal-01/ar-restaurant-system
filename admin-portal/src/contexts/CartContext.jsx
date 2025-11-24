// frontend/src/contexts/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [tableNumber, setTableNumber] = useState(null);

  const location = useLocation();

  // Read ?table= from URL and store in state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const table = params.get('table');

    if (table) {
      setTableNumber(table);
    }
  }, [location.search]);

  const addItem = (dish, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.id === dish.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...dish, quantity }];
    });
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQty = (id, quantity) => {
    const qty = Number(quantity);
    if (Number.isNaN(qty) || qty <= 0) {
      // If invalid or <= 0 → remove item
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const value = {
    cartItems,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    getTotal,
    cartCount,
    tableNumber,
    setTableNumber,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used inside a CartProvider');
  }
  return ctx;
}
