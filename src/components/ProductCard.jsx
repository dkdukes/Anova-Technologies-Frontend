import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

// Resolve local Django media paths and preserve existing absolute image URLs.
const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;

    if (/^https?:\/\//i.test(imageUrl)) {
        return imageUrl;
    }

    const mediaBaseUrl =
        import.meta.env.VITE_MEDIA_BASE_URL ||
        "http://127.0.0.1:8000";

    return `${mediaBaseUrl.replace(/\/+$/, "")}/${imageUrl.replace(/^\/+/, "")}`;
};

export default function ProductCard({ product }) {
    const navigate = useNavigate();

    const { isAuthenticated, isCustomer } = useAuth();

    const {
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
    } = useWishlist();

    const primaryImage = product.images?.[0];
    const imageUrl = getImageUrl(primaryImage?.image_url);
    const hasImage = Boolean(imageUrl);

    const isFavorite = isInWishlist(product.id);

    // Pricing
    const price = Number(product.price || 0);
    const salePrice = Number(product.sale_price || 0);

    const hasSale =
        salePrice > 0 && salePrice < price;

    const currentPrice = hasSale ? salePrice : price;

    // Wishlist action
    const handleWishlistClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated || !isCustomer) {
            navigate("/login", {
                state: {
                    from: `/products/${product.slug}`,
                },
            });
            return;
        }

        try {
            if (isFavorite) {
                const savedItem = wishlist.find(
                    (item) =>
                        Number(item.product?.id) ===
                        Number(product.id)
                );

                if (savedItem) {
                    await removeFromWishlist(savedItem.id);
                }
            } else {
                await addToWishlist(product);
            }
        } catch (error) {
            console.error(
                "Wishlist action failed:",
                error
            );
        }
    };

    return (
        <article className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg">

            {/* Product Image */}
            <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gray-50 p-4">

                <Link
                    to={`/products/${product.slug}`}
                    className="flex h-full w-full items-center justify-center"
                >
                    {hasImage ? (
                        <img
                            src={imageUrl}
                            alt={
                                primaryImage?.alt_text ||
                                product.name
                            }
                            className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                            onError={(e) => {
                                console.error(
                                    "Product image failed to load:",
                                    e.currentTarget.src
                                );
                            }}
                        />
                    ) : (
                        <p className="text-xs text-gray-400">
                            Product image coming soon
                        </p>
                    )}
                </Link>

                {/* Wishlist Button */}
                <button
                    type="button"
                    onClick={handleWishlistClick}
                    aria-label={
                        isFavorite
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                    }
                    aria-pressed={isFavorite}
                    className="absolute right-3 top-3 z-20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110"
                >
                    <span
                        className={`text-xl ${
                            isFavorite
                                ? "text-red-500"
                                : "text-gray-400"
                        }`}
                    >
                        {isFavorite ? "♥" : "♡"}
                    </span>
                </button>

                {/* Sale Badge */}
                {hasSale && (
                    <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-red-500 px-2 py-1 text-[10px] font-normal text-white">
                        Sale
                    </span>
                )}

                {/* Featured Badge */}
                {product.is_featured && (
                    <span className="pointer-events-none absolute left-2 bottom-2 rounded-full bg-blue-600 px-2 py-1 text-[10px] font-normal text-white">
                        Featured
                    </span>
                )}
            </div>

            {/* Product Information */}
            <div className="p-3">

                {/* Product Name */}
                <Link
                    to={`/products/${product.slug}`}
                    className="block"
                >
                    <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-normal text-gray-800 transition group-hover:text-blue-600">
                        {product.name}
                    </h3>
                </Link>

                {/* Price */}
                <div className="mt-3">
                    {hasSale ? (
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-base font-normal text-gray-900">
                                KSh {currentPrice.toLocaleString()}
                            </span>

                            <span className="text-xs font-normal text-gray-400 line-through">
                                KSh {price.toLocaleString()}
                            </span>
                        </div>
                    ) : (
                        <span className="text-base font-normal text-gray-900">
                            KSh {currentPrice.toLocaleString()}
                        </span>
                    )}
                </div>

                {/* Reviews */}
                <div className="mt-1 flex items-center gap-1.5 text-sm">
                    {product.review_count > 0 ? (
                        <>
                            <span className="text-amber-500">
                                {"★".repeat(
                                    Math.round(product.average_rating)
                                )}
                                {"☆".repeat(
                                    5 - Math.round(product.average_rating)
                                )}
                            </span>

                            <span className="font-normal text-gray-700">
                                {Number(product.average_rating).toFixed(1)}
                            </span>

                            <span className="text-gray-500">
                                ({product.review_count}{" "}
                                {product.review_count === 1
                                    ? "review"
                                    : "reviews"})
                            </span>
                        </>
                    ) : (
                        <span className="text-xs text-gray-500">
                            Not yet rated
                        </span>
                    )}
                </div>

                {/* View Product */}
                <Link
                    to={`/products/${product.slug}`}
                    className="mt-3 block rounded-lg bg-gray-900 px-3 py-2 text-center text-xs font-normal text-white transition hover:bg-blue-600"
                >
                    View Product
                </Link>
            </div>
        </article>
    );
}
