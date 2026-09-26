import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [loginType, setLoginType] = useState("customer");

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleLoginTypeChange = (type) => {
        setLoginType(type);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await login(
                formData.username,
                formData.password
            );

            const user = response.user;

            /*
             * ADMIN / STAFF LOGIN
             */
            if (loginType === "admin") {
                if (
                    user.role !== "admin" &&
                    user.role !== "staff"
                ) {
                    setError(
                        "This account does not have admin or staff access."
                    );

                    return;
                }

                navigate("/admin/dashboard", {
                    replace: true,
                });

                return;
            }

            /*
             * CUSTOMER LOGIN
             */
            if (user.role !== "customer") {
                setError(
                    "Please use the Admin / Staff login option for this account."
                );

                return;
            }

            navigate("/", {
                replace: true,
            });

        } catch (err) {
            console.error("Login error:", err);

            if (err.response?.data) {
                const data = err.response.data;

                if (data.detail) {
                    setError(data.detail);
                } else if (data.non_field_errors) {
                    setError(
                        Array.isArray(data.non_field_errors)
                            ? data.non_field_errors.join(" ")
                            : data.non_field_errors
                    );
                } else {
                    setError(
                        "Invalid username or password."
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
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">

            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

                {/* Header */}
                <div className="mb-8 text-center">

                    <h1 className="text-3xl font-bold text-gray-900">
                        {loginType === "admin"
                            ? "Admin & Staff Login"
                            : "Welcome Back"}
                    </h1>

                    <p className="mt-2 text-gray-600">
                        {loginType === "admin"
                            ? "Sign in to manage Anova Technologies"
                            : "Sign in to your Anova Technologies account"}
                    </p>

                </div>

                {/* Login Type */}
                <div className="mb-6 rounded-lg bg-gray-100 p-1">

                    <div className="grid grid-cols-2 gap-1">

                        <button
                            type="button"
                            onClick={() =>
                                handleLoginTypeChange("customer")
                            }
                            className={`rounded-md px-4 py-2.5 text-sm font-semibold transition ${
                                loginType === "customer"
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-500 hover:text-gray-900"
                            }`}
                        >
                            Customer
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                handleLoginTypeChange("admin")
                            }
                            className={`rounded-md px-4 py-2.5 text-sm font-semibold transition ${
                                loginType === "admin"
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-500 hover:text-gray-900"
                            }`}
                        >
                            Admin / Staff
                        </button>

                    </div>

                </div>

                {/* Error */}
                {error && (
                    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Login Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* Username */}
                    <div>

                        <label
                            htmlFor="username"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Username
                        </label>

                        <input
                            id="username"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            autoComplete="username"
                            placeholder="Enter your username"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />

                    </div>

                    {/* Password */}
                    <div>

                        <label
                            htmlFor="password"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />

                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading
                            ? "Signing In..."
                            : loginType === "admin"
                                ? "Sign In to Admin"
                                : "Sign In"}
                    </button>

                </form>

                {/* Customer Signup */}
                {loginType === "customer" && (
                    <div className="mt-6 text-center text-sm text-gray-600">

                        Don't have an account?{" "}

                        <Link
                            to="/signup"
                            className="font-semibold text-gray-900 hover:underline"
                        >
                            Create an account
                        </Link>

                    </div>
                )}

                {/* Admin Information */}
                {loginType === "admin" && (
                    <div className="mt-6 rounded-lg bg-blue-50 p-4 text-center">

                        <p className="text-sm text-blue-700">
                            Admin and staff accounts are created
                            by an authorized administrator.
                        </p>

                    </div>
                )}

            </div>

        </div>
    );
}