import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("admin-dark-mode") === "true"
    );

    const toggleDarkMode = () => {
        const newMode = !darkMode;

        setDarkMode(newMode);
        localStorage.setItem("admin-dark-mode", newMode);

        document.documentElement.classList.toggle(
            "dark",
            newMode
        );
    };

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <div
            className={
                darkMode
                    ? "min-h-screen bg-gray-950 text-white"
                    : "min-h-screen bg-gray-50 text-gray-900"
            }
        >
            {/* Sidebar */}
            <AdminSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
            />

            {/* Main Content */}
            <div className="lg:pl-64">
                {/* Top Header */}
                <header
                    className={`
                        sticky top-0 z-30
                        border-b
                        px-4 py-4
                        sm:px-6
                        transition-colors duration-300
                        ${
                            darkMode
                                ? "border-gray-800 bg-gray-900"
                                : "border-gray-200 bg-white"
                        }
                    `}
                >
                    <div className="flex items-center justify-between gap-4">

                        {/* Mobile menu button */}
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className={`
                                rounded-lg p-2
                                lg:hidden
                                ${
                                    darkMode
                                        ? "text-gray-300 hover:bg-gray-800"
                                        : "text-gray-600 hover:bg-gray-100"
                                }
                            `}
                            aria-label="Open sidebar"
                        >
                            ☰
                        </button>

                        {/* Welcome message */}
                        <div className="flex-1">
                            <h1
                                className={`
                                    text-lg font-semibold sm:text-xl
                                    ${
                                        darkMode
                                            ? "text-white"
                                            : "text-gray-900"
                                    }
                                `}
                            >
                                Welcome back,{" "}
                                <span>
                                    {user?.first_name ||
                                        user?.username ||
                                        "Admin"}
                                </span>
                                👋
                            </h1>

                            <p
                                className={`
                                    hidden text-sm sm:block
                                    ${
                                        darkMode
                                            ? "text-gray-400"
                                            : "text-gray-500"
                                    }
                                `}
                            >
                                You're logged in as{" "}
                                <span className="font-medium">
                                    {user?.role || "admin"}
                                </span>
                            </p>
                        </div>

                        {/* User + Logout */}
                        <div className="flex items-center gap-3">

                            {/* User information */}
                            <div className="hidden text-right sm:block">
                                <p
                                    className={`
                                        text-sm font-semibold
                                        ${
                                            darkMode
                                                ? "text-white"
                                                : "text-gray-900"
                                        }
                                    `}
                                >
                                    {user?.first_name ||
                                        user?.username}
                                </p>

                                <p
                                    className={`
                                        text-xs capitalize
                                        ${
                                            darkMode
                                                ? "text-gray-400"
                                                : "text-gray-500"
                                        }
                                    `}
                                >
                                    {user?.role}
                                </p>
                            </div>

                            {/* Profile avatar */}
                            {user?.profile_image ? (
                                <img
                                    src={user.profile_image}
                                    alt={user.username}
                                    className="h-10 w-10 rounded-full object-cover"
                                />
                            ) : (
                                <div
                                    className={`
                                        flex h-10 w-10
                                        items-center justify-center
                                        rounded-full
                                        text-sm font-bold
                                        ${
                                            darkMode
                                                ? "bg-gray-700 text-white"
                                                : "bg-gray-900 text-white"
                                        }
                                    `}
                                >
                                    {(
                                        user?.first_name ||
                                        user?.username ||
                                        "A"
                                    )
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>
                            )}

                            {/* Logout */}
                            <button
                                type="button"
                                onClick={handleLogout}
                                className={`
                                    flex items-center gap-2
                                    rounded-lg px-3 py-2
                                    text-sm font-medium
                                    transition-colors duration-200
                                    ${
                                        darkMode
                                            ? "text-red-400 hover:bg-red-950 hover:text-red-300"
                                            : "text-red-600 hover:bg-red-50"
                                    }
                                `}
                                title="Logout"
                            >
                                <span className="text-lg">
                                    🚪
                                </span>

                                <span className="hidden md:inline">
                                    Logout
                                </span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 sm:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}