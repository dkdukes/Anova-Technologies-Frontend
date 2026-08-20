import { useState } from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Navbar from './components/Navbar'
import Home from './pages/Home'

function Shop() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900">
        Shop
      </h1>
    </div>
  );
}

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

      <Navbar />

      <Routes>

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

      </Routes>

    </BrowserRouter>
  );
}
