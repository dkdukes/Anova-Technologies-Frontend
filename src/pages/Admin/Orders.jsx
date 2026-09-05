import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [paymentFilter, setPaymentFilter] = useState("all");

    const [updatingOrder, setUpdatingOrder] = useState(null);

    // =====================================================
    // FETCH ORDERS
    // =====================================================

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("orders/admin/");

            console.log("Orders API response:", response.data);

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];

            setOrders(data);
        } catch (err) {
            console.error("Orders API error:", err);

            setError(
                "Unable to load orders. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // =====================================================
    // STATUS LABEL
    // =====================================================

    const getStatusLabel = (status) => {
        const labels = {
            pending: "Pending",
            confirmed: "Confirmed",
            processing: "Processing",
            shipped: "Shipped",
            delivered: "Delivered",
            cancelled: "Cancelled",
        };

        return labels[status] || status;
    };

    // =====================================================
    // PAYMENT LABEL
    // =====================================================

    const getPaymentLabel = (status) => {
        const labels = {
            pending: "Pending",
            paid: "Paid",
            failed: "Failed",
            refunded: "Refunded",
        };

        return labels[status] || status;
    };

    // =====================================================
    // UPDATE ORDER STATUS
    // =====================================================

    const updateOrderStatus = async (
        orderId,
        newStatus
    ) => {
        try {
            setUpdatingOrder(orderId);

            await api.patch(
                `orders/admin/${orderId}/`,
                {
                    status: newStatus,
                }
            );

            setOrders((currentOrders) =>
                currentOrders.map((order) =>
                    order.id === orderId
                        ? {
                              ...order,
                              status: newStatus,
                              status_display:
                                  getStatusLabel(
                                      newStatus
                                  ),
                          }
                        : order
                )
            );

        } catch (err) {
            console.error(
                "Status update error:",
                err
            );

            alert(
                "Unable to update order status."
            );
        } finally {
            setUpdatingOrder(null);
        }
    };

    // =====================================================
    // STATUS COLORS
    // =====================================================

    const getStatusClasses = (status) => {
        const classes = {
            pending:
                "bg-yellow-100 text-yellow-800",

            confirmed:
                "bg-blue-100 text-blue-800",

            processing:
                "bg-purple-100 text-purple-800",

            shipped:
                "bg-indigo-100 text-indigo-800",

            delivered:
                "bg-green-100 text-green-800",

            cancelled:
                "bg-red-100 text-red-800",
        };

        return (
            classes[status] ||
            "bg-gray-100 text-gray-700"
        );
    };

    // =====================================================
    // PAYMENT COLORS
    // =====================================================

    const getPaymentClasses = (status) => {
        const classes = {
            pending:
                "bg-yellow-100 text-yellow-800",

            paid:
                "bg-green-100 text-green-800",

            failed:
                "bg-red-100 text-red-800",

            refunded:
                "bg-gray-100 text-gray-700",
        };

        return (
            classes[status] ||
            "bg-gray-100 text-gray-700"
        );
    };

    // =====================================================
    // FILTER ORDERS
    // =====================================================

    const filteredOrders = orders.filter(
        (order) => {
            const searchTerm =
                search.toLowerCase().trim();

            const matchesSearch =
                !searchTerm ||
                order.order_number
                    ?.toLowerCase()
                    .includes(searchTerm) ||
                order.full_name
                    ?.toLowerCase()
                    .includes(searchTerm) ||
                order.email
                    ?.toLowerCase()
                    .includes(searchTerm) ||
                order.phone
                    ?.toLowerCase()
                    .includes(searchTerm);

            const matchesStatus =
                statusFilter === "all" ||
                order.status === statusFilter;

            const matchesPayment =
                paymentFilter === "all" ||
                order.payment_status ===
                    paymentFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesPayment
            );
        }
    );

    // =====================================================
    // STATISTICS
    // =====================================================

    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
        (order) =>
            order.status === "pending"
    ).length;

    const confirmedOrders = orders.filter(
        (order) =>
            order.status === "confirmed"
    ).length;

    const processingOrders = orders.filter(
        (order) =>
            order.status === "processing"
    ).length;

    const shippedOrders = orders.filter(
        (order) =>
            order.status === "shipped"
    ).length;

    const deliveredOrders = orders.filter(
        (order) =>
            order.status === "delivered"
    ).length;

    const cancelledOrders = orders.filter(
        (order) =>
            order.status === "cancelled"
    ).length;

    const paidOrders = orders.filter(
        (order) =>
            order.payment_status === "paid"
    ).length;

    // =====================================================
    // TOTAL REVENUE
    // =====================================================

    const totalRevenue = orders.reduce(
        (sum, order) => {
            return (
                sum +
                Number(order.total || 0)
            );
        },
        0
    );

    // =====================================================
    // FORMAT CURRENCY
    // =====================================================

    const formatCurrency = (amount) => {
        return `KSh ${Number(
            amount || 0
        ).toLocaleString("en-KE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(
            date
        ).toLocaleDateString(
            "en-KE",
            {
                year: "numeric",
                month: "short",
                day: "numeric",
            }
        );
    };

    // =====================================================
    // FORMAT TIME
    // =====================================================

    const formatDateTime = (date) => {
        if (!date) return "-";

        return new Date(
            date
        ).toLocaleString(
            "en-KE",
            {
                dateStyle: "medium",
                timeStyle: "short",
            }
        );
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="space-y-8">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                        Orders
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage customer orders,
                        payments and deliveries.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchOrders}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <span>
                        ↻
                    </span>

                    {loading
                        ? "Refreshing..."
                        : "Refresh"}
                </button>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                    <span>
                        {error}
                    </span>

                    <button
                        type="button"
                        onClick={fetchOrders}
                        className="font-semibold underline"
                    >
                        Retry
                    </button>

                </div>
            )}


            {/* =================================================
                MAIN STATISTICS
            ================================================= */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                {/* Total Orders */}

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Total Orders
                            </p>

                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                {loading
                                    ? "..."
                                    : totalOrders}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                                All orders
                            </p>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-xl">
                            🛒
                        </div>

                    </div>

                </div>


                {/* Revenue */}

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Order Revenue
                            </p>

                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                {loading
                                    ? "..."
                                    : formatCurrency(
                                          totalRevenue
                                      )}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                                From loaded orders
                            </p>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-xl">
                            💰
                        </div>

                    </div>

                </div>


                {/* Pending */}

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Pending
                            </p>

                            <p className="mt-2 text-2xl font-bold text-yellow-600">
                                {loading
                                    ? "..."
                                    : pendingOrders}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                                Awaiting processing
                            </p>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-50 text-xl">
                            ⏳
                        </div>

                    </div>

                </div>


                {/* Paid */}

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Paid Orders
                            </p>

                            <p className="mt-2 text-2xl font-bold text-green-600">
                                {loading
                                    ? "..."
                                    : paidOrders}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                                Successful payments
                            </p>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-xl">
                            ✓
                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                ORDER STATUS SUMMARY
            ================================================= */}

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                <div className="mb-5">
                    <h2 className="font-semibold text-gray-900">
                        Order Status
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Current order workflow.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">

                    <div className="rounded-lg bg-yellow-50 p-4">
                        <p className="text-xs font-medium text-yellow-700">
                            Pending
                        </p>

                        <p className="mt-2 text-xl font-bold text-yellow-800">
                            {pendingOrders}
                        </p>
                    </div>

                    <div className="rounded-lg bg-blue-50 p-4">
                        <p className="text-xs font-medium text-blue-700">
                            Confirmed
                        </p>

                        <p className="mt-2 text-xl font-bold text-blue-800">
                            {confirmedOrders}
                        </p>
                    </div>

                    <div className="rounded-lg bg-purple-50 p-4">
                        <p className="text-xs font-medium text-purple-700">
                            Processing
                        </p>

                        <p className="mt-2 text-xl font-bold text-purple-800">
                            {processingOrders}
                        </p>
                    </div>

                    <div className="rounded-lg bg-indigo-50 p-4">
                        <p className="text-xs font-medium text-indigo-700">
                            Shipped
                        </p>

                        <p className="mt-2 text-xl font-bold text-indigo-800">
                            {shippedOrders}
                        </p>
                    </div>

                    <div className="rounded-lg bg-green-50 p-4">
                        <p className="text-xs font-medium text-green-700">
                            Delivered
                        </p>

                        <p className="mt-2 text-xl font-bold text-green-800">
                            {deliveredOrders}
                        </p>
                    </div>

                    <div className="rounded-lg bg-red-50 p-4">
                        <p className="text-xs font-medium text-red-700">
                            Cancelled
                        </p>

                        <p className="mt-2 text-xl font-bold text-red-800">
                            {cancelledOrders}
                        </p>
                    </div>

                </div>

            </div>


            {/* =================================================
                FILTERS
            ================================================= */}

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

                <div className="mb-5">

                    <h2 className="font-semibold text-gray-900">
                        Find Orders
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Search and filter your orders.
                    </p>

                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                    {/* Search */}

                    <div>

                        <label
                            htmlFor="order-search"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Search Orders
                        </label>

                        <div className="relative">

                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                🔎
                            </span>

                            <input
                                id="order-search"
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                placeholder="Order number, customer, phone..."
                                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                            />

                        </div>

                    </div>


                    {/* Order status */}

                    <div>

                        <label
                            htmlFor="status-filter"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Order Status
                        </label>

                        <select
                            id="status-filter"
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                        >

                            <option value="all">
                                All statuses
                            </option>

                            <option value="pending">
                                Pending
                            </option>

                            <option value="confirmed">
                                Confirmed
                            </option>

                            <option value="processing">
                                Processing
                            </option>

                            <option value="shipped">
                                Shipped
                            </option>

                            <option value="delivered">
                                Delivered
                            </option>

                            <option value="cancelled">
                                Cancelled
                            </option>

                        </select>

                    </div>


                    {/* Payment status */}

                    <div>

                        <label
                            htmlFor="payment-filter"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Payment Status
                        </label>

                        <select
                            id="payment-filter"
                            value={paymentFilter}
                            onChange={(e) =>
                                setPaymentFilter(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                        >

                            <option value="all">
                                All payments
                            </option>

                            <option value="pending">
                                Pending
                            </option>

                            <option value="paid">
                                Paid
                            </option>

                            <option value="failed">
                                Failed
                            </option>

                            <option value="refunded">
                                Refunded
                            </option>

                        </select>

                    </div>

                </div>


                {/* Clear filters */}

                {(search ||
                    statusFilter !== "all" ||
                    paymentFilter !== "all") && (
                    <div className="mt-4">

                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setStatusFilter("all");
                                setPaymentFilter("all");
                            }}
                            className="text-sm font-medium text-gray-600 hover:text-gray-900 hover:underline"
                        >
                            Clear filters
                        </button>

                    </div>
                )}

            </div>


            {/* =================================================
                ORDERS TABLE
            ================================================= */}

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                <div className="flex flex-col gap-2 border-b border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <h2 className="font-semibold text-gray-900">
                            All Orders
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Showing{" "}
                            <span className="font-semibold text-gray-900">
                                {filteredOrders.length}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-gray-900">
                                {orders.length}
                            </span>{" "}
                            orders
                        </p>

                    </div>

                </div>


                {/* Loading */}

                {loading && (
                    <div className="p-16 text-center">

                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />

                        <p className="mt-4 text-sm text-gray-500">
                            Loading orders...
                        </p>

                    </div>
                )}


                {/* Empty */}

                {!loading &&
                    filteredOrders.length === 0 && (
                        <div className="p-16 text-center">

                            <div className="text-5xl">
                                🛒
                            </div>

                            <h3 className="mt-4 font-semibold text-gray-900">
                                No orders found
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Try changing your search
                                or filters.
                            </p>

                        </div>
                    )}


                {/* Desktop table */}

                {!loading &&
                    filteredOrders.length > 0 && (
                        <div className="hidden overflow-x-auto lg:block">

                            <table className="w-full">

                                <thead className="border-b bg-gray-50">

                                    <tr>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Order
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Customer
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Date
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Total
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Payment
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Status
                                        </th>

                                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y divide-gray-100">

                                    {filteredOrders.map(
                                        (order) => (
                                            <tr
                                                key={
                                                    order.id
                                                }
                                                className="transition hover:bg-gray-50"
                                            >

                                                {/* Order */}

                                                <td className="px-6 py-4">

                                                    <Link
                                                        to={`/admin/orders/${order.id}`}
                                                        className="font-semibold text-gray-900 hover:underline"
                                                    >
                                                        {
                                                            order.order_number
                                                        }
                                                    </Link>

                                                    <p className="mt-1 text-xs text-gray-400">
                                                        {order.items
                                                            ?.length ||
                                                            0}{" "}
                                                        item(s)
                                                    </p>

                                                </td>


                                                {/* Customer */}

                                                <td className="px-6 py-4">

                                                    <p className="text-sm font-medium text-gray-900">
                                                        {
                                                            order.full_name
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-xs text-gray-500">
                                                        {
                                                            order.phone
                                                        }
                                                    </p>

                                                    <p className="mt-1 max-w-[200px] truncate text-xs text-gray-400">
                                                        {
                                                            order.email
                                                        }
                                                    </p>

                                                </td>


                                                {/* Date */}

                                                <td className="px-6 py-4">

                                                    <p className="text-sm text-gray-700">
                                                        {formatDate(
                                                            order.created_at
                                                        )}
                                                    </p>

                                                    <p className="mt-1 text-xs text-gray-400">
                                                        {new Date(
                                                            order.created_at
                                                        ).toLocaleTimeString(
                                                            "en-KE",
                                                            {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            }
                                                        )}
                                                    </p>

                                                </td>


                                                {/* Total */}

                                                <td className="px-6 py-4">

                                                    <p className="font-semibold text-gray-900">
                                                        {formatCurrency(
                                                            order.total
                                                        )}
                                                    </p>

                                                    <p className="mt-1 text-xs text-gray-400">
                                                        Subtotal:{" "}
                                                        {formatCurrency(
                                                            order.subtotal
                                                        )}
                                                    </p>

                                                </td>


                                                {/* Payment */}

                                                <td className="px-6 py-4">

                                                    <span
                                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getPaymentClasses(
                                                            order.payment_status
                                                        )}`}
                                                    >
                                                        {order.payment_status_display ||
                                                            getPaymentLabel(
                                                                order.payment_status
                                                            )}
                                                    </span>

                                                    <p className="mt-1 text-xs text-gray-400">
                                                        {order.payment_method_display ||
                                                            order.payment_method}
                                                    </p>

                                                </td>


                                                {/* Status */}

                                                <td className="px-6 py-4">

                                                    <select
                                                        value={
                                                            order.status
                                                        }
                                                        disabled={
                                                            updatingOrder ===
                                                            order.id
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            updateOrderStatus(
                                                                order.id,
                                                                e.target.value
                                                            )
                                                        }
                                                        className={`rounded-full border-0 px-3 py-1.5 text-xs font-medium outline-none ${getStatusClasses(
                                                            order.status
                                                        )}`}
                                                    >

                                                        <option value="pending">
                                                            Pending
                                                        </option>

                                                        <option value="confirmed">
                                                            Confirmed
                                                        </option>

                                                        <option value="processing">
                                                            Processing
                                                        </option>

                                                        <option value="shipped">
                                                            Shipped
                                                        </option>

                                                        <option value="delivered">
                                                            Delivered
                                                        </option>

                                                        <option value="cancelled">
                                                            Cancelled
                                                        </option>

                                                    </select>

                                                    {updatingOrder ===
                                                        order.id && (
                                                        <p className="mt-1 text-xs text-gray-400">
                                                            Updating...
                                                        </p>
                                                    )}

                                                </td>


                                                {/* Action */}

                                                <td className="px-6 py-4 text-right">

                                                    <Link
                                                        to={`/admin/orders/${order.id}`}
                                                        className="text-sm font-semibold text-gray-700 hover:text-gray-900 hover:underline"
                                                    >
                                                        View
                                                    </Link>

                                                </td>

                                            </tr>
                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>
                    )}


                {/* =================================================
                    MOBILE ORDERS
                ================================================= */}

                {!loading &&
                    filteredOrders.length > 0 && (
                        <div className="divide-y divide-gray-100 lg:hidden">

                            {filteredOrders.map(
                                (order) => (
                                    <div
                                        key={order.id}
                                        className="p-5"
                                    >

                                        {/* Top */}

                                        <div className="flex items-start justify-between gap-4">

                                            <div>

                                                <Link
                                                    to={`/admin/orders/${order.id}`}
                                                    className="font-semibold text-gray-900 hover:underline"
                                                >
                                                    {
                                                        order.order_number
                                                    }
                                                </Link>

                                                <p className="mt-1 text-xs text-gray-500">
                                                    {
                                                        order.full_name
                                                    }
                                                </p>

                                            </div>

                                            <p className="whitespace-nowrap text-sm font-bold text-gray-900">
                                                {formatCurrency(
                                                    order.total
                                                )}
                                            </p>

                                        </div>


                                        {/* Customer */}

                                        <div className="mt-4 rounded-lg bg-gray-50 p-3">

                                            <p className="text-xs text-gray-400">
                                                Customer
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-gray-800">
                                                {
                                                    order.full_name
                                                }
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                {
                                                    order.phone
                                                }
                                            </p>

                                        </div>


                                        {/* Order information */}

                                        <div className="mt-4 grid grid-cols-2 gap-4">

                                            <div>

                                                <p className="text-xs text-gray-400">
                                                    Payment
                                                </p>

                                                <span
                                                    className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getPaymentClasses(
                                                        order.payment_status
                                                    )}`}
                                                >
                                                    {order.payment_status_display ||
                                                        getPaymentLabel(
                                                            order.payment_status
                                                        )}
                                                </span>

                                            </div>


                                            <div>

                                                <p className="text-xs text-gray-400">
                                                    Status
                                                </p>

                                                <select
                                                    value={
                                                        order.status
                                                    }
                                                    disabled={
                                                        updatingOrder ===
                                                        order.id
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        updateOrderStatus(
                                                            order.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`mt-1 max-w-full rounded-full border-0 px-2.5 py-1.5 text-xs font-medium outline-none ${getStatusClasses(
                                                        order.status
                                                    )}`}
                                                >

                                                    <option value="pending">
                                                        Pending
                                                    </option>

                                                    <option value="confirmed">
                                                        Confirmed
                                                    </option>

                                                    <option value="processing">
                                                        Processing
                                                    </option>

                                                    <option value="shipped">
                                                        Shipped
                                                    </option>

                                                    <option value="delivered">
                                                        Delivered
                                                    </option>

                                                    <option value="cancelled">
                                                        Cancelled
                                                    </option>

                                                </select>

                                            </div>

                                        </div>


                                        {/* Date / items */}

                                        <div className="mt-4 flex items-center justify-between border-t pt-4">

                                            <div>

                                                <p className="text-xs text-gray-400">
                                                    {formatDateTime(
                                                        order.created_at
                                                    )}
                                                </p>

                                                <p className="mt-1 text-xs text-gray-400">
                                                    {order.items
                                                        ?.length ||
                                                        0}{" "}
                                                    item(s)
                                                </p>

                                            </div>

                                            <Link
                                                to={`/admin/orders/${order.id}`}
                                                className="text-sm font-semibold text-gray-900 hover:underline"
                                            >
                                                View Order →
                                            </Link>

                                        </div>

                                    </div>
                                )
                            )}

                        </div>
                    )}

            </div>

        </div>
    );
}

export default Orders;