import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api";

export default function BrandDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [brand, setBrand] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    const fetchBrand = async () => {
        try {
            setLoading(true);

            const response = await api.get(`brands/${id}/`);

            setBrand(response.data);
        } catch (error) {
            console.error("Failed to fetch brand:", error);
            alert(
                error.response?.data?.detail ||
                    "Failed to load brand."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrand();
    }, [id]);

    const handleDelete = async () => {
        if (!brand) return;

        if (Number(brand.product_count || 0) > 0) {
            alert(
                `You cannot delete "${brand.name}" because it has ${brand.product_count} product(s) assigned to it.`
            );
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete "${brand.name}"?`
        );

        if (!confirmed) return;

        try {
            setDeleting(true);

            await api.delete(`brands/${id}/`);

            navigate("/admin/brands");
        } catch (error) {
            console.error("Failed to delete brand:", error);

            alert(
                error.response?.data?.detail ||
                    "Failed to delete brand."
            );
        } finally {
            setDeleting(false);
        }
    };

    const toggleStatus = async () => {
        if (!brand) return;

        try {
            const response = await api.patch(
                `brands/${id}/`,
                {
                    is_active: !brand.is_active,
                }
            );

            setBrand(response.data);
        } catch (error) {
            console.error(
                "Failed to update brand:",
                error
            );

            alert("Failed to update brand status.");
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-sm text-gray-500">
                    Loading brand...
                </p>
            </div>
        );
    }

    if (!brand) {
        return (
            <div className="min-h-screen bg-gray-50 px-6 py-10">
                <div className="mx-auto max-w-5xl">
                    <Link
                        to="/admin/brands"
                        className="text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                        ← Back to Brands
                    </Link>

                    <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-10 text-center">
                        <h1 className="text-xl font-bold text-gray-900">
                            Brand not found
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            The requested brand could not be found.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
            {/* HEADER */}
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                            <Link
                                to="/admin/dashboard"
                                className="hover:text-gray-900"
                            >
                                Dashboard
                            </Link>

                            <span>/</span>

                            <Link
                                to="/admin/brands"
                                className="hover:text-gray-900"
                            >
                                Brands
                            </Link>

                            <span>/</span>

                            <span className="text-gray-900">
                                {brand.name}
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900">
                            {brand.name}
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Manage brand information and products.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Link
                            to="/admin/brands"
                            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            ← Back
                        </Link>

                        <Link
                            to="/admin/brands"
                            className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
                        >
                            Edit Brand
                        </Link>

                        <button
                            onClick={handleDelete}
                            disabled={
                                deleting ||
                                Number(brand.product_count || 0) > 0
                            }
                            className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {deleting
                                ? "Deleting..."
                                : "Delete"}
                        </button>
                    </div>
                </div>

                {/* BRAND OVERVIEW */}
                <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* BRAND CARD */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-col items-center text-center">
                            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                                {brand.logo ? (
                                    <img
                                        src={brand.logo}
                                        alt={brand.name}
                                        className="h-full w-full object-contain p-4"
                                    />
                                ) : (
                                    <span className="text-5xl">
                                        🏷️
                                    </span>
                                )}
                            </div>

                            <h2 className="mt-5 text-xl font-bold text-gray-900">
                                {brand.name}
                            </h2>

                            <p className="mt-1 text-sm text-gray-400">
                                /{brand.slug}
                            </p>

                            <div className="mt-4">
                                <StatusBadge
                                    active={brand.is_active}
                                />
                            </div>
                        </div>

                        <div className="mt-6 border-t border-gray-100 pt-5">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">
                                    Brand status
                                </span>

                                <button
                                    onClick={toggleStatus}
                                    className="text-sm font-semibold text-gray-900 hover:underline"
                                >
                                    {brand.is_active
                                        ? "Deactivate"
                                        : "Activate"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* STAT CARDS */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2">
                        <InfoCard
                            title="Products"
                            value={brand.product_count || 0}
                            icon="📦"
                        />

                        <InfoCard
                            title="Status"
                            value={
                                brand.is_active
                                    ? "Active"
                                    : "Inactive"
                            }
                            icon={
                                brand.is_active
                                    ? "✓"
                                    : "○"
                            }
                        />
                    </div>
                </div>

                {/* PRODUCTS */}
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-2 border-b border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                Products
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Products currently assigned to{" "}
                                {brand.name}.
                            </p>
                        </div>

                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                            {brand.product_count || 0} products
                        </span>
                    </div>

                    {brand.products?.length === 0 ? (
                        <div className="px-6 py-16 text-center">
                            <div className="text-5xl">
                                📦
                            </div>

                            <h3 className="mt-4 text-lg font-semibold text-gray-900">
                                No products assigned
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                There are currently no products
                                using this brand.
                            </p>

                            <Link
                                to="/admin/products/create"
                                className="mt-5 inline-flex rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
                            >
                                Add Product
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* DESKTOP */}
                            <div className="hidden overflow-x-auto md:block">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            <th className="px-6 py-4">
                                                Product
                                            </th>

                                            <th className="px-6 py-4">
                                                SKU
                                            </th>

                                            <th className="px-6 py-4">
                                                Price
                                            </th>

                                            <th className="px-6 py-4">
                                                Stock
                                            </th>

                                            <th className="px-6 py-4">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100">
                                        {brand.products.map(
                                            (product) => (
                                                <tr
                                                    key={
                                                        product.id
                                                    }
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4">
                                                        <Link
                                                            to={`/admin/products/${product.id}`}
                                                            className="font-semibold text-gray-900 hover:underline"
                                                        >
                                                            {
                                                                product.name
                                                            }
                                                        </Link>

                                                        {product.is_featured && (
                                                            <span className="ml-2 rounded-full bg-yellow-50 px-2 py-1 text-[10px] font-semibold text-yellow-700">
                                                                Featured
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {
                                                            product.sku
                                                        }
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-semibold text-gray-900">
                                                            KSh{" "}
                                                            {formatPrice(
                                                                product.current_price
                                                            )}
                                                        </div>

                                                        {product.is_on_sale &&
                                                            product.sale_price && (
                                                                <div className="text-xs text-gray-400 line-through">
                                                                    KSh{" "}
                                                                    {formatPrice(
                                                                        product.price
                                                                    )}
                                                                </div>
                                                            )}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <StockBadge
                                                            product={
                                                                product
                                                            }
                                                        />
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <ProductStatus
                                                            status={
                                                                product.status
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* MOBILE */}
                            <div className="divide-y divide-gray-100 md:hidden">
                                {brand.products.map(
                                    (product) => (
                                        <div
                                            key={
                                                product.id
                                            }
                                            className="p-5"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0">
                                                    <Link
                                                        to={`/admin/products/${product.id}`}
                                                        className="font-semibold text-gray-900 hover:underline"
                                                    >
                                                        {
                                                            product.name
                                                        }
                                                    </Link>

                                                    <p className="mt-1 text-xs text-gray-400">
                                                        SKU:{" "}
                                                        {
                                                            product.sku
                                                        }
                                                    </p>
                                                </div>

                                                <ProductStatus
                                                    status={
                                                        product.status
                                                    }
                                                />
                                            </div>

                                            <div className="mt-4 grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs text-gray-400">
                                                        Price
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-gray-900">
                                                        KSh{" "}
                                                        {formatPrice(
                                                            product.current_price
                                                        )}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-gray-400">
                                                        Stock
                                                    </p>

                                                    <div className="mt-1">
                                                        <StockBadge
                                                            product={
                                                                product
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {product.is_featured && (
                                                <div className="mt-3">
                                                    <span className="rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-semibold text-yellow-700">
                                                        Featured
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// --------------------------------------------------
// INFO CARD
// --------------------------------------------------

function InfoCard({ title, value, icon }) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">
                        {title}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900">
                        {value}
                    </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-xl">
                    {icon}
                </div>
            </div>
        </div>
    );
}

// --------------------------------------------------
// STATUS BADGE
// --------------------------------------------------

function StatusBadge({ active }) {
    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                active
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-500"
            }`}
        >
            {active ? "Active" : "Inactive"}
        </span>
    );
}

// --------------------------------------------------
// PRODUCT STATUS
// --------------------------------------------------

function ProductStatus({ status }) {
    const labels = {
        active: "Active",
        draft: "Draft",
        out_of_stock: "Out of Stock",
        archived: "Archived",
    };

    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                status === "active"
                    ? "bg-green-50 text-green-700"
                    : status === "out_of_stock"
                    ? "bg-red-50 text-red-700"
                    : status === "draft"
                    ? "bg-yellow-50 text-yellow-700"
                    : "bg-gray-100 text-gray-500"
            }`}
        >
            {labels[status] || status}
        </span>
    );
}

// --------------------------------------------------
// STOCK
// --------------------------------------------------

function StockBadge({ product }) {
    const stock = Number(product.stock_quantity || 0);
    const threshold = Number(
        product.low_stock_threshold || 0
    );

    if (stock === 0) {
        return (
            <span className="text-xs font-semibold text-red-600">
                Out of stock
            </span>
        );
    }

    if (stock <= threshold) {
        return (
            <span className="text-xs font-semibold text-orange-600">
                {stock} — Low stock
            </span>
        );
    }

    return (
        <span className="text-xs font-semibold text-green-600">
            {stock} in stock
        </span>
    );
}

// --------------------------------------------------
// PRICE
// --------------------------------------------------

function formatPrice(value) {
    const number = Number(value || 0);

    return number.toLocaleString("en-KE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}