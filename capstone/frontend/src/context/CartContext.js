import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (restaurant, menuItem, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(
        item => item.menuItem._id === menuItem._id && item.restaurant._id === restaurant._id
      );

      if (existingItem) {
        return prevCart.map(item =>
          item.menuItem._id === menuItem._id && item.restaurant._id === restaurant._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevCart, {
        restaurant: {
          _id: restaurant._id,
          name: restaurant.name,
          deliveryFee: restaurant.deliveryFee
        },
        menuItem,
        quantity
      }];
    });
  };

  const removeFromCart = (menuItemId, restaurantId) => {
    setCart(prevCart => 
      prevCart.filter(item => 
        !(item.menuItem._id === menuItemId && item.restaurant._id === restaurantId)
      )
    );
  };

  const updateQuantity = (menuItemId, restaurantId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId, restaurantId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.menuItem._id === menuItemId && item.restaurant._id === restaurantId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const groupCartByRestaurant = () => {
    const grouped = {};
    cart.forEach(item => {
      const restaurantId = item.restaurant._id;
      if (!grouped[restaurantId]) {
        grouped[restaurantId] = {
          restaurant: item.restaurant,
          items: []
        };
      }
      grouped[restaurantId].items.push(item);
    });
    return Object.values(grouped);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    groupCartByRestaurant
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};