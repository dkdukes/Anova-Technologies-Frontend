import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `admin/products/${id}/`
            );

            setProduct(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load product.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${product.name}"?`
        );

        if (!confirmed) return;

        try {
            await api.delete(`admin/products/${id}/`);

            navigate("/admin/products");
        } catch (err) {
            console.error(err);
            setError("Failed to delete product.");
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-gray-500">
                    Loading product...
                </p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="p-6">
                <div className="rounded-lg bg-red-50 p-4 text-red-700">
                    {error || "Product not found."}
                </div>

                <Link
                    to="/admin/products"
                    className="mt-4 inline-block text-sm font-medium text-gray-700 hover:underline"
                >
                    ← Back to Products
                </Link>
            </div>
        );
    }

    const primaryImages =
        product.images?.filter(
            (image) => image.is_primary
        ) || [];

    const otherImages =
        product.images?.filter(
            (image) => !image.is_primary
        ) || [];

    return (
        <div className="space-y-6 p-4 sm:p-6">

            {/* =====================================================
                HEADER
            ====================================================== */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <Link
                        to="/admin/products"
                        className="text-sm text-gray-500 transition hover:text-gray-900"
                    >
                        ← Back to Products
                    </Link>

                    <h1 className="mt-2 text-2xl font-bold text-gray-900">
                        {product.name}
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Product #{product.id}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">

                    {/* Edit */}
                    <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
                    >
                        Edit Product
                    </Link>

                    {/* Delete */}
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                        Delete
                    </button>

                </div>
            </div>


            {/* =====================================================
                MAIN GRID
            ====================================================== */}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                {/* =================================================
                    LEFT COLUMN
                ================================================== */}

                <div className="space-y-6 lg:col-span-2">


                    {/* =================================================
                        PRODUCT INFORMATION
                    ================================================== */}

                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                        <h2 className="mb-5 text-lg font-semibold text-gray-900">
                            Product Information
                        </h2>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                            {/* Product Name */}
                            <div>
                                <p className="text-xs uppercase tracking-wide text-gray-400">
                                    Product Name
                                </p>

                                <p className="mt-1 font-medium text-gray-900">
                                    {product.name}
                                </p>
                            </div>


                            {/* SKU */}
                            <div>
                                <p className="text-xs uppercase tracking-wide text-gray-400">
                                    SKU
                                </p>

                                <p className="mt-1 font-medium text-gray-900">
                                    {product.sku || "—"}
                                </p>
                            </div>


                            {/* Category */}
                            <div>
                                <p className="text-xs uppercase tracking-wide text-gray-400">
                                    Category
                                </p>

                                <p className="mt-1 font-medium text-gray-900">
                                    {product.category_name ||
                                        product.category?.name ||
                                        "—"}
                                </p>
                            </div>


                            {/* Brand */}
                            <div>
                                <p className="text-xs uppercase tracking-wide text-gray-400">
                                    Brand
                                </p>

                                <p className="mt-1 font-medium text-gray-900">
                                    {product.brand_name ||
                                        product.brand?.name ||
                                        "—"}
                                </p>
                            </div>


                            {/* Condition */}
                            <div>
                                <p className="text-xs uppercase tracking-wide text-gray-400">
                                    Condition
                                </p>

                                <p className="mt-1 font-medium capitalize text-gray-900">
                                    {product.condition || "—"}
                                </p>
                            </div>


                            {/* Warranty */}
                            <div>
                                <p className="text-xs uppercase tracking-wide text-gray-400">
                                    Warranty
                                </p>

                                <p className="mt-1 font-medium text-gray-900">
                                    {product.warranty || "—"}
                                </p>
                            </div>


                            {/* Weight */}
                            <div>
                                <p className="text-xs uppercase tracking-wide text-gray-400">
                                    Weight
                                </p>

                                <p className="mt-1 font-medium text-gray-900">
                                    {product.weight
                                        ? `${product.weight} kg`
                                        : "—"}
                                </p>
                            </div>


                            {/* Dimensions */}
                            <div>
                                <p className="text-xs uppercase tracking-wide text-gray-400">
                                    Package Dimensions
                                </p>

                                <p className="mt-1 font-medium text-gray-900">
                                    {product.package_length &&
                                    product.package_width &&
                                    product.package_height
                                        ? `${product.package_length} × ${product.package_width} × ${product.package_height}`
                                        : "—"}
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        SHORT DESCRIPTION
                    ================================================== */}

                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                        <h2 className="mb-4 text-lg font-semibold text-gray-900">
                            Short Description
                        </h2>

                        <p className="whitespace-pre-line text-sm leading-7 text-gray-600">
                            {product.short_description ||
                                "No short description available."}
                        </p>

                    </div>


                    {/* =================================================
                        DESCRIPTION
                    ================================================== */}

                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                        <h2 className="mb-4 text-lg font-semibold text-gray-900">
                            Description
                        </h2>

                        <p className="whitespace-pre-line text-sm leading-7 text-gray-600">
                            {product.description ||
                                "No description available."}
                        </p>

                    </div>


                    {/* =================================================
                        HIGHLIGHTS
                    ================================================== */}

                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                        <h2 className="mb-4 text-lg font-semibold text-gray-900">
                            Highlights
                        </h2>

                        {product.highlights?.length > 0 ? (
                            <ul className="space-y-3">

                                {product.highlights.map(
                                    (highlight, index) => (
                                        <li
                                            key={index}
                                            className="flex gap-3 text-sm text-gray-600"
                                        >
                                            <span className="font-bold text-gray-900">
                                                •
                                            </span>

                                            <span>
                                                {highlight}
                                            </span>
                                        </li>
                                    )
                                )}

                            </ul>
                        ) : (
                            <p className="text-sm text-gray-400">
                                No highlights available.
                            </p>
                        )}

                    </div>


                    {/* =================================================
                        SPECIFICATIONS
                    ================================================== */}

                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                        <h2 className="mb-4 text-lg font-semibold text-gray-900">
                            Specifications
                        </h2>

                        {product.specifications?.length > 0 ? (
                            <div className="divide-y divide-gray-100">

                                {product.specifications.map(
                                    (spec) => (
                                        <div
                                            key={spec.id}
                                            className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                                        >
                                            <span className="font-medium text-gray-700">
                                                {spec.name}
                                            </span>

                                            <span className="text-gray-500 sm:text-right">
                                                {spec.value}
                                            </span>
                                        </div>
                                    )
                                )}

                            </div>
                        ) : (
                            <p className="text-sm text-gray-400">
                                No specifications available.
                            </p>
                        )}

                    </div>

                </div>


                {/* =================================================
                    RIGHT COLUMN
                ================================================== */}

                <div className="space-y-6">


                    {/* =================================================
                        PRODUCT IMAGES
                    ================================================== */}

                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                        <h2 className="mb-4 text-lg font-semibold text-gray-900">
                            Product Images
                        </h2>


                        {product.images?.length > 0 ? (
                            <div className="space-y-4">

                                {/* Primary Image */}

                                {primaryImages.length > 0 ? (
                                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">

                                        <img
                                            src={
                                                primaryImages[0]
                                                    .image_url
                                            }
                                            alt={
                                                primaryImages[0]
                                                    .alt_text ||
                                                product.name
                                            }
                                            className="h-64 w-full object-contain"
                                        />

                                    </div>
                                ) : (
                                    <div className="flex h-64 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">
                                        No primary image
                                    </div>
                                )}


                                {/* Other Images */}

                                {otherImages.length > 0 && (
                                    <div className="grid grid-cols-2 gap-3">

                                        {otherImages.map(
                                            (image) => (
                                                <div
                                                    key={image.id}
                                                    className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                                                >

                                                    <img
                                                        src={
                                                            image.image_url
                                                        }
                                                        alt={
                                                            image.alt_text ||
                                                            product.name
                                                        }
                                                        className="h-32 w-full object-contain"
                                                    />

                                                </div>
                                            )
                                        )}

                                    </div>
                                )}

                            </div>
                        ) : (
                            <div className="flex h-48 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">
                                No product images
                            </div>
                        )}

                    </div>


                    {/* =================================================
                        PRICING
                    ================================================== */}

                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                        <h2 className="mb-4 text-lg font-semibold text-gray-900">
                            Pricing
                        </h2>

                        <div className="space-y-4">

                            {/* Regular Price */}
                            <div className="flex items-center justify-between gap-4">

                                <span className="text-sm text-gray-500">
                                    Regular Price
                                </span>

                                <span className="font-semibold text-gray-900">
                                    KSh{" "}
                                    {product.price}
                                </span>

                            </div>


                            {/* Sale Price */}
                            <div className="flex items-center justify-between gap-4">

                                <span className="text-sm text-gray-500">
                                    Sale Price
                                </span>

                                <span className="font-semibold text-gray-900">
                                    {product.sale_price
                                        ? `KSh ${product.sale_price}`
                                        : "—"}
                                </span>

                            </div>


                            {/* Current Price */}
                            <div className="border-t border-gray-100 pt-4">

                                <div className="flex items-center justify-between gap-4">

                                    <span className="text-sm text-gray-500">
                                        Current Price
                                    </span>

                                    <span className="text-lg font-bold text-gray-900">
                                        KSh{" "}
                                        {product.current_price}
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        INVENTORY
                    ================================================== */}

                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                        <h2 className="mb-4 text-lg font-semibold text-gray-900">
                            Inventory
                        </h2>

                        <div className="space-y-4">

                            <div className="flex items-center justify-between">

                                <span className="text-sm text-gray-500">
                                    Stock
                                </span>

                                <span className="font-semibold text-gray-900">
                                    {product.stock_quantity}
                                </span>

                            </div>


                            <div className="flex items-center justify-between">

                                <span className="text-sm text-gray-500">
                                    Low Stock Threshold
                                </span>

                                <span className="font-semibold text-gray-900">
                                    {product.low_stock_threshold}
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        STATUS
                    ================================================== */}

                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                        <h2 className="mb-4 text-lg font-semibold text-gray-900">
                            Status
                        </h2>

                        <div className="space-y-4">

                            {/* Status */}
                            <div className="flex items-center justify-between gap-4">

                                <span className="text-sm text-gray-500">
                                    Status
                                </span>

                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-700">
                                    {product.status
                                        ?.replace(
                                            "_",
                                            " "
                                        )}
                                </span>

                            </div>


                            {/* Featured */}
                            <div className="flex items-center justify-between">

                                <span className="text-sm text-gray-500">
                                    Featured
                                </span>

                                <span className="font-medium text-gray-900">
                                    {product.is_featured
                                        ? "Yes"
                                        : "No"}
                                </span>

                            </div>


                            {/* On Sale */}
                            <div className="flex items-center justify-between">

                                <span className="text-sm text-gray-500">
                                    On Sale
                                </span>

                                <span className="font-medium text-gray-900">
                                    {product.is_on_sale
                                        ? "Yes"
                                        : "No"}
                                </span>

                            </div>


                            {/* Low Stock */}
                            <div className="flex items-center justify-between">

                                <span className="text-sm text-gray-500">
                                    Low Stock
                                </span>

                                <span className="font-medium text-gray-900">
                                    {product.is_low_stock
                                        ? "Yes"
                                        : "No"}
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        SEO
                    ================================================== */}

                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                        <h2 className="mb-4 text-lg font-semibold text-gray-900">
                            SEO Information
                        </h2>

                        <div className="space-y-4">

                            <div>
                                <p className="text-xs uppercase tracking-wide text-gray-400">
                                    Meta Title
                                </p>

                                <p className="mt-1 text-sm text-gray-700">
                                    {product.meta_title ||
                                        "—"}
                                </p>
                            </div>


                            <div>
                                <p className="text-xs uppercase tracking-wide text-gray-400">
                                    Meta Description
                                </p>

                                <p className="mt-1 text-sm leading-6 text-gray-700">
                                    {product.meta_description ||
                                        "—"}
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default ProductDetails;