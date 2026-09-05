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
];

function AdminSidebar({ open, onClose }) {
    return (
        <>
            {/* Mobile overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
                    fixed left-0 top-0 z-50 h-screen w-64
                    bg-white border-r border-gray-200
                    transition-transform duration-300
                    lg:translate-x-0
                    ${open ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                {/* Logo */}
                <div className="flex h-20 items-center justify-between border-b px-6">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            Anova
                        </h1>

                        <p className="text-xs font-medium text-gray-500">
                            Technologies
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-xl text-gray-500 lg:hidden"
                    >
                        ✕
                    </button>
                </div>

                {/* Navigation */}
                <nav className="px-4 py-6">
                    <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
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
                                    flex items-center gap-3 rounded-lg
                                    px-3 py-3 text-sm font-medium
                                    transition
                                    ${
                                        isActive
                                            ? "bg-gray-900 text-white"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                    }
                                    `
                                }
                            >
                                <span className="text-lg">
                                    {item.icon}
                                </span>

                                <span>{item.name}</span>
                            </NavLink>
                        ))}
                    </div>
                </nav>

                {/* Bottom section */}
                <div className="absolute bottom-0 left-0 right-0 border-t p-4">
                    <button
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100"
                    >
                        ⚙️
                        <span>Settings</span>
                    </button>
                </div>
            </aside>
        </>
    );
}

export default AdminSidebar;