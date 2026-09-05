import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api";

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

function getCustomerName(customer) {
    return (
        customer.full_name ||
        `${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
        customer.username
    );
}

function getInitial(customer) {
    return getCustomerName(customer)
        .charAt(0)
        .toUpperCase();
}

function getOrderStatusClasses(status) {
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

function getPaymentStatusClasses(status) {
    switch (status) {
        case "paid":
            return "bg-green-100 text-green-700";

        case "pending":
            return "bg-yellow-100 text-yellow-700";

        case "failed":
            return "bg-red-100 text-red-700";

        case "refunded":
            return "bg-purple-100 text-purple-700";

        default:
            return "bg-gray-100 text-gray-700";
    }
}

export default function CustomerDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState(null);
    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);
    const [ordersLoading, setOrdersLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {
        fetchCustomer();
        fetchCustomerOrders();
    }, [id]);

    const fetchCustomer = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `customers/admin/${id}/`
            );

            setCustomer(response.data);
        } catch (err) {
            console.error("Customer details error:", err);

            setError(
                err.response?.data?.detail ||
                    "Unable to load customer details."
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomerOrders = async () => {
        try {
            setOrdersLoading(true);

            const response = await api.get(
                `orders/admin/?search=${id}`
            );

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];

            /*
             * The customer ID is not necessarily searchable
             * through the current Order API.
             *
             * We therefore filter the returned orders when
             * user information is available.
             */
            const customerOrders = data.filter(
                (order) =>
                    Number(order.user) === Number(id)
            );

            setOrders(customerOrders);
        } catch (err) {
            console.error("Customer orders error:", err);
            setOrders([]);
        } finally {
            setOrdersLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-gray-500">
                    Loading customer...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                    <h2 className="text-lg font-semibold text-red-700">
                        Unable to load customer
                    </h2>

                    <p className="mt-2 text-sm text-red-600">
                        {error}
                    </p>

                    <div className="mt-4 flex gap-3">
                        <button
                            onClick={fetchCustomer}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                            Try Again
                        </button>

                        <button
                            onClick={() =>
                                navigate("/admin/customers")
                            }
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Back to Customers
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!customer) {
        return null;
    }

    return (
        <div className="space-y-6 p-4 sm:p-6">

            {/* Header */}
            <div>
                <Link
                    to="/admin/customers"
                    className="text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                    ← Back to Customers
                </Link>

                <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center">
                    {/* Profile */}
                    {customer.profile_image ? (
                        <img
                            src={customer.profile_image}
                            alt={getCustomerName(customer)}
                            className="h-20 w-20 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-2xl font-bold text-gray-600">
                            {getInitial(customer)}
                        </div>
                    )}

                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                            {getCustomerName(customer)}
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            @{customer.username}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            Customer since{" "}
                            {formatDate(customer.created_at)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Total Orders
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900">
                        {customer.order_count || 0}
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Total Spent
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900">
                        {formatCurrency(customer.total_spent)}
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Customer ID
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900">
                        #{customer.id}
                    </p>
                </div>

            </div>

            {/* Customer Information */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

                <h2 className="mb-5 text-lg font-semibold text-gray-900">
                    Customer Information
                </h2>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                    <div>
                        <p className="text-xs font-medium uppercase text-gray-500">
                            First Name
                        </p>

                        <p className="mt-1 text-gray-900">
                            {customer.first_name || "—"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase text-gray-500">
                            Last Name
                        </p>

                        <p className="mt-1 text-gray-900">
                            {customer.last_name || "—"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase text-gray-500">
                            Username
                        </p>

                        <p className="mt-1 text-gray-900">
                            @{customer.username}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase text-gray-500">
                            Email
                        </p>

                        <p className="mt-1 break-all text-gray-900">
                            {customer.email}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase text-gray-500">
                            Phone
                        </p>

                        <p className="mt-1 text-gray-900">
                            {customer.phone || "No phone number"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase text-gray-500">
                            Joined
                        </p>

                        <p className="mt-1 text-gray-900">
                            {formatDate(customer.created_at)}
                        </p>
                    </div>

                </div>
            </div>

            {/* Order History */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                <div className="border-b border-gray-200 px-5 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Order History
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Orders placed by this customer
                    </p>
                </div>

                {ordersLoading ? (
                    <div className="px-5 py-12 text-center text-sm text-gray-500">
                        Loading order history...
                    </div>
                ) : orders.length === 0 ? (
                    <div className="px-5 py-12 text-center">

                        <div className="text-4xl">
                            📦
                        </div>

                        <h3 className="mt-4 font-semibold text-gray-900">
                            No orders yet
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            This customer hasn't placed any orders.
                        </p>

                    </div>
                ) : (
                    <>
                        {/* Desktop */}
                        <div className="hidden overflow-x-auto md:block">
                            <table className="w-full">

                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                            Order
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                            Date
                                        </th>

                                        <th className="px-5 py-3 text-center text-xs font-semibold uppercase text-gray-500">
                                            Status
                                        </th>

                                        <th className="px-5 py-3 text-center text-xs font-semibold uppercase text-gray-500">
                                            Payment
                                        </th>

                                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                                            Total
                                        </th>

                                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">

                                    {orders.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-5 py-4 font-medium text-gray-900">
                                                {order.order_number}
                                            </td>

                                            <td className="px-5 py-4 text-sm text-gray-600">
                                                {formatDate(
                                                    order.created_at
                                                )}
                                            </td>

                                            <td className="px-5 py-4 text-center">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getOrderStatusClasses(
                                                        order.status
                                                    )}`}
                                                >
                                                    {order.status_display ||
                                                        order.status}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 text-center">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPaymentStatusClasses(
                                                        order.payment_status
                                                    )}`}
                                                >
                                                    {order.payment_status_display ||
                                                        order.payment_status}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 text-right font-semibold text-gray-900">
                                                {formatCurrency(
                                                    order.total
                                                )}
                                            </td>

                                            <td className="px-5 py-4 text-right">
                                                <Link
                                                    to={`/admin/orders/${order.id}`}
                                                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>

                        {/* Mobile */}
                        <div className="divide-y divide-gray-100 md:hidden">

                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="space-y-4 p-5"
                                >
                                    <div className="flex items-center justify-between gap-4">

                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {order.order_number}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                {formatDate(
                                                    order.created_at
                                                )}
                                            </p>
                                        </div>

                                        <Link
                                            to={`/admin/orders/${order.id}`}
                                            className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700"
                                        >
                                            View
                                        </Link>

                                    </div>

                                    <div className="grid grid-cols-2 gap-4">

                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Status
                                            </p>

                                            <span
                                                className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getOrderStatusClasses(
                                                    order.status
                                                )}`}
                                            >
                                                {order.status_display ||
                                                    order.status}
                                            </span>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Payment
                                            </p>

                                            <span
                                                className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getPaymentStatusClasses(
                                                    order.payment_status
                                                )}`}
                                            >
                                                {order.payment_status_display ||
                                                    order.payment_status}
                                            </span>
                                        </div>

                                        <div className="col-span-2">
                                            <p className="text-xs text-gray-500">
                                                Total
                                            </p>

                                            <p className="mt-1 text-lg font-bold text-gray-900">
                                                {formatCurrency(
                                                    order.total
                                                )}
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            ))}

                        </div>
                    </>
                )}

            </div>

        </div>
    );
}