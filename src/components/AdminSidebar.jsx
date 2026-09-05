import { NavLink } from "react-router-dom";

const menuItems = [
    {
        name: "Dashboard",
        path: "/admin/dashboard",
        icon: "📊",
    },
    {
        name: "Products",
        path: "/admin/products",
        icon: "📦",
    },
    {
        name: "Add Product",
        path: "/admin/products/create",
        icon: "➕",
    },
    {
        name: "Orders",
        path: "/admin/orders",
        icon: "🛒",
    },
    {
        name: "Customers",
        path: "/admin/customers",
        icon: "👥",
    },
    {
        name: "Categories",
        path: "/admin/categories",
        icon: "🏷️",
    },
    {
        name: "Brands",
        path: "/admin/brands",
        icon: "⭐",
    },
    {
        name: "Settings",
        path: "/admin/settings",
        icon: "⚙️",
    },
];

function AdminSidebar({
    open,
    onClose,
    darkMode,
    toggleDarkMode,
}) {
    return (
        <>
            {/* Mobile overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed left-0 top-0 z-50
                    flex h-screen w-64 flex-col
                    border-r
                    transition-colors duration-300
                    lg:translate-x-0
                    ${
                        darkMode
                            ? "border-gray-700 bg-gray-900"
                            : "border-gray-200 bg-white"
                    }
                    ${
                        open
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >
                {/* Logo */}
                <div
                    className={`
                        flex h-20 shrink-0 items-center
                        justify-between border-b px-6
                        transition-colors duration-300
                        ${
                            darkMode
                                ? "border-gray-700"
                                : "border-gray-200"
                        }
                    `}
                >
                    <div>
                        <h1
                            className={`
                                text-xl font-bold
                                ${
                                    darkMode
                                        ? "text-white"
                                        : "text-gray-900"
                                }
                            `}
                        >
                            Anova
                        </h1>

                        <p
                            className={`
                                text-xs font-medium
                                ${
                                    darkMode
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                }
                            `}
                        >
                            Technologies
                        </p>
                    </div>

                    {/* Mobile close button */}
                    <button
                        type="button"
                        onClick={onClose}
                        className={`
                            text-xl transition
                            lg:hidden
                            ${
                                darkMode
                                    ? "text-gray-400 hover:text-white"
                                    : "text-gray-500 hover:text-gray-900"
                            }
                        `}
                        aria-label="Close sidebar"
                    >
                        ✕
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-4 py-6">
                    <p
                        className={`
                            mb-3 px-3
                            text-xs font-semibold
                            uppercase tracking-wider
                            ${
                                darkMode
                                    ? "text-gray-500"
                                    : "text-gray-400"
                            }
                        `}
                    >
                        Main Menu
                    </p>

                    <div className="space-y-1">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `
                                    flex items-center gap-3
                                    rounded-lg px-3 py-3
                                    text-sm font-medium
                                    transition-colors duration-200
                                    ${
                                        isActive
                                            ? darkMode
                                                ? "bg-gray-700 text-white"
                                                : "bg-gray-900 text-white"
                                            : darkMode
                                            ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                    }
                                    `
                                }
                            >
                                <span className="text-lg">
                                    {item.icon}
                                </span>

                                <span>
                                    {item.name}
                                </span>
                            </NavLink>
                        ))}
                    </div>
                </nav>

                {/* Bottom section */}
                <div
                    className={`
                        shrink-0 border-t p-4
                        transition-colors duration-300
                        ${
                            darkMode
                                ? "border-gray-700"
                                : "border-gray-200"
                        }
                    `}
                >
                    {/* Theme Toggle */}
                    <button
                        type="button"
                        onClick={toggleDarkMode}
                        className={`
                            flex w-full items-center
                            justify-between rounded-lg
                            px-3 py-3
                            text-sm font-medium
                            transition-colors duration-200
                            ${
                                darkMode
                                    ? "text-gray-200 hover:bg-gray-800"
                                    : "text-gray-600 hover:bg-gray-100"
                            }
                        `}
                        aria-label={
                            darkMode
                                ? "Switch to light mode"
                                : "Switch to dark mode"
                        }
                    >
                        {/* Label */}
                        <div className="flex items-center gap-3">
                            <span className="text-lg">
                                {darkMode
                                    ? "🌙"
                                    : "☀️"}
                            </span>

                            <span>
                                {darkMode
                                    ? "Dark Mode"
                                    : "Light Mode"}
                            </span>
                        </div>

                        {/* Toggle switch */}
                        <div
                            className={`
                                relative h-6 w-11
                                rounded-full
                                transition-colors duration-200
                                ${
                                    darkMode
                                        ? "bg-gray-600"
                                        : "bg-gray-300"
                                }
                            `}
                        >
                            <div
                                className={`
                                    absolute top-1
                                    h-4 w-4
                                    rounded-full bg-white
                                    shadow
                                    transition-transform duration-200
                                    ${
                                        darkMode
                                            ? "translate-x-6"
                                            : "translate-x-1"
                                    }
                                `}
                            />
                        </div>
                    </button>
                </div>
            </aside>
        </>
    );
}

export default AdminSidebar;