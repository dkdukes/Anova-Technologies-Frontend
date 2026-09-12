import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

const GUEST_CART_KEY = "anova-cart-guest";

export function CartProvider({ children }) {
  const {
    user,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);

  /*
   * Get the storage key for the current user.
   *
   * Guest:
   * anova-cart-guest
   *
   * Customer ID 5:
   * anova-cart-customer-5
   */
  const getCartKey = () => {
    if (user?.id) {
      return `anova-cart-customer-${user.id}`;
    }

    return GUEST_CART_KEY;
  };


  /*
   * Safely load a cart from localStorage.
   */
  const loadCart = (key) => {
    try {
      const savedCart = localStorage.getItem(key);

      if (!savedCart) {
        return [];
      }

      const parsedCart = JSON.parse(savedCart);

      if (!Array.isArray(parsedCart)) {
        return [];
      }

      return parsedCart;
    } catch (error) {
      console.error(
        "Failed to load cart:",
        error
      );

      return [];
    }
  };


  /*
   * Save a cart to localStorage.
   */
  const saveCart = (key, items) => {
    try {
      localStorage.setItem(
        key,
        JSON.stringify(items)
      );
    } catch (error) {
      console.error(
        "Failed to save cart:",
        error
      );
    }
  };


  /*
   * Merge guest cart into customer cart.
   *
   * Example:
   *
   * Guest:
   * Laptop x1
   * Mouse x2
   *
   * Customer:
   * Laptop x1
   * Keyboard x1
   *
   * Result:
   * Laptop x2
   * Mouse x2
   * Keyboard x1
   */
  const mergeGuestCart = (
    customerCart,
    guestCart
  ) => {
    if (!guestCart.length) {
      return customerCart;
    }

    const mergedCart = [...customerCart];

    guestCart.forEach((guestItem) => {
      const existingItemIndex =
        mergedCart.findIndex(
          (item) =>
            item.id === guestItem.id
        );

      /*
       * Product already exists in customer's cart.
       */
      if (existingItemIndex !== -1) {
        const existingItem =
          mergedCart[existingItemIndex];

        const combinedQuantity =
          Number(existingItem.quantity || 0) +
          Number(guestItem.quantity || 0);

        const stockQuantity = Number(
          existingItem.stock_quantity ??
            guestItem.stock_quantity ??
            0
        );

        mergedCart[existingItemIndex] = {
          ...existingItem,

          quantity:
            stockQuantity > 0
              ? Math.min(
                  combinedQuantity,
                  stockQuantity
                )
              : combinedQuantity,
        };

        return;
      }

      /*
       * Product doesn't exist in customer's cart.
       */
      const stockQuantity = Number(
        guestItem.stock_quantity || 0
      );

      mergedCart.push({
        ...guestItem,

        quantity:
          stockQuantity > 0
            ? Math.min(
                Number(guestItem.quantity || 1),
                stockQuantity
              )
            : Number(
                guestItem.quantity || 1
              ),
      });
    });

    return mergedCart;
  };


  /*
   * Load the correct cart whenever authentication
   * finishes or the logged-in customer changes.
   */
  useEffect(() => {
    if (authLoading) {
      return;
    }

    setCartLoading(true);

    /*
     * ================================
     * GUEST USER
     * ================================
     */
    if (!isAuthenticated || !user?.id) {
      const guestCart =
        loadCart(GUEST_CART_KEY);

      setCartItems(guestCart);
      setCartLoading(false);

      return;
    }


    /*
     * ================================
     * LOGGED-IN CUSTOMER
     * ================================
     */

    const customerCartKey =
      `anova-cart-customer-${user.id}`;

    const customerCart =
      loadCart(customerCartKey);

    const guestCart =
      loadCart(GUEST_CART_KEY);


    /*
     * Merge guest cart into customer's cart.
     */
    if (guestCart.length > 0) {
      const mergedCart = mergeGuestCart(
        customerCart,
        guestCart
      );

      /*
       * Save merged cart under the
       * customer's own key.
       */
      saveCart(
        customerCartKey,
        mergedCart
      );

      /*
       * Remove guest cart after merging.
       */
      localStorage.removeItem(
        GUEST_CART_KEY
      );

      setCartItems(mergedCart);
    } else {
      setCartItems(customerCart);
    }

    setCartLoading(false);
  }, [
    user?.id,
    isAuthenticated,
    authLoading,
  ]);


  /*
   * Save the current cart.
   *
   * This works for both:
   *
   * Guest:
   * anova-cart-guest
   *
   * Customer:
   * anova-cart-customer-ID
   */
  useEffect(() => {
    if (authLoading || cartLoading) {
      return;
    }

    const cartKey = getCartKey();

    saveCart(
      cartKey,
      cartItems
    );
  }, [
    cartItems,
    user?.id,
    isAuthenticated,
    authLoading,
    cartLoading,
  ]);


  /*
   * ================================
   * ADD PRODUCT
   * ================================
   */
  const addToCart = (
    product,
    quantity = 1
  ) => {
    setCartItems((currentItems) => {
      const existingItem =
        currentItems.find(
          (item) =>
            item.id === product.id
        );

      const stockQuantity = Number(
        product.stock_quantity || 0
      );

      /*
       * Product already exists.
       */
      if (existingItem) {
        const newQuantity =
          Number(existingItem.quantity || 0) +
          Number(quantity || 1);

        return currentItems.map(
          (item) =>
            item.id === product.id
              ? {
                  ...item,

                  sku: product.sku,

                  quantity:
                    stockQuantity > 0
                      ? Math.min(
                          newQuantity,
                          stockQuantity
                        )
                      : newQuantity,

                  stock_quantity:
                    stockQuantity ||
                    item.stock_quantity,
                }
              : item
        );
      }


      /*
       * New product.
       */
      const safeQuantity =
        stockQuantity > 0
          ? Math.min(
              Number(quantity || 1),
              stockQuantity
            )
          : Number(quantity || 1);

      return [
        ...currentItems,

        {
          id: product.id,

          sku: product.sku,

          name: product.name,

          slug: product.slug,

          price: Number(
            product.current_price ??
              product.sale_price ??
              product.price ??
              0
          ),

          image:
            product.images?.[0]
              ?.image_url || null,

          stock_quantity:
            stockQuantity,

          quantity:
            safeQuantity,
        },
      ];
    });
  };


  /*
   * ================================
   * REMOVE PRODUCT
   * ================================
   */
  const removeFromCart = (
    productId
  ) => {
    setCartItems(
      (currentItems) =>
        currentItems.filter(
          (item) =>
            item.id !== productId
        )
    );
  };


  /*
   * ================================
   * UPDATE QUANTITY
   * ================================
   */
  const updateQuantity = (
    productId,
    quantity
  ) => {
    setCartItems(
      (currentItems) =>
        currentItems.map(
          (item) => {
            if (
              item.id !== productId
            ) {
              return item;
            }

            const stockQuantity =
              Number(
                item.stock_quantity || 0
              );

            const requestedQuantity =
              Number(quantity);

            const safeQuantity =
              Math.max(
                1,
                requestedQuantity || 1
              );

            return {
              ...item,

              quantity:
                stockQuantity > 0
                  ? Math.min(
                      safeQuantity,
                      stockQuantity
                    )
                  : safeQuantity,
            };
          }
        )
    );
  };


  /*
   * ================================
   * CLEAR CART
   * ================================
   */
  const clearCart = () => {
    setCartItems([]);

    /*
     * Only remove the currently active
     * user's cart.
     */
    const cartKey =
      getCartKey();

    localStorage.removeItem(
      cartKey
    );
  };


  /*
   * ================================
   * TOTAL ITEMS
   * ================================
   */
  const totalItems =
    cartItems.reduce(
      (total, item) =>
        total +
        Number(
          item.quantity || 0
        ),
      0
    );


  /*
   * ================================
   * TOTAL PRICE
   * ================================
   */
  const totalPrice =
    cartItems.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
          Number(
            item.quantity || 0
          ),
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

        cartLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}


export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}