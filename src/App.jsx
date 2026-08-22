import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";

import Home from "./pages/Home";



function Cart() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900">
        Shopping Cart
      </h1>
    </div>
  );
}

function Login() {
  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900">
        Login
      </h1>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>

      <Routes>

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
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route 
            path="/products/:slug"
            element={<ProductDetails/>}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}