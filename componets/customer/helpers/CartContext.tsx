import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface CartContextType {
  cartCount: number;
  addToCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartCount, setCartCount] = useState<number>(0);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cartCount");
      if (saved) {
        setCartCount(parseInt(saved, 10));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cartCount", cartCount.toString());
    }
  }, [cartCount]);

  const addToCart = () => {
    setCartCount((prev) => prev + 1);
  };

  if (!hasMounted) {
    // Return null to avoid rendering on server and prevent hydration mismatch
    return null;
  }

  return (
    <CartContext.Provider value={{ cartCount, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};
