
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../services/api";
import ProductGallery from "../components/ProductGallery";
import QuantitySelector from "../components/QuantitySelector";
import { useCart } from "../context/CartContext";

function ProductDetails() {
    const { slug } = useParams();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Related products
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [relatedLoading, setRelatedLoading] = useState(true);

    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    /*
    |--------------------------------------------------------------------------
    | Fetch Product
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(`products/${slug}/`);

                setProduct(response.data);
            } catch (err) {
                console.error("Error fetching product:", err);

                setError(
                    "Unable to load this product. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchProduct();
        }
    }, [slug]);

    /*
    |--------------------------------------------------------------------------
    | Fetch Related Products
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            try {
                setRelatedLoading(true);

                const response = await api.get(
                    `products/${slug}/related/`
                );

                console.log(
                    "Related products response:",
                    response.data
                );

                const data = response.data;

                /*
                 * Django REST Framework may return either:
                 *
                 * [
                 *   {...},
                 *   {...}
                 * ]
                 *
                 * OR:
                 *
                 * {
                 *   count: 8,
                 *   results: [...]
                 * }
                 */

                if (Array.isArray(data)) {
                    setRelatedProducts(data);
                } else if (Array.isArray(data.results)) {
                    setRelatedProducts(data.results);
                } else {
                    setRelatedProducts([]);
                }

            } catch (err) {
                console.error(
                    "Error fetching related products:",
                    err
                );

                setRelatedProducts([]);
            } finally {
                setRelatedLoading(false);
            }
        };

        if (slug) {
            fetchRelatedProducts();
        }
    }, [slug]);

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>

                    <p className="text-gray-600">
                        Loading product...
                    </p>
                </div>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (error || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-5xl mb-4">
                        ⚠️
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Product Not Found
                    </h2>

                    <p className="text-gray-600 mb-6">
                        {error ||
                            "The product you are looking for does not exist."}
                    </p>

                    <Link
                        to="/shop"
                        className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
                    >
                        Back to Shop
                    </Link>
                </div>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Product Information
    |--------------------------------------------------------------------------
    */

    const productImages =
        product.images || [];

    const specifications =
        product.specifications || [];

    const highlights =
        product.highlights || [];

    const stock =
        Number(product.stock_quantity ?? product.stock ?? 0);

    const price =
        Number(product.price || 0);

    const salePrice =
        Number(product.sale_price || 0);

    const hasSale =
        salePrice > 0 && salePrice < price;

    const currentPrice =
        hasSale ? salePrice : price;

    /*
    |--------------------------------------------------------------------------
    | Product Image Helper
    |--------------------------------------------------------------------------
    */

    const getProductImage = (item) => {
        if (!item) {
            return null;
        }

        if (item.image) {
            return item.image;
        }

        if (item.image_url) {
            return item.image_url;
        }

        if (
            Array.isArray(item.images) &&
            item.images.length > 0
        ) {
            const primaryImage =
                item.images.find(
                    (image) => image.is_primary
                );

            return (
                primaryImage?.image_url ||
                item.images[0]?.image_url ||
                null
            );
        }

        return null;
    };

    /*
    |--------------------------------------------------------------------------
    | Safe Related Products Array
    |--------------------------------------------------------------------------
    */

    const productsArray = Array.isArray(
        relatedProducts
    )
        ? relatedProducts
        : [];

    /*
    |--------------------------------------------------------------------------
    | Split Related Products
    |--------------------------------------------------------------------------
    */

    const similarProducts =
        productsArray.filter((item) => {
            const categoryName =
                typeof item.category === "object"
                    ? item.category?.name
                    : item.category;

            return !String(categoryName || "")
                .toLowerCase()
                .includes("accessor");
        });

    const accessoryProducts =
        productsArray.filter((item) => {
            const categoryName =
                typeof item.category === "object"
                    ? item.category?.name
                    : item.category;

            return String(categoryName || "")
                .toLowerCase()
                .includes("accessor");
        });

    /*
    |--------------------------------------------------------------------------
    | Add To Cart
    |--------------------------------------------------------------------------
    */

    const handleAddToCart = () => {
        addToCart(product, quantity);

        setAddedToCart(true);

        setTimeout(() => {
            setAddedToCart(false);
        }, 3000);
    };

    /*
    |--------------------------------------------------------------------------
    | Quantity
    |--------------------------------------------------------------------------
    */

    const handleQuantityChange = (newQuantity) => {
        setQuantity(newQuantity);
    };

    /*
    |--------------------------------------------------------------------------
    | Product Card
    |--------------------------------------------------------------------------
    */

    const RelatedProductCard = ({ item }) => {
        const image = getProductImage(item);

        const itemPrice =
            Number(item.sale_price || 0) > 0 &&
            Number(item.sale_price) <
                Number(item.price)
                ? Number(item.sale_price)
                : Number(item.price || 0);

        return (
            <Link
                to={`/products/${item.slug}`}
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition duration-300"
            >
                {/* Image */}
                <div className="h-52 bg-gray-50 flex items-center justify-center overflow-hidden">
                    {image ? (
                        <img
                            src={image}
                            alt={
                                item.name ||
                                "Product"
                            }
                            className="w-full h-full object-contain p-4 group-hover:scale-105 transition duration-300"
                        />
                    ) : (
                        <div className="text-gray-400 text-sm">
                            No image
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="p-4">
                    {item.brand?.name && (
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                            {item.brand.name}
                        </p>
                    )}

                    <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-gray-600 transition">
                        {item.name}
                    </h3>

                    <div className="mt-3 flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                            KSh{" "}
                            {itemPrice.toLocaleString()}
                        </span>

                        {Number(
                            item.sale_price || 0
                        ) > 0 &&
                            Number(
                                item.sale_price
                            ) <
                                Number(
                                    item.price
                                ) && (
                                <span className="text-sm text-gray-400 line-through">
                                    KSh{" "}
                                    {Number(
                                        item.price
                                    ).toLocaleString()}
                                </span>
                            )}
                    </div>
                </div>
            </Link>
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <div className="bg-white min-h-screen">

            {/* ================================================================
                BREADCRUMB
            ================================================================= */}

            <div className="max-w-7xl mx-auto px-6 pt-6">
                <nav className="text-sm text-gray-500">
                    <Link
                        to="/"
                        className="hover:text-gray-900"
                    >
                        Home
                    </Link>

                    <span className="mx-2">
                        /
                    </span>

                    <Link
                        to="/shop"
                        className="hover:text-gray-900"
                    >
                        Shop
                    </Link>

                    <span className="mx-2">
                        /
                    </span>

                    <span className="text-gray-900">
                        {product.name}
                    </span>
                </nav>
            </div>

            {/* ================================================================
                PRODUCT
            ================================================================= */}

            <section className="max-w-7xl mx-auto px-6 py-10">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* ========================================================
                        GALLERY
                    ========================================================= */}

                    <div>
                        <ProductGallery
                            product={product}
                        />
                    </div>

                    {/* ========================================================
                        PRODUCT INFORMATION
                    ========================================================= */}

                    <div>

                        {/* Brand */}
                        {product.brand?.name && (
                            <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                                {product.brand.name}
                            </p>
                        )}

                        {/* Name */}
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {product.name}
                        </h1>

                        {/* SKU */}
                        {product.sku && (
                            <p className="text-sm text-gray-500 mb-5">
                                SKU: {product.sku}
                            </p>
                        )}

                        {/* Short Description */}
                        {product.short_description && (
                            <p className="text-gray-600 leading-relaxed mb-6">
                                {
                                    product.short_description
                                }
                            </p>
                        )}

                        {/* Price */}
                        <div className="mb-6">

                            <div className="flex items-center gap-3">

                                <span className="text-3xl font-bold text-gray-900">
                                    KSh{" "}
                                    {currentPrice.toLocaleString()}
                                </span>

                                {hasSale && (
                                    <span className="text-lg text-gray-400 line-through">
                                        KSh{" "}
                                        {price.toLocaleString()}
                                    </span>
                                )}

                            </div>

                            {hasSale && (
                                <span className="inline-block mt-2 bg-red-100 text-red-700 text-sm font-semibold px-3 py-1 rounded-full">
                                    Sale
                                </span>
                            )}

                        </div>

                        {/* Stock */}
                        <div className="mb-6">

                            {stock > 0 ? (
                                <p className="text-green-600 font-medium">
                                    ✓ In Stock
                                    {stock < 10 &&
                                        ` — Only ${stock} left`}
                                </p>
                            ) : (
                                <p className="text-red-600 font-medium">
                                    Out of Stock
                                </p>
                            )}

                        </div>

                        {/* Warranty */}
                        {product.warranty && (
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <p className="font-semibold text-gray-900">
                                    Warranty
                                </p>

                                <p className="text-gray-600 text-sm mt-1">
                                    {
                                        product.warranty
                                    }
                                </p>
                            </div>
                        )}

                        {/* Quantity */}
                        {stock > 0 && (
                            <div className="mb-5">

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quantity
                                </label>

                                <QuantitySelector
                                    quantity={quantity}
                                    setQuantity={
                                        handleQuantityChange
                                    }
                                    max={stock}
                                />

                            </div>
                        )}

                        {/* Add To Cart */}
                        <button
                            onClick={handleAddToCart}
                            disabled={stock <= 0}
                            className={`w-full py-4 rounded-lg font-semibold text-lg transition ${
                                stock > 0
                                    ? "bg-gray-900 text-white hover:bg-gray-800"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                        >
                            {stock > 0
                                ? "Add to Cart"
                                : "Out of Stock"}
                        </button>

                        {/* Success Message */}
                        {addedToCart && (
                            <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center">
                                ✓ Product added to cart successfully
                            </div>
                        )}

                        {/* Benefits */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">

                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl mb-2">
                                    🚚
                                </div>

                                <p className="font-semibold text-sm">
                                    Fast Delivery
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                    Across Kenya
                                </p>
                            </div>

                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl mb-2">
                                    🔒
                                </div>

                                <p className="font-semibold text-sm">
                                    Secure Payment
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                    Safe & reliable
                                </p>
                            </div>

                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl mb-2">
                                    🛡️
                                </div>

                                <p className="font-semibold text-sm">
                                    Genuine Products
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                    Quality guaranteed
                                </p>
                            </div>

                        </div>

                    </div>
                </div>

                {/* ============================================================
                    DESCRIPTION
                ============================================================= */}

                {product.description && (
                    <section className="mt-16 border-t border-gray-200 pt-10">

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Product Description
                        </h2>

                        <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                            {product.description}
                        </div>

                    </section>
                )}

                {/* ============================================================
                    HIGHLIGHTS
                ============================================================= */}

                {highlights.length > 0 && (
                    <section className="mt-12">

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Highlights
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {highlights.map(
                                (highlight, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                                    >
                                        <span className="text-green-600 font-bold">
                                            ✓
                                        </span>

                                        <span className="text-gray-700">
                                            {typeof highlight ===
                                            "object"
                                                ? highlight.text ||
                                                  highlight.name ||
                                                  JSON.stringify(
                                                      highlight
                                                  )
                                                : highlight}
                                        </span>
                                    </div>
                                )
                            )}

                        </div>

                    </section>
                )}

                {/* ============================================================
                    SPECIFICATIONS
                ============================================================= */}

                {specifications.length > 0 && (
                    <section className="mt-12">

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Specifications
                        </h2>

                        <div className="border border-gray-200 rounded-xl overflow-hidden">

                            {specifications.map(
                                (spec, index) => (
                                    <div
                                        key={
                                            spec.id ||
                                            index
                                        }
                                        className={`grid grid-cols-1 md:grid-cols-2 ${
                                            index % 2 === 0
                                                ? "bg-gray-50"
                                                : "bg-white"
                                        }`}
                                    >

                                        <div className="px-5 py-4 font-medium text-gray-900">
                                            {spec.name ||
                                                spec.key ||
                                                "Specification"}
                                        </div>

                                        <div className="px-5 py-4 text-gray-600">
                                            {spec.value ||
                                                spec.description ||
                                                "-"}
                                        </div>

                                    </div>
                                )
                            )}

                        </div>

                    </section>
                )}

                {/* ============================================================
                    PRODUCT INFORMATION
                ============================================================= */}

                <section className="mt-12">

                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Product Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {product.category?.name && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">
                                    Category
                                </p>

                                <p className="font-medium text-gray-900 mt-1">
                                    {
                                        product.category
                                            .name
                                    }
                                </p>
                            </div>
                        )}

                        {product.brand?.name && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">
                                    Brand
                                </p>

                                <p className="font-medium text-gray-900 mt-1">
                                    {
                                        product.brand
                                            .name
                                    }
                                </p>
                            </div>
                        )}

                        {product.sku && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">
                                    SKU
                                </p>

                                <p className="font-medium text-gray-900 mt-1">
                                    {product.sku}
                                </p>
                            </div>
                        )}

                        {product.slug && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">
                                    Product Code
                                </p>

                                <p className="font-medium text-gray-900 mt-1">
                                    {product.slug}
                                </p>
                            </div>
                        )}

                    </div>

                </section>

            </section>

            {/* ==================================================================
                YOU MAY ALSO LIKE
            =================================================================== */}

            {!relatedLoading &&
                similarProducts.length > 0 && (
                    <section className="bg-gray-50 py-14">

                        <div className="max-w-7xl mx-auto px-6">

                            <div className="flex items-center justify-between mb-8">

                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                        You May Also Like
                                    </h2>

                                    <p className="text-gray-500 mt-1">
                                        More products you might
                                        be interested in
                                    </p>
                                </div>

                                <Link
                                    to="/shop"
                                    className="text-sm font-semibold text-gray-900 hover:underline"
                                >
                                    View All
                                </Link>

                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                                {similarProducts
                                    .slice(0, 4)
                                    .map((item) => (
                                        <RelatedProductCard
                                            key={item.id}
                                            item={item}
                                        />
                                    ))}

                            </div>

                        </div>

                    </section>
                )}

            {/* ==================================================================
                COMPLETE YOUR SETUP
            =================================================================== */}

            {!relatedLoading &&
                accessoryProducts.length > 0 && (
                    <section className="py-14">

                        <div className="max-w-7xl mx-auto px-6">

                            <div className="mb-8">

                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                    Complete Your Setup
                                </h2>

                                <p className="text-gray-500 mt-1">
                                    Accessories and essentials
                                    that go perfectly with your
                                    purchase
                                </p>

                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                                {accessoryProducts
                                    .slice(0, 4)
                                    .map((item) => (
                                        <RelatedProductCard
                                            key={item.id}
                                            item={item}
                                        />
                                    ))}

                            </div>

                        </div>

                    </section>
                )}

            {/* ==================================================================
                RELATED PRODUCTS LOADING
            =================================================================== */}

            {relatedLoading && (
                <section className="py-14 bg-gray-50">

                    <div className="max-w-7xl mx-auto px-6">

                        <div className="mb-8">
                            <div className="h-8 w-56 bg-gray-200 rounded animate-pulse"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                            {[1, 2, 3, 4].map(
                                (item) => (
                                    <div
                                        key={item}
                                        className="bg-white rounded-xl overflow-hidden border border-gray-200"
                                    >

                                        <div className="h-52 bg-gray-200 animate-pulse"></div>

                                        <div className="p-4 space-y-3">

                                            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>

                                            <div className="h-5 bg-gray-200 rounded animate-pulse"></div>

                                            <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2"></div>

                                        </div>

                                    </div>
                                )
                            )}

                        </div>

                    </div>

                </section>
            )}

        </div>
    );
}

export default ProductDetails;
