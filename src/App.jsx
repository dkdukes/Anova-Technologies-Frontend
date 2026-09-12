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
import { CartProvider } from "./context/CartContext";


function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <BrowserRouter>
                    <Routes>

                        {/* =================================
                            PUBLIC AUTHENTICATION ROUTES
                        ================================= */}
                        <Route
                            path="/login"
                            element={<Login />}
                        />

                        <Route
                            path="/signup"
                            element={<Signup />}
                        />


                        {/* =================================
                            PUBLIC STORE
                            Footer is provided by MainLayout
                        ================================= */}
                        <Route element={<MainLayout />}>

                            {/* Home */}
                            <Route
                                path="/"
                                element={<Home />}
                            />

                            {/* Shop */}
                            <Route
                                path="/shop"
                                element={<Shop />}
                            />

                            {/* Product Details */}
                            <Route
                                path="/products/:slug"
                                element={<ProductDetails />}
                            />

                            {/* Cart */}
                            <Route
                                path="/cart"
                                element={<Cart />}
                            />

                        </Route>


                        {/* =================================
                            CUSTOMER-ONLY CHECKOUT
                        ================================= */}
                        <Route
                            element={
                                <ProtectedRoute
                                    allowedRoles={["customer"]}
                                />
                            }
                        >
                            <Route element={<MainLayout />}>

                                <Route
                                    path="/checkout"
                                    element={<Checkout />}
                                />

                            </Route>
                        </Route>


                        {/* =================================
                            STAFF + ADMIN AREA
                        ================================= */}
                        <Route
                            element={
                                <ProtectedRoute
                                    allowedRoles={[
                                        "staff",
                                        "admin",
                                    ]}
                                />
                            }
                        >

                            <Route
                                path="/admin"
                                element={<AdminLayout />}
                            >

                                {/* Dashboard */}
                                <Route
                                    path="dashboard"
                                    element={<AdminDashboard />}
                                />


                                {/* =================================
                                    PRODUCTS
                                ================================= */}

                                <Route
                                    path="products"
                                    element={<Products />}
                                />

                                <Route
                                    path="products/:id"
                                    element={
                                        <AdminProductDetails />
                                    }
                                />

                                <Route
                                    path="products/:id/edit"
                                    element={<EditProduct />}
                                />

                                <Route
                                    path="products/create"
                                    element={<CreateProduct />}
                                />


                                {/* =================================
                                    ORDERS
                                ================================= */}

                                <Route
                                    path="orders"
                                    element={<Orders />}
                                />

                                <Route
                                    path="orders/:id"
                                    element={<OrderDetails />}
                                />


                                {/* =================================
                                    CUSTOMERS
                                ================================= */}

                                <Route
                                    path="customers"
                                    element={<Customers />}
                                />

                                <Route
                                    path="customers/:id"
                                    element={<CustomerDetails />}
                                />


                                {/* =================================
                                    CATEGORIES
                                ================================= */}

                                <Route
                                    path="categories"
                                    element={<Categories />}
                                />


                                {/* =================================
                                    BRANDS
                                ================================= */}

                                <Route
                                    path="brands"
                                    element={<Brands />}
                                />

                                <Route
                                    path="brands/:id"
                                    element={<BrandDetails />}
                                />


                                {/* =================================
                                    SETTINGS
                                ================================= */}

                                <Route
                                    path="settings"
                                    element={<Settings />}
                                />

                            </Route>

                        </Route>

                    </Routes>
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
    );
}


export default App;