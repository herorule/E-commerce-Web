import React, { useEffect, useContext, useState, useCallback } from "react";

const getLocalStorage = () => {
  let cart = localStorage.getItem("cart");
  if (cart) {
    return JSON.parse(localStorage.getItem("cart"));
  } else {
    return [];
  }
};

const CartContext = React.createContext();

export const CartProvider = ({ children }) => {
  const [c, sC] = useState(getLocalStorage());
  // c:card, setcard: sc

  const addToCart = useCallback((id, amount, product) => {
    sC((prev) => {
      const f = prev.find((p) => p._id === id);
      if (!f) {
        return [...prev, { ...product, amount }];
      } else {
        return prev.map((p) => {
          if (p._id === id) {
            return { ...p, amount: p.amount + amount }; // Tạo bản sao và cập nhật giá trị amount
          }
          return p;
        });
      }
    });
  }, []);

  const removeItem = (id) => {
    sC((prev) => prev.filter((p) => p._id !== id));
  };

  const clearCart = () => {
    sC([]);
  };

  // toggle amount
  const toggleAmount = (id, value) => {
    sC(prev => prev.map(p => {
             if(p._id === id) {
                  const newVal = p.amount + value
                  return { ...p, amount: newVal < 0 ? 0 : newVal }
             }
             return p
          }))
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(c));
  }, [c]);

  return (
    <CartContext.Provider
      value={{ c, addToCart, removeItem, clearCart, toggleAmount }}
    >
      {children}
    </CartContext.Provider>
  );
};
// make sure use
export const useCartContext = () => {
  return useContext(CartContext);
};
