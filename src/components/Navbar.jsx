import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
            A
          </div>

          <span className="text-xl font-bold text-gray-900">
            Anova
            <span className="text-blue-600"> Technologies</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-7 md:flex">

          <Link
            to="/"
            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            to="/shop"
            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
          >
            Shop
          </Link>

          <Link
            to="/shop?category=laptops"
            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
          >
            Laptops
          </Link>

          <Link
            to="/shop?category=phones"
            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
          >
            Phones
          </Link>

          <Link
            to="/shop?category=printers"
            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
          >
            Printers
          </Link>

        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">

          <Link
            to="/login"
            className="hidden text-sm font-medium text-gray-700 hover:text-blue-600 sm:block"
          >
            Login
          </Link>

          <Link
            to="/cart"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Cart
          </Link>

        </div>

      </div>
    </header>
  );
}