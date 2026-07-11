import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { token, user } = useAuth();

  useEffect(() => {
    if (user && token) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user, token]);

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user) throw new Error('Must be logged in');
    
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productId, quantity })
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    
    await fetchCart();
    return data;
  };

  const updateQuantity = async (cartItemId, quantity) => {
    const res = await fetch(`/api/cart/${cartItemId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ quantity })
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    
    await fetchCart();
    return data;
  };

  const removeFromCart = async (cartItemId) => {
    const res = await fetch(`/api/cart/${cartItemId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!res.ok) throw new Error('Error removing item');
    await fetchCart();
  };

  const clearCartState = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCartState }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
