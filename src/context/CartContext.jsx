import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { LanguageContext } from "./LanguageContext";
import { fetchCartItems, saveCartItem } from "../services/orderService";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const { language } = useContext(LanguageContext);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const loadCart = async () => {
      if (!user) {
        setCartItems([]);
        return;
      }
      try {
        const items = await fetchCartItems(user.id);
        setCartItems(items || []);
      } catch (error) {
        console.error("Unable to load cart:", error);
      }
    };

    loadCart();
  }, [user]);

  const addToCart = async (product) => {
    if (!user) return null;

    const productName = language === "ar" ? product.name_ar : product.name_en;
    const productId = product.id ?? product.product_id;

    try {
      const savedItem = await saveCartItem(user.id, product, productName);

      setCartItems((prevItems) => {
        const existingItem = prevItems.find((item) =>
          productId && item.product_id
            ? item.product_id === productId
            : item.product_name === productName
        );

        if (existingItem) {
          return prevItems.map((item) =>
            (productId && item.product_id
              ? item.product_id === productId
              : item.product_name === productName)
              ? savedItem
              : item
          );
        }

        return [...prevItems, savedItem];
      });

      return savedItem;
    } catch (error) {
      console.error("Unable to save cart item:", error);
      return null;
    }
  };

  // Called after a successful checkout to clear local cart state
  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, cartCount, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};