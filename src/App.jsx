import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import Products from "./pages/Admin/Products";
import CreateProduct from "./pages/Admin/CreateProduct";
import Orders from "./pages/Admin/Orders";
import OrderDetails from "./pages/Admin/OrderDetails";
import Customers from "./pages/Admin/Customers";
import CustomerDetails from "./pages/Admin/CustomerDetails";
import Categories from "./pages/Admin/Categories";
import Brands from "./pages/Admin/Brands";
import BrandDetails from "./pages/Admin/BrandDetails";
import AdminProductDetails from "./pages/Admin/AdminProductDetails";
import EditProduct from "./pages/Admin/EditProduct";
import Settings from "./pages/Admin/Settings";


function Login() {
  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900">
        Login
      </h1>
    </div>
  );
}


function Signup() {
  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900">
        Sign Up
      </h1>
    </div>
  );
}


export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />


        {/* Admin */}

        <Route
          path="/admin"
          element={<AdminLayout />}
        >

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

           <Route path="orders/:id" element={<OrderDetails />} />

           <Route path="customers" element={<Customers />} />

           <Route path="customers/:id" element={<CustomerDetails />} />

           <Route path="categories" element={<Categories />} />

           <Route path="brands" element={<Brands />} />

           <Route path="brands/:id" element={<BrandDetails />} />
           
           <Route path="settings" element={<Settings />} />

        </Route>


        {/* Store */}

        <Route element={<MainLayout />}>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/shop"
            element={<Shop />}
          />

          <Route
            path="/products/:slug"
            element={<ProductDetails />}
          />

          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}