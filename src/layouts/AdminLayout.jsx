import { NavLink, Outlet } from "react-router-dom";

const navigation = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: "📊",
    end: true,
  },
  {
    name: "Products",
    path: "/admin/products",
    icon: "🛍️",
  },
  {
    name: "Add Product",
    path: "/admin/products/create",
    icon: "➕",
  },
  {
    name: "Orders",
    path: "/admin/orders",
    icon: "📦",
  },
  {
    name: "Revenue",
    path: "/admin/revenue",
    icon: "💰",
  },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-gray-200 bg-white lg:block">

        <div className="flex h-16 items-center border-b border-gray-200 px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
              A
            </div>

            <div>
              <p className="font-bold text-gray-900">
                Anova
              </p>

              <p className="text-xs text-blue-600">
                Technologies
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 p-4">

          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <span className="text-lg">
                {item.icon}
              </span>

              {item.name}
            </NavLink>
          ))}

        </nav>

        {/* Bottom */}
        <div className="absolute bottom-0 w-full border-t border-gray-200 p-4">

          <NavLink
            to="/"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            <span>←</span>
            Back to Store
          </NavLink>

        </div>

      </aside>

      {/* Main area */}
      <div className="lg:pl-64">

        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">

          <div>
            <p className="text-sm text-gray-500">
              Admin Panel
            </p>

            <h1 className="font-semibold text-gray-900">
              Anova Technologies
            </h1>
          </div>

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
              A
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-900">
                Administrator
              </p>

              <p className="text-xs text-gray-500">
                Store Manager
              </p>
            </div>

          </div>

        </header>

        {/* Content */}
        <main className="p-6 lg:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}