import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

export default function StaffAdmin() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const [deleteUser, setDeleteUser] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                "customers/admin/users/"
            );

            setUsers(response.data.results || response.data);
        } catch (err) {
            console.error("STAFF USERS ERROR:", err);

            setError(
                err.response?.data?.detail ||
                "Failed to load staff and admin accounts."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleStatus = async (user) => {
        try {
            setActionLoading(true);

            await api.patch(
                `customers/admin/users/${user.id}/status/`,
                {
                    is_active: !user.is_active,
                }
            );

            setUsers((previous) =>
                previous.map((item) =>
                    item.id === user.id
                        ? {
                            ...item,
                            is_active: !item.is_active,
                        }
                        : item
                )
            );
        } catch (err) {
            console.error("STATUS ERROR:", err);

            setError(
                err.response?.data?.detail ||
                "Failed to update account status."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteUser) {
            return;
        }

        try {
            setActionLoading(true);

            await api.delete(
                `customers/admin/users/${deleteUser.id}/`
            );

            setUsers((previous) =>
                previous.filter(
                    (item) => item.id !== deleteUser.id
                )
            );

            setDeleteUser(null);
        } catch (err) {
            console.error("DELETE USER ERROR:", err);

            setError(
                err.response?.data?.detail ||
                "Failed to delete account."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const filteredUsers = users.filter((user) => {
        const searchValue = search.toLowerCase();

        return (
            user.username
                ?.toLowerCase()
                .includes(searchValue) ||
            user.email
                ?.toLowerCase()
                .includes(searchValue) ||
            user.first_name
                ?.toLowerCase()
                .includes(searchValue) ||
            user.last_name
                ?.toLowerCase()
                .includes(searchValue)
        );
    });

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-gray-500">
                    Loading staff and admin accounts...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Header */}

            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Staff & Admins
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage staff and administrator accounts.
                    </p>
                </div>

                <Link
                    to="/admin/staff/create"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                    + Create Account
                </Link>
            </div>


            {/* Error */}

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}


            {/* Search */}

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    placeholder="Search by name, username or email..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
            </div>


            {/* Table */}

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                <div className="overflow-x-auto">

                    <table className="min-w-full divide-y divide-gray-200">

                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    User
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Email
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Role
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>


                        <tbody className="divide-y divide-gray-200">

                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-6 py-12 text-center text-sm text-gray-500"
                                    >
                                        No staff or admin accounts found.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-gray-50"
                                    >

                                        {/* User */}

                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center gap-3">

                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
                                                    {(
                                                        user.first_name ||
                                                        user.username ||
                                                        "U"
                                                    )
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {user.full_name ||
                                                            `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
                                                            user.username}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        @{user.username}
                                                    </p>
                                                </div>

                                            </div>
                                        </td>


                                        {/* Email */}

                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                            {user.email}
                                        </td>


                                        {/* Role */}

                                        <td className="whitespace-nowrap px-6 py-4">

                                            {user.role === "admin" ? (
                                                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                                                    Admin
                                                </span>
                                            ) : (
                                                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                                    Staff
                                                </span>
                                            )}

                                        </td>


                                        {/* Status */}

                                        <td className="whitespace-nowrap px-6 py-4">

                                            {user.is_active ? (
                                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                                    Restricted
                                                </span>
                                            )}

                                        </td>


                                        {/* Actions */}

                                        <td className="whitespace-nowrap px-6 py-4 text-right">

                                            <div className="flex justify-end gap-2">

                                                <Link
                                                    to={`/admin/staff/${user.id}`}
                                                    className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
                                                >
                                                    View
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleToggleStatus(
                                                            user
                                                        )
                                                    }
                                                    disabled={actionLoading}
                                                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                                                        user.is_active
                                                            ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                                            : "bg-green-100 text-green-700 hover:bg-green-200"
                                                    }`}
                                                >
                                                    {user.is_active
                                                        ? "Restrict"
                                                        : "Activate"}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setDeleteUser(
                                                            user
                                                        )
                                                    }
                                                    disabled={actionLoading}
                                                    className="rounded-lg bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-200"
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </td>

                                    </tr>
                                ))
                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* Delete Confirmation */}

            {deleteUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

                        <h2 className="text-xl font-bold text-gray-900">
                            Delete Account?
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-gray-600">
                            Are you sure you want to permanently delete
                            <span className="font-semibold text-gray-900">
                                {" "}
                                {deleteUser.full_name ||
                                    deleteUser.username}
                            </span>
                            ? This action cannot be undone.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    setDeleteUser(null)
                                }
                                disabled={actionLoading}
                                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={actionLoading}
                                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                            >
                                {actionLoading
                                    ? "Deleting..."
                                    : "Delete Account"}
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}