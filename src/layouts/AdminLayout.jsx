import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("admin-dark-mode") === "true";
    });

    useEffect(() => {
        localStorage.setItem(
            "admin-dark-mode",
            darkMode
        );

        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode((prev) => !prev);
    };

    return (
        <div
            className={`min-h-screen transition-colors duration-300 ${
                darkMode
                    ? "bg-gray-950 text-white"
                    : "bg-gray-50 text-gray-900"
            }`}
        >
            <AdminSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
            />

            {/* Main content */}
            <div className="lg:ml-64">
                {/* Mobile header */}
                <header
                    className={`flex h-16 items-center border-b px-4 lg:hidden ${
                        darkMode
                            ? "border-gray-800 bg-gray-900"
                            : "border-gray-200 bg-white"
                    }`}
                >
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        className={`text-2xl ${
                            darkMode
                                ? "text-white"
                                : "text-gray-900"
                        }`}
                    >
                        ☰
                    </button>

                    <div className="ml-4">
                        <h1 className="font-bold">
                            Anova Technologies
                        </h1>
                    </div>
                </header>

                {/* Page content */}
                <main
                    className={`min-h-[calc(100vh-4rem)] p-4 transition-colors duration-300 sm:p-6 lg:p-8 ${
                        darkMode
                            ? "bg-gray-950"
                            : "bg-gray-50"
                    }`}
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;