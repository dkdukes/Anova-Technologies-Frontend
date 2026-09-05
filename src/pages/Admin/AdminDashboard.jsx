import { useEffect, useState } from "react";
import api from "../../api";

function AdminDashboard() {
    const [stats, setStats] = useState({
        total_products: 0,
        active_products: 0,
        draft_products: 0,
        low_stock_products: 0,
        total_stock: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                setLoading(true);

                const response = await api.get(
                    "admin/dashboard/stats/"
                );

                setStats(response.data);
                setError("");
            } catch (err) {
                console.error("Dashboard stats error:", err);

                setError(
                    "Unable to load dashboard statistics."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    const statCards = [
        {
            title: "Total Products",
            value: stats.total_products,
            description: "All products",
            icon: "📦",
        },
        {
            title: "Active Products",
            value: stats.active_products,
            description: "Currently published",
            icon: "🟢",
        },
        {
            title: "Draft Products",
            value: stats.draft_products,
            description: "Not published",
            icon: "📝",
        },
        {
            title: "Low Stock",
            value: stats.low_stock_products,
            description: "Need attention",
            icon: "⚠️",
        },
    ];

    return (
        <div className="space-y-8">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    Dashboard
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Welcome to your Anova Technologies admin center.
                </p>
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

                {statCards.map((stat) => (
                    <div
                        key={stat.title}
                        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                    >
                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    {stat.title}
                                </p>

                                {loading ? (
                                    <div className="mt-3 h-8 w-20 animate-pulse rounded bg-gray-200" />
                                ) : (
                                    <p className="mt-2 text-3xl font-bold text-gray-900">
                                        {stat.value}
                                    </p>
                                )}

                                <p className="mt-2 text-xs text-gray-400">
                                    {stat.description}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-xl">
                                {stat.icon}
                            </div>

                        </div>
                    </div>
                ))}

            </div>

            {/* Inventory Overview */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                {/* Stock */}
                <div className="rounded-xl border border-gray-200 bg-white p-6">

                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-semibold text-gray-900">
                                Inventory Overview
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Current inventory status
                            </p>
                        </div>

                        <span className="text-2xl">
                            📊
                        </span>
                    </div>

                    <div className="mt-6">

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                                Total Stock
                            </span>

                            <span className="font-semibold text-gray-900">
                                {loading ? "..." : stats.total_stock}
                            </span>
                        </div>

                        <div className="mt-3 h-3 overflow-hidden rounded-full bg-gray-100">
                            <div
                                className="h-full rounded-full bg-gray-900 transition-all"
                                style={{
                                    width:
                                        stats.total_stock > 0
                                            ? "100%"
                                            : "0%",
                                }}
                            />
                        </div>

                    </div>

                </div>

                {/* Product Status */}
                <div className="rounded-xl border border-gray-200 bg-white p-6">

                    <h2 className="font-semibold text-gray-900">
                        Product Status
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Breakdown of your products
                    </p>

                    <div className="mt-6 space-y-4">

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                Active
                            </span>

                            <span className="font-semibold text-gray-900">
                                {stats.active_products}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                Draft
                            </span>

                            <span className="font-semibold text-gray-900">
                                {stats.draft_products}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                                Low Stock
                            </span>

                            <span className="font-semibold text-gray-900">
                                {stats.low_stock_products}
                            </span>
                        </div>

                    </div>

                </div>

            </div>

            {/* Quick Actions */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">

                <h2 className="font-semibold text-gray-900">
                    Quick Actions
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Manage your store quickly
                </p>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                    <a
                        href="/admin/products/create"
                        className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50"
                    >
                        <span className="text-2xl">
                            ➕
                        </span>

                        <div>
                            <p className="text-sm font-semibold text-gray-900">
                                Add Product
                            </p>

                            <p className="text-xs text-gray-500">
                                Create a new product
                            </p>
                        </div>
                    </a>

                    <a
                        href="/admin/products"
                        className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50"
                    >
                        <span className="text-2xl">
                            📦
                        </span>

                        <div>
                            <p className="text-sm font-semibold text-gray-900">
                                Manage Products
                            </p>

                            <p className="text-xs text-gray-500">
                                View your inventory
                            </p>
                        </div>
                    </a>

                    <a
                        href="/admin/orders"
                        className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50"
                    >
                        <span className="text-2xl">
                            🛒
                        </span>

                        <div>
                            <p className="text-sm font-semibold text-gray-900">
                                Manage Orders
                            </p>

                            <p className="text-xs text-gray-500">
                                Process customer orders
                            </p>
                        </div>
                    </a>

                </div>

            </div>

        </div>
    );
}

export default AdminDashboard;