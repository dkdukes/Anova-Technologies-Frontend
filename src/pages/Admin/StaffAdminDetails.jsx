
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function StaffAdminDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [changingStatus, setChangingStatus] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [form, setForm] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        phone: "",
        role: "staff",
    });

    const [passwordForm, setPasswordForm] = useState({
        password: "",
        password2: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const isSelf = Number(user?.id) === Number(id);

    useEffect(() => {
        fetchAccount();
    }, [id]);

    const fetchAccount = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `customers/admin/users/${id}/`
            );

            const data = response.data;

            setAccount(data);

            setForm({
                username: data.username || "",
                email: data.email || "",
                first_name: data.first_name || "",
                last_name: data.last_name || "",
                phone: data.phone || "",
                role: data.role || "staff",
            });
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.detail ||
                "Failed to load account."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;

        setPasswordForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const response = await api.patch(
                `customers/admin/users/${id}/`,
                form
            );

            setAccount(response.data);

            setForm({
                username: response.data.username || "",
                email: response.data.email || "",
                first_name: response.data.first_name || "",
                last_name: response.data.last_name || "",
                phone: response.data.phone || "",
                role: response.data.role || "staff",
            });

            setSuccess("Account updated successfully.");

            setTimeout(() => {
                setSuccess("");
            }, 3000);
        } catch (err) {
            console.error(err);

            const data = err.response?.data;

            if (data) {
                const firstError = Object.values(data).flat()[0];

                setError(
                    firstError ||
                    data.detail ||
                    "Failed to update account."
                );
            } else {
                setError("Failed to update account.");
            }
        } finally {
            setSaving(false);
        }
    };

    const handleStatusToggle = async () => {
        if (isSelf) {
            setError("You cannot restrict your own account.");
            return;
        }

        try {
            setChangingStatus(true);
            setError("");
            setSuccess("");

            const response = await api.patch(
                `customers/admin/users/${id}/status/`,
                {
                    is_active: !account.is_active,
                }
            );

            setAccount(response.data);

            setSuccess(
                response.data.is_active
                    ? "Account activated successfully."
                    : "Account restricted successfully."
            );

            setTimeout(() => {
                setSuccess("");
            }, 3000);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.detail ||
                "Failed to update account status."
            );
        } finally {
            setChangingStatus(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!passwordForm.password || !passwordForm.password2) {
            setError("Please enter both password fields.");
            return;
        }

        if (passwordForm.password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        if (passwordForm.password !== passwordForm.password2) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setChangingPassword(true);

            await api.patch(
                `customers/admin/users/${id}/password/`,
                passwordForm
            );

            setPasswordForm({
                password: "",
                password2: "",
            });

            setSuccess("Password updated successfully.");

            setTimeout(() => {
                setSuccess("");
            }, 3000);
        } catch (err) {
            console.error(err);

            const data = err.response?.data;

            if (data) {
                const firstError = Object.values(data).flat()[0];

                setError(
                    firstError ||
                    data.detail ||
                    "Failed to update password."
                );
            } else {
                setError("Failed to update password.");
            }
        } finally {
            setChangingPassword(false);
        }
    };

    const handleDelete = async () => {
        if (isSelf) {
            setError("You cannot delete your own account.");
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete ${account.username}? This action cannot be undone.`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);
            setError("");

            await api.delete(
                `customers/admin/users/${id}/`
            );

            navigate("/admin/staff", {
                replace: true,
                state: {
                    success: "Account deleted successfully.",
                },
            });
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.detail ||
                "Failed to delete account."
            );
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-gray-500">
                    Loading account...
                </div>
            </div>
        );
    }

    if (!account) {
        return (
            <div className="p-6">
                <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
                    {error || "Account not found."}
                </div>

                <Link
                    to="/admin/staff"
                    className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
                >
                    ← Back to Staff & Admins
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">

            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <Link
                        to="/admin/staff"
                        className="mb-2 inline-block text-sm font-medium text-blue-600 hover:underline"
                    >
                        ← Back to Staff & Admins
                    </Link>

                    <h1 className="text-2xl font-bold text-gray-900">
                        Account Details
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage staff and administrator account information.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={handleStatusToggle}
                        disabled={changingStatus || isSelf}
                        className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition ${
                            account.is_active
                                ? "bg-amber-600 hover:bg-amber-700"
                                : "bg-green-600 hover:bg-green-700"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                        {changingStatus
                            ? "Updating..."
                            : account.is_active
                            ? "Restrict Account"
                            : "Activate Account"}
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleting || isSelf}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>

            {/* Messages */}
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {success && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {success}
                </div>
            )}

            {/* Account Status */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Account Status
                        </h2>

                        <p className="text-sm text-gray-500">
                            Current login access for this account.
                        </p>
                    </div>

                    <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            account.is_active
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                        }`}
                    >
                        {account.is_active
                            ? "Active"
                            : "Restricted"}
                    </span>
                </div>

                {isSelf && (
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
                        This is your own administrator account. You cannot
                        restrict or delete yourself.
                    </div>
                )}
            </div>

            {/* Account Information */}
            <form
                onSubmit={handleUpdate}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Account Information
                    </h2>

                    <p className="text-sm text-gray-500">
                        Update the user's personal and account information.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Username
                        </label>

                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            First Name
                        </label>

                        <input
                            type="text"
                            name="first_name"
                            value={form.first_name}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Last Name
                        </label>

                        <input
                            type="text"
                            name="last_name"
                            value={form.last_name}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Phone
                        </label>

                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Role
                        </label>

                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            disabled={isSelf}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                        >
                            <option value="staff">
                                Staff
                            </option>

                            <option value="admin">
                                Administrator
                            </option>
                        </select>

                        {isSelf && (
                            <p className="mt-1 text-xs text-gray-500">
                                You cannot change your own role.
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {saving
                            ? "Saving..."
                            : "Save Changes"}
                    </button>
                </div>
            </form>

            {/* Password */}
            <form
                onSubmit={handlePasswordUpdate}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Change Password
                    </h2>

                    <p className="text-sm text-gray-500">
                        Set a new password for this account.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            New Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={passwordForm.password}
                            onChange={handlePasswordChange}
                            minLength={8}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        <p className="mt-1 text-xs text-gray-500">
                            Minimum 8 characters.
                        </p>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            name="password2"
                            value={passwordForm.password2}
                            onChange={handlePasswordChange}
                            minLength={8}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={changingPassword}
                        className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {changingPassword
                            ? "Updating..."
                            : "Update Password"}
                    </button>
                </div>
            </form>

            {/* Metadata */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-semibold text-gray-900">
                    Account Metadata
                </h2>

                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">

                    <div>
                        <p className="text-gray-500">
                            Account ID
                        </p>

                        <p className="mt-1 font-medium text-gray-900">
                            #{account.id}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">
                            Created
                        </p>

                        <p className="mt-1 font-medium text-gray-900">
                            {account.created_at
                                ? new Date(
                                    account.created_at
                                ).toLocaleString()
                                : "—"}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">
                            Last Updated
                        </p>

                        <p className="mt-1 font-medium text-gray-900">
                            {account.updated_at
                                ? new Date(
                                    account.updated_at
                                ).toLocaleString()
                                : "—"}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">
                            Django Staff Status
                        </p>

                        <p className="mt-1 font-medium text-gray-900">
                            {account.is_staff
                                ? "Staff"
                                : "Regular User"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default StaffAdminDetails;
