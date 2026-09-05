import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

function formatCurrency(value) {
    return `KSh ${Number(value || 0).toLocaleString()}`;
}

function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-KE", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function getCustomerName(customer) {
    return (
        customer.full_name ||
        `${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
        customer.username
    );
}

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("customers/admin/");

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];

            setCustomers(data);
        } catch (err) {
            console.error("Customers error:", err);

            setError(
                err.response?.data?.detail ||
                    "Unable to load customers."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const filteredCustomers = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return customers;
        }

        return customers.filter((customer) => {
            const name = getCustomerName(customer).toLowerCase();

            return (
                name.includes(query) ||
                customer.username
                    ?.toLowerCase()
                    .includes(query) ||
                customer.email
                    ?.toLowerCase()
                    .includes(query) ||
                customer.phone
                    ?.toLowerCase()
                    .includes(query)
            );
        });
    }, [customers, search]);

    const stats = useMemo(() => {
        const totalCustomers = customers.length;

        const customersWithOrders = customers.filter(
            (customer) => Number(customer.order_count || 0) > 0
        ).length;

        const totalRevenue = customers.reduce(
            (sum, customer) =>
                sum + Number(customer.total_spent || 0),
            0
        );

        const totalOrders = customers.reduce(
            (sum, customer) =>
                sum + Number(customer.order_count || 0),
            0
        );

        return {
            totalCustomers,
            customersWithOrders,
            totalRevenue,
            totalOrders,
        };
    }, [customers]);

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-gray-500">
                    Loading customers...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                    <h2 className="text-lg font-semibold text-red-700">
                        Unable to load customers
                    </h2>

                    <p className="mt-2 text-sm text-red-600">
                        {error}
                    </p>

                    <button
                        onClick={fetchCustomers}
                        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 sm:p-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                        Customers
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage and view your Anova Technologies customers.
                    </p>
                </div>

                <button
                    onClick={fetchCustomers}
                    className="w-fit rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    ↻ Refresh
                </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Total Customers
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900">
                        {stats.totalCustomers}
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Customers With Orders
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900">
                        {stats.customersWithOrders}
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Total Orders
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900">
                        {stats.totalOrders}
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Customer Revenue
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900">
                        {formatCurrency(stats.totalRevenue)}
                    </p>
                </div>

            </div>

            {/* Search */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="relative">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search by name, username, email or phone..."
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pl-10 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                    />

                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        🔍
                    </span>
                </div>
            </div>

            {/* Results */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                    <div>
                        <h2 className="font-semibold text-gray-900">
                            Customer List
                        </h2>

                        <p className="mt-1 text-xs text-gray-500">
                            Showing {filteredCustomers.length} of{" "}
                            {customers.length} customers
                        </p>
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden overflow-x-auto md:block">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                    Customer
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                    Contact
                                </th>

                                <th className="px-5 py-3 text-center text-xs font-semibold uppercase text-gray-500">
                                    Orders
                                </th>

                                <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                                    Total Spent
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                    Joined
                                </th>

                                <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {filteredCustomers.map((customer) => (
                                <tr
                                    key={customer.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">

                                            {customer.profile_image ? (
                                                <img
                                                    src={
                                                        customer.profile_image
                                                    }
                                                    alt={getCustomerName(
                                                        customer
                                                    )}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-600">
                                                    {getCustomerName(
                                                        customer
                                                    )
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                            )}

                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {getCustomerName(
                                                        customer
                                                    )}
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    @{customer.username}
                                                </p>
                                            </div>

                                        </div>
                                    </td>

                                    <td className="px-5 py-4">
                                        <p className="text-sm text-gray-900">
                                            {customer.email}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-500">
                                            {customer.phone || "No phone"}
                                        </p>
                                    </td>

                                    <td className="px-5 py-4 text-center">
                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                                            {customer.order_count || 0}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4 text-right font-semibold text-gray-900">
                                        {formatCurrency(
                                            customer.total_spent
                                        )}
                                    </td>

                                    <td className="px-5 py-4 text-sm text-gray-600">
                                        {formatDate(
                                            customer.created_at
                                        )}
                                    </td>

                                    <td className="px-5 py-4 text-right">
                                        <Link
                                            to={`/admin/customers/${customer.id}`}
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

                {/* Mobile Cards */}
                <div className="divide-y divide-gray-100 md:hidden">

                    {filteredCustomers.map((customer) => (
                        <div
                            key={customer.id}
                            className="space-y-4 p-5"
                        >
                            <div className="flex items-center justify-between gap-4">

                                <div className="flex items-center gap-3">

                                    {customer.profile_image ? (
                                        <img
                                            src={
                                                customer.profile_image
                                            }
                                            alt={getCustomerName(
                                                customer
                                            )}
                                            className="h-11 w-11 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-600">
                                            {getCustomerName(
                                                customer
                                            )
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                    )}

                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {getCustomerName(
                                                customer
                                            )}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            @{customer.username}
                                        </p>
                                    </div>

                                </div>

                                <Link
                                    to={`/admin/customers/${customer.id}`}
                                    className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700"
                                >
                                    View
                                </Link>

                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Email
                                    </p>

                                    <p className="mt-1 break-all text-gray-800">
                                        {customer.email}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Phone
                                    </p>

                                    <p className="mt-1 text-gray-800">
                                        {customer.phone ||
                                            "No phone"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Orders
                                    </p>

                                    <p className="mt-1 font-semibold text-gray-900">
                                        {customer.order_count ||
                                            0}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Total Spent
                                    </p>

                                    <p className="mt-1 font-semibold text-gray-900">
                                        {formatCurrency(
                                            customer.total_spent
                                        )}
                                    </p>
                                </div>

                                <div className="col-span-2">
                                    <p className="text-xs text-gray-500">
                                        Joined
                                    </p>

                                    <p className="mt-1 text-gray-800">
                                        {formatDate(
                                            customer.created_at
                                        )}
                                    </p>
                                </div>

                            </div>
                        </div>
                    ))}

                </div>

                {/* Empty State */}
                {filteredCustomers.length === 0 && (
                    <div className="px-5 py-16 text-center">
                        <div className="text-4xl">👥</div>

                        <h3 className="mt-4 font-semibold text-gray-900">
                            No customers found
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Try changing your search.
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
}