const stats = [
  {
    title: "Total Orders",
    value: "0",
    icon: "📦",
    description: "All orders",
  },
  {
    title: "Revenue",
    value: "KSh 0",
    icon: "💰",
    description: "Paid orders",
  },
  {
    title: "Products",
    value: "0",
    icon: "🛍️",
    description: "Active products",
  },
  {
    title: "Low Stock",
    value: "0",
    icon: "⚠️",
    description: "Need attention",
  },
];

export default function AdminDashboard() {
  return (
    <div>

      {/* Header */}
      <div className="mb-8">

        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Overview
        </p>

        <h2 className="mt-2 text-3xl font-bold text-gray-900">
          Dashboard
        </h2>

        <p className="mt-2 text-gray-500">
          Manage your Anova Technologies store.
        </p>

      </div>

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>

                <p className="mt-3 text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                {stat.icon}
              </div>

            </div>

            <p className="mt-4 text-xs text-gray-500">
              {stat.description}
            </p>

          </div>
        ))}

      </div>

      {/* Main dashboard */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">

        {/* Recent Orders */}
        <div className="rounded-2xl border border-gray-200 bg-white">

          <div className="flex items-center justify-between border-b border-gray-200 p-6">

            <div>
              <h3 className="font-bold text-gray-900">
                Recent Orders
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Latest customer orders
              </p>
            </div>

            <span className="text-2xl">
              📦
            </span>

          </div>

          <div className="p-6">

            <div className="rounded-xl bg-gray-50 p-8 text-center">

              <div className="text-4xl">
                📭
              </div>

              <p className="mt-3 font-semibold text-gray-900">
                No orders yet
              </p>

              <p className="mt-1 text-sm text-gray-500">
                New orders will appear here.
              </p>

            </div>

          </div>

        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-gray-200 bg-white">

          <div className="border-b border-gray-200 p-6">

            <h3 className="font-bold text-gray-900">
              Quick Actions
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Common store management tasks
            </p>

          </div>

          <div className="grid gap-3 p-6 sm:grid-cols-2">

            <a
              href="/admin/products/create"
              className="rounded-xl border border-gray-200 p-4 transition hover:border-blue-200 hover:bg-blue-50"
            >
              <div className="text-2xl">
                ➕
              </div>

              <p className="mt-3 font-semibold text-gray-900">
                Add Product
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Create a new product
              </p>
            </a>

            <a
              href="/admin/orders"
              className="rounded-xl border border-gray-200 p-4 transition hover:border-blue-200 hover:bg-blue-50"
            >
              <div className="text-2xl">
                📦
              </div>

              <p className="mt-3 font-semibold text-gray-900">
                Check Orders
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Manage customer orders
              </p>
            </a>

            <a
              href="/admin/revenue"
              className="rounded-xl border border-gray-200 p-4 transition hover:border-blue-200 hover:bg-blue-50"
            >
              <div className="text-2xl">
                💰
              </div>

              <p className="mt-3 font-semibold text-gray-900">
                View Revenue
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Track store performance
              </p>
            </a>

            <a
              href="/admin/products"
              className="rounded-xl border border-gray-200 p-4 transition hover:border-blue-200 hover:bg-blue-50"
            >
              <div className="text-2xl">
                🛍️
              </div>

              <p className="mt-3 font-semibold text-gray-900">
                Manage Products
              </p>

              <p className="mt-1 text-xs text-gray-500">
                View your inventory
              </p>
            </a>

          </div>

        </div>

      </div>

    </div>
  );
}