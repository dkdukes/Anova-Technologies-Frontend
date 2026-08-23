import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const {totalItems} = useCart();

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    const query = search.trim();

    if (!query) return;

    navigate(`/shop?search=${encodeURIComponent(query)}`);
    setMobileMenu(false);
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive
        ? "text-blue-600"
        : "text-gray-700 hover:text-blue-600"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">

      {/* Main Navbar */}
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2"
          onClick={() => setMobileMenu(false)}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
            A
          </div>

          <span className="hidden text-xl font-bold text-gray-900 sm:block">
            Anova{" "}
            <span className="text-blue-600">
              Technologies
            </span>
          </span>

          <span className="text-lg font-bold text-gray-900 sm:hidden">
            Anova
          </span>
        </Link>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="mx-auto hidden max-w-xl flex-1 md:flex"
        >
          <div className="relative w-full">

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search laptops, phones, printers..."
              className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-4 pr-12 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="submit"
              aria-label="Search"
              className="absolute right-0 top-0 flex h-full w-11 items-center justify-center text-gray-500 transition hover:text-blue-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-4.35-4.35m1.35-5.4a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0Z"
                />
              </svg>
            </button>

          </div>
        </form>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex">

          <NavLink
            to="/"
            className={navLinkClass}
          >
            Home
          </NavLink>

          <NavLink
            to="/shop"
            className={navLinkClass}
          >
            Shop
          </NavLink>

          <NavLink
            to="/shop?category=laptops"
            className={navLinkClass}
          >
            Laptops
          </NavLink>

          <NavLink
            to="/shop?category=smartphones"
            className={navLinkClass}
          >
            Phones
          </NavLink>

          <NavLink
            to="/shop?category=printers"
            className={navLinkClass}
          >
            Printers
          </NavLink>

        </nav>

        {/* Actions */}
        <div className="ml-auto flex shrink-0 items-center gap-2">

          {/* Account */}
          <Link
            to="/login"
            className="hidden rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-blue-600 sm:block"
            aria-label="Account"
            title="Account"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.8"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
              />
            </svg>
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-blue-600"
            aria-label="Shopping cart"
            title="Shopping cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.8"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386a1.5 1.5 0 0 1 1.456 1.137L5.43 6.75m0 0h14.82a1.5 1.5 0 0 1 1.455 1.864l-1.35 5.4a1.5 1.5 0 0 1-1.455 1.136H8.25a1.5 1.5 0 0 1-1.455-1.136L5.43 6.75Zm2.82 10.5h10.5m-9 3h.008v.008H9.75V20.25Zm8.25 0h.008v.008H18V20.25Z"
              />
            </svg>

            {/* Cart count - will connect to CartContext later */}
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-xs font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile Menu */}
          <button
            type="button"
            onClick={() => setMobileMenu(!mobileMenu)}
            className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenu ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>

        </div>
      </div>

      {/* Mobile Search */}
      <div className="border-t border-gray-100 px-4 py-3 md:hidden">
        <form onSubmit={handleSearch}>
          <div className="relative">

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-4 pr-11 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="submit"
              aria-label="Search"
              className="absolute right-0 top-0 flex h-full w-11 items-center justify-center text-gray-500 hover:text-blue-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-4.35-4.35m1.35-5.4a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0Z"
                />
              </svg>
            </button>

          </div>
        </form>
      </div>

      {/* Mobile Navigation */}
      {mobileMenu && (
        <div className="border-t border-gray-200 bg-white lg:hidden">

          <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6">

            <div className="flex flex-col">

              <NavLink
                to="/"
                onClick={() => setMobileMenu(false)}
                className={navLinkClass}
              >
                Home
              </NavLink>

              <NavLink
                to="/shop"
                onClick={() => setMobileMenu(false)}
                className="border-b border-gray-100 py-3 text-sm font-medium text-gray-700"
              >
                Shop
              </NavLink>

              <NavLink
                to="/shop?category=laptops"
                onClick={() => setMobileMenu(false)}
                className="border-b border-gray-100 py-3 text-sm font-medium text-gray-700"
              >
                Laptops
              </NavLink>

              <NavLink
                to="/shop?category=smartphones"
                onClick={() => setMobileMenu(false)}
                className="border-b border-gray-100 py-3 text-sm font-medium text-gray-700"
              >
                Phones
              </NavLink>

              <NavLink
                to="/shop?category=printers"
                onClick={() => setMobileMenu(false)}
                className="border-b border-gray-100 py-3 text-sm font-medium text-gray-700"
              >
                Printers
              </NavLink>

              <Link
                to="/login"
                onClick={() => setMobileMenu(false)}
                className="py-3 text-sm font-medium text-gray-700"
              >
                Login / Account
              </Link>

            </div>

          </nav>

        </div>
      )}

    </header>
  );
}