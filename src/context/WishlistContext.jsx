
import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState(() => {
        return JSON.parse(localStorage.getItem("anova_wishlist") || "[]");
    });

    useEffect(() => {
        localStorage.setItem("anova_wishlist", JSON.stringify(wishlist));
    }, [wishlist]);

    const toggleWishlist = (product) => {
        setWishlist((previous) => {
            const exists = previous.some(
                (item) => item.id === product.id
            );

            return exists
                ? previous.filter((item) => item.id !== product.id)
                : [...previous, product];
        });
    };

    const isInWishlist = (productId) =>
        wishlist.some((item) => item.id === productId);

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                toggleWishlist,
                isInWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    return useContext(WishlistContext);
}
