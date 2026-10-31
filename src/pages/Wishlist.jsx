
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";

export default function Wishlist() {
    const { wishlist, toggleWishlist } = useWishlist();

    if (wishlist.length === 0) {
        return (
            <section className="mx-auto max-w-7xl px-6 py-20 text-center">
                <div className="text-6xl text-gray-300">♡</div>

                <h1 className="mt-5 text-2xl font-normal text-gray-900">
                    Your wishlist is empty
                </h1>

                <p className="mt-3 text-gray-500">
                    Save your favourite products and find them here.
                </p>

                <Link
                    to="/shop"
                    className="mt-7 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
                >
                    Explore Products
                </Link>
            </section>
        );
    }

    return (
        <section className="mx-auto max-w-7xl px-6 py-10">
            <h1 className="text-xl font-normal text-gray-900">
                My Wishlist
            </h1>

            <p className="mt-2 text-sm text-gray-500">
                {wishlist.length} saved {wishlist.length === 1 ? "product" : "products"}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
                {wishlist.map((product) => (
                    <article
                        key={product.id}
                        className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                    >
                        <Link to={`/products/${product.slug}`}>
                            <div className="flex h-44 items-center justify-center bg-gray-50 p-4">
                                {product.images?.[0]?.image_url ? (
                                    <img
                                        src={product.images[0].image_url}
                                        alt={product.name}
                                        className="h-full w-full object-contain"
                                    />
                                ) : (
                                    <span className="text-gray-400">
                                        No image
                                    </span>
                                )}
                            </div>
                        </Link>

                        <div className="p-3">
                            <Link to={`/products/${product.slug}`}>
                                <h2 className="line-clamp-2 text-sm font-normal text-gray-800 hover:text-blue-600">
                                    {product.name}
                                </h2>
                            </Link>

                            <p className="mt-2 text-sm text-gray-900">
                                KSh {Number(
                                    product.sale_price > 0 &&
                                    product.sale_price < product.price
                                        ? product.sale_price
                                        : product.price
                                ).toLocaleString("en-KE")}
                            </p>

                            <button
                                type="button"
                                onClick={() => toggleWishlist(product)}
                                className="mt-4 w-full rounded-lg border border-red-200 py-2 text-xs text-red-600 transition hover:bg-red-50"
                            >
                                ♥ Remove from Wishlist
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
