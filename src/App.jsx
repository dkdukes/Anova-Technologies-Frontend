import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import Products from "./pages/Admin/Products";
import AdminProductDetails from "./pages/Admin/AdminProductDetails";
import EditProduct from "./pages/Admin/EditProduct";
import CreateProduct from "./pages/Admin/CreateProduct";
import Orders from "./pages/Admin/Orders";
import OrderDetails from "./pages/Admin/OrderDetails";
import Customers from "./pages/Admin/Customers";
import CustomerDetails from "./pages/Admin/CustomerDetails";
import Categories from "./pages/Admin/Categories";
import Brands from "./pages/Admin/Brands";
import BrandDetails from "./pages/Admin/BrandDetails";
import Settings from "./pages/Admin/Settings";

import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>

                    {/* Public authentication routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Public store */}
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route
                            path="/products/:slug"
                            element={<ProductDetails />}
                        />
                        <Route path="/cart" element={<Cart />} />
                    </Route>

                    {/* Customer-only checkout */}
                    <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
                        <Route element={<MainLayout />}>
                            <Route
                                path="/checkout"
                                element={<Checkout />}
                            />
                        </Route>
                    </Route>

                    {/* Staff + Admin area */}
                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={["staff", "admin"]}
                            />
                        }
                    >
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route
                                path="dashboard"
                                element={<AdminDashboard />}
                            />

                            <Route
                                path="products"
                                element={<Products />}
                            />

                            <Route
                                path="products/:id"
                                element={<AdminProductDetails />}
                            />

                            <Route
                                path="products/:id/edit"
                                element={<EditProduct />}
                            />

                            <Route
                                path="products/create"
                                element={<CreateProduct />}
                            />

                            <Route
                                path="orders"
                                element={<Orders />}
                            />

                            <Route
                                path="orders/:id"
                                element={<OrderDetails />}
                            />

                            <Route
                                path="customers"
                                element={<Customers />}
                            />

                            <Route
                                path="customers/:id"
                                element={<CustomerDetails />}
                            />

                            <Route
                                path="categories"
                                element={<Categories />}
                            />

                            <Route
                                path="brands"
                                element={<Brands />}
                            />

                            <Route
                                path="brands/:id"
                                element={<BrandDetails />}
                            />

                            <Route
                                path="settings"
                                element={<Settings />}
                            />
                        </Route>
                    </Route>

                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;