import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api";

const STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
];

const PAYMENT_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "paid", label: "Paid" },
    { value: "failed", label: "Failed" },
    { value: "refunded", label: "Refunded" },
];

function formatCurrency(value) {
    return `KSh ${Number(value || 0).toLocaleString()}`;
}

function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-KE", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

function getStatusClasses(status) {
    switch (status) {
        case "pending":
            return "bg-yellow-100 text-yellow-700";
        case "confirmed":
            return "bg-blue-100 text-blue-700";
        case "processing":
            return "bg-purple-100 text-purple-700";
        case "shipped":
            return "bg-indigo-100 text-indigo-700";
        case "delivered":
            return "bg-green-100 text-green-700";
        case "cancelled":
            return "bg-red-100 text-red-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
}

export default function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [updatingPayment, setUpdatingPayment] = useState(false);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(`orders/admin/${id}/`);

            setOrder(response.data);
        } catch (err) {
            console.error("Order details error:", err);

            setError(
                err.response?.data?.detail ||
                "Unable to load order details."
            );
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus) => {
        try {
            setUpdatingStatus(true);

            const response = await api.patch(
                `orders/admin/${id}/`,
                {
                    status: newStatus,
                }
            );

            setOrder(response.data);
        } catch (err) {
            console.error("Status update error:", err);

            alert(
                err.response?.data?.detail ||
                "Unable to update order status."
            );
        } finally {
            setUpdatingStatus(false);
        }
    };

    const updatePaymentStatus = async (newStatus) => {
        try {
            setUpdatingPayment(true);

            const response = await api.patch(
                `orders/admin/${id}/`,
                {
                    payment_status: newStatus,
                }
            );

            setOrder(response.data);
        } catch (err) {
            console.error("Payment status update error:", err);

            alert(
                err.response?.data?.detail ||
                "Unable to update payment status."
            );
        } finally {
            setUpdatingPayment(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-gray-500">
                    Loading order...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                    <h2 className="text-lg font-semibold text-red-700">
                        Unable to load order
                    </h2>

                    <p className="mt-2 text-sm text-red-600">
                        {error}
                    </p>

                    <div className="mt-4 flex gap-3">
                        <button
                            onClick={fetchOrder}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                            Try Again
                        </button>

                        <button
                            onClick={() => navigate("/admin/orders")}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Back to Orders
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!order) {
        return null;
    }

    return (
        <div className="space-y-6 p-4 sm:p-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <div className="mb-2">
                        <Link
                            to="/admin/orders"
                            className="text-sm font-medium text-gray-500 hover:text-gray-900"
                        >
                            ← Back to Orders
                        </Link>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                        {order.order_number}
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Placed {formatDate(order.created_at)}
                    </p>
                </div>

                <div
                    className={`w-fit rounded-full px-4 py-2 text-sm font-semibold capitalize ${getStatusClasses(
                        order.status
                    )}`}
                >
                    {order.status_display || order.status}
                </div>
            </div>

            {/* Order Controls */}
            <div className="grid gap-6 lg:grid-cols-2">

                {/* Order Status */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">
                        Order Status
                    </h2>

                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Update status
                    </label>

                    <select
                        value={order.status}
                        disabled={updatingStatus}
                        onChange={(e) => updateStatus(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:bg-gray-100"
                    >
                        {STATUS_OPTIONS.map((status) => (
                            <option
                                key={status.value}
                                value={status.value}
                            >
                                {status.label}
                            </option>
                        ))}
                    </select>

                    {updatingStatus && (
                        <p className="mt-2 text-xs text-gray-500">
                            Updating order status...
                        </p>
                    )}
                </div>

                {/* Payment Status */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">
                        Payment Status
                    </h2>

                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Update payment
                    </label>

                    <select
                        value={order.payment_status}
                        disabled={updatingPayment}
                        onChange={(e) =>
                            updatePaymentStatus(e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:bg-gray-100"
                    >
                        {PAYMENT_STATUS_OPTIONS.map((status) => (
                            <option
                                key={status.value}
                                value={status.value}
                            >
                                {status.label}
                            </option>
                        ))}
                    </select>

                    {updatingPayment && (
                        <p className="mt-2 text-xs text-gray-500">
                            Updating payment status...
                        </p>
                    )}
                </div>
            </div>

            {/* Customer + Delivery */}
            <div className="grid gap-6 lg:grid-cols-2">

                {/* Customer */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <h2 className="mb-5 text-lg font-semibold text-gray-900">
                        Customer Information
                    </h2>

                    <div className="space-y-4">

                        <div>
                            <p className="text-xs font-medium uppercase text-gray-500">
                                Full Name
                            </p>
                            <p className="mt-1 font-medium text-gray-900">
                                {order.full_name}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase text-gray-500">
                                Email
                            </p>
                            <p className="mt-1 text-gray-700">
                                {order.email}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase text-gray-500">
                                Phone
                            </p>
                            <p className="mt-1 text-gray-700">
                                {order.phone}
                            </p>
                        </div>

                    </div>
                </div>

                {/* Delivery */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <h2 className="mb-5 text-lg font-semibold text-gray-900">
                        Delivery Information
                    </h2>

                    <div className="space-y-4">

                        <div>
                            <p className="text-xs font-medium uppercase text-gray-500">
                                County
                            </p>
                            <p className="mt-1 text-gray-700">
                                {order.county}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase text-gray-500">
                                Town
                            </p>
                            <p className="mt-1 text-gray-700">
                                {order.town}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase text-gray-500">
                                Delivery Address
                            </p>
                            <p className="mt-1 text-gray-700">
                                {order.delivery_address}
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            {/* Payment */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="mb-5 text-lg font-semibold text-gray-900">
                    Payment Information
                </h2>

                <div className="grid gap-5 sm:grid-cols-3">

                    <div>
                        <p className="text-xs font-medium uppercase text-gray-500">
                            Payment Method
                        </p>

                        <p className="mt-1 font-medium text-gray-900">
                            {order.payment_method_display ||
                                order.payment_method}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase text-gray-500">
                            Payment Status
                        </p>

                        <p className="mt-1 font-medium capitalize text-gray-900">
                            {order.payment_status_display ||
                                order.payment_status}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase text-gray-500">
                            Last Updated
                        </p>

                        <p className="mt-1 text-gray-700">
                            {formatDate(order.updated_at)}
                        </p>
                    </div>

                </div>
            </div>

            {/* Order Items */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                <div className="border-b border-gray-200 p-5">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Order Items
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        {order.items?.length || 0} item
                        {order.items?.length === 1 ? "" : "s"}
                    </p>
                </div>

                {/* Desktop */}
                <div className="hidden overflow-x-auto md:block">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                    Product
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                    SKU
                                </th>

                                <th className="px-5 py-3 text-center text-xs font-semibold uppercase text-gray-500">
                                    Qty
                                </th>

                                <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                                    Unit Price
                                </th>

                                <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                                    Total
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {order.items?.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-5 py-4 font-medium text-gray-900">
                                        {item.product_name}
                                    </td>

                                    <td className="px-5 py-4 text-sm text-gray-500">
                                        {item.sku}
                                    </td>

                                    <td className="px-5 py-4 text-center text-gray-700">
                                        {item.quantity}
                                    </td>

                                    <td className="px-5 py-4 text-right text-gray-700">
                                        {formatCurrency(item.unit_price)}
                                    </td>

                                    <td className="px-5 py-4 text-right font-semibold text-gray-900">
                                        {formatCurrency(item.total_price)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile */}
                <div className="divide-y divide-gray-100 md:hidden">
                    {order.items?.map((item) => (
                        <div
                            key={item.id}
                            className="space-y-3 p-5"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="font-medium text-gray-900">
                                        {item.product_name}
                                    </h3>

                                    <p className="mt-1 text-xs text-gray-500">
                                        SKU: {item.sku}
                                    </p>
                                </div>

                                <p className="font-semibold text-gray-900">
                                    {formatCurrency(item.total_price)}
                                </p>
                            </div>

                            <div className="flex justify-between text-sm text-gray-500">
                                <span>
                                    Qty: {item.quantity}
                                </span>

                                <span>
                                    {formatCurrency(item.unit_price)} each
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Order Summary */}
            <div className="flex justify-end">
                <div className="w-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:max-w-md">

                    <h2 className="mb-5 text-lg font-semibold text-gray-900">
                        Order Summary
                    </h2>

                    <div className="space-y-3 text-sm">

                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Subtotal
                            </span>

                            <span className="font-medium text-gray-900">
                                {formatCurrency(order.subtotal)}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Delivery Fee
                            </span>

                            <span className="font-medium text-gray-900">
                                {formatCurrency(order.delivery_fee)}
                            </span>
                        </div>

                        <div className="border-t border-gray-200 pt-3">
                            <div className="flex justify-between">
                                <span className="text-base font-semibold text-gray-900">
                                    Total
                                </span>

                                <span className="text-xl font-bold text-gray-900">
                                    {formatCurrency(order.total)}
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Notes */}
            {order.notes && (
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <h2 className="mb-3 text-lg font-semibold text-gray-900">
                        Customer Notes
                    </h2>

                    <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                        {order.notes}
                    </p>
                </div>
            )}

        </div>
    );
}