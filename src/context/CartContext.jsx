import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("anova-cart");

    return savedCart
      ? JSON.parse(savedCart)
      : [];
  });

  /* Save cart whenever it changes */
  useEffect(() => {
    localStorage.setItem(
      "anova-cart",
      JSON.stringify(cartItems)
    );
  }, [cartItems]);


  /* Add product */
  const addToCart = (product, quantity = 1) => {
    setCartItems((currentItems) => {

      const existingItem = currentItems.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                sku:product.sku,
                quantity: Math.min(
                  item.quantity + quantity,
                  product.stock_quantity
                ),
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          id: product.id,
          sku: product.sku,
          name: product.name,
          slug: product.slug,
          price: Number(product.current_price),
          image:
            product.images?.[0]?.image_url || null,
          stock_quantity: product.stock_quantity,
          quantity,
        },
      ];
    });
  };


  /* Remove product */
  const removeFromCart = (productId) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== productId
      )
    );
  };


  /* Update quantity */
  const updateQuantity = (productId, quantity) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: Math.min(
                Math.max(1, quantity),
                item.stock_quantity
              ),
            }
          : item
      )
    );
  };


  /* Clear cart */
  const clearCart = () => {
    setCartItems([]);
  };


  /* Total items */
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );


  /* Total price */
  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );


  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}


export function useCart() {
  return useContext(CartContext);
}