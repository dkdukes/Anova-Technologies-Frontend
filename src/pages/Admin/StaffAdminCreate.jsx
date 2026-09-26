
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";

function StaffAdminCreate() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        phone: "",
        password: "",
        password2: "",
        role: "staff",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (form.password.length < 8) {
            setError(
                "Password must be at least 8 characters long."
            );
            return;
        }

        if (form.password !== form.password2) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            await api.post(
                "customers/admin/create/",
                {
                    username: form.username.trim(),
                    email: form.email.trim(),
                    first_name: form.first_name.trim(),
                    last_name: form.last_name.trim(),
                    phone: form.phone.trim(),
                    password: form.password,
                    role: form.role,
                }
            );

            setSuccess(
                `${form.role === "admin" ? "Administrator" : "Staff"} account created successfully.`
            );

            setForm({
                username: "",
                email: "",
                first_name: "",
                last_name: "",
                phone: "",
                password: "",
                password2: "",
                role: "staff",
            });

            setTimeout(() => {
                navigate("/admin/staff");
            }, 1200);
        } catch (err) {
            console.error(
                "CREATE ACCOUNT ERROR:",
                err
            );

            const data = err.response?.data;

            if (data) {
                if (data.username) {
                    setError(
                        `Username: ${
                            Array.isArray(data.username)
                                ? data.username.join(" ")
                                : data.username
                        }`
                    );
                } else if (data.email) {
                    setError(
                        `Email: ${
                            Array.isArray(data.email)
                                ? data.email.join(" ")
                                : data.email
                        }`
                    );
                } else if (data.password) {
                    setError(
                        `Password: ${
                            Array.isArray(data.password)
                                ? data.password.join(" ")
                                : data.password
                        }`
                    );
                } else if (data.role) {
                    setError(
                        `Role: ${
                            Array.isArray(data.role)
                                ? data.role.join(" ")
                                : data.role
                        }`
                    );
                } else if (data.detail) {
                    setError(data.detail);
                } else {
                    setError(
                        "Unable to create the account. Please check the information and try again."
                    );
                }
            } else {
                setError(
                    "Unable to connect to the server. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div>
                <Link
                    to="/admin/staff"
                    className="mb-3 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                    ← Back to Staff & Admins
                </Link>

                <h1 className="text-2xl font-bold text-gray-900">
                    Create Account
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Create a new staff or administrator account.
                </p>
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

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="max-w-4xl rounded-xl border border-gray-200 bg-white shadow-sm"
            >
                {/* Form Header */}
                <div className="border-b border-gray-200 px-6 py-5">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Account Information
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Enter the details for the new account.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">

                    {/* Username */}
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
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
                            placeholder="john_admin"
                        />
                    </div>

                    {/* Email */}
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
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
                            placeholder="john@example.com"
                        />
                    </div>

                    {/* First Name */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            First Name
                        </label>

                        <input
                            type="text"
                            name="first_name"
                            value={form.first_name}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
                            placeholder="John"
                        />
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Last Name
                        </label>

                        <input
                            type="text"
                            name="last_name"
                            value={form.last_name}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
                            placeholder="Doe"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Phone Number
                        </label>

                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
                            placeholder="+254 700 000 000"
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Account Role
                        </label>

                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
                        >
                            <option value="staff">
                                Staff
                            </option>

                            <option value="admin">
                                Administrator
                            </option>
                        </select>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            minLength={8}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
                            placeholder="Minimum 8 characters"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            name="password2"
                            value={form.password2}
                            onChange={handleChange}
                            required
                            minLength={8}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
                            placeholder="Repeat password"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
                    <Link
                        to="/admin/staff"
                        className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading
                            ? "Creating..."
                            : "Create Account"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default StaffAdminCreate;

