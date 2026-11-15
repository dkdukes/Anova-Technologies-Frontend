
import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    useRef,
} from "react";

import api from "../services/api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
    const {
        user,
        isAuthenticated,
        isCustomer,
        loading: authLoading,
    } = useAuth();

    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Prevent outdated requests from updating the wishlist
    const requestIdRef = useRef(0);

    // Fetch the current customer's wishlist
    const fetchWishlist = useCallback(async () => {
        if (
            !isAuthenticated ||
            !isCustomer ||
            !user?.id
        ) {
            setWishlist([]);
            return;
        }

        const requestId = ++requestIdRef.current;

        try {
            setLoading(true);
            setError(null);

            const response = await api.get("wishlist/");

            const data = response.data;

            const items = Array.isArray(data)
                ? data
                : data.results || [];

            // Temporary debugging
            console.log("Authenticated user ID:", user?.id);
            console.log("Loaded wishlist:", items);

            // Only update state if this is still the latest request
            if (requestId === requestIdRef.current) {
                setWishlist(items);
            }
        } catch (err) {
            console.error(
                "Failed to load wishlist:",
                err.response?.data || err
            );

            if (requestId === requestIdRef.current) {
                setError(
                    err.response?.data?.detail ||
                    "Unable to load your wishlist."
                );
            }
        } finally {
            if (requestId === requestIdRef.current) {
                setLoading(false);
            }
        }
    }, [
        isAuthenticated,
        isCustomer,
        user?.id,
    ]);

    // Reload wishlist whenever authentication changes
    useEffect(() => {
        // Invalidate requests belonging to the previous authentication state
        requestIdRef.current += 1;

        if (authLoading) return;

        if (
            isAuthenticated &&
            isCustomer &&
            user?.id
        ) {
            fetchWishlist();
        } else {
            setWishlist([]);
            setError(null);
            setLoading(false);
        }
    }, [
        authLoading,
        isAuthenticated,
        isCustomer,
        user?.id,
        fetchWishlist,
    ]);

    // Add product to wishlist
    const addToWishlist = async (product) => {
        if (
            !isAuthenticated ||
            !isCustomer ||
            !user?.id
        ) {
            return { requiresLogin: true };
        }

        try {
            const response = await api.post(
                "wishlist/",
                {
                    product_id: product.id,
                }
            );

            setWishlist((previous) => {
                const exists = previous.some(
                    (item) =>
                        Number(item.product?.id) ===
                        Number(product.id)
                );

                return exists
                    ? previous
                    : [...previous, response.data];
            });

            setError(null);

            return { success: true };
        } catch (err) {
            console.error(
                "Failed to add product:",
                err.response?.data || err
            );

            throw err;
        }
    };

    // Remove product from wishlist
    const removeFromWishlist = async (wishlistId) => {
        if (
            !isAuthenticated ||
            !isCustomer ||
            !user?.id
        ) {
            return;
        }

        try {
            await api.delete(
                `wishlist/${wishlistId}/`
            );

            setWishlist((previous) =>
                previous.filter(
                    (item) =>
                        Number(item.id) !==
                        Number(wishlistId)
                )
            );
        } catch (err) {
            console.error(
                "Failed to remove product:",
                err.response?.data || err
            );

            throw err;
        }
    };

    // Check whether a product is saved
    const isInWishlist = (productId) => {
        return wishlist.some(
            (item) =>
                Number(item.product?.id) ===
                Number(productId)
        );
    };

    const value = {
        wishlist,
        loading,
        error,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        refreshWishlist: fetchWishlist,
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);

    if (!context) {
        throw new Error(
            "useWishlist must be used inside WishlistProvider"
        );
    }

    return context;
}
