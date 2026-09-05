import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Sidebar */}
            <AdminSidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main content */}
            <div className="lg:pl-64">

                {/* Top bar */}
                <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">

                    {/* Mobile menu */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-xl lg:hidden"
                    >
                        ☰
                    </button>

                    {/* Page title */}
                    <div className="hidden lg:block">
                        <p className="text-sm text-gray-500">
                            Admin Center
                        </p>

                        <h2 className="text-lg font-semibold text-gray-900">
                            Anova Technologies
                        </h2>
                    </div>

                    {/* Right side */}
                    <div className="ml-auto flex items-center gap-4">

                        {/* Notifications */}
                        <button
                            className="relative rounded-lg p-2 text-xl text-gray-600 hover:bg-gray-100"
                            title="Notifications"
                        >
                            🔔

                            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
                        </button>

                        {/* Admin profile */}
                        <div className="hidden items-center gap-3 sm:flex">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 font-semibold text-white">
                                A
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-gray-900">
                                    Administrator
                                </p>

                                <p className="text-xs text-gray-500">
                                    Admin
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page */}
                <main className="p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>

            </div>
        </div>
    );
}

export default AdminLayout;