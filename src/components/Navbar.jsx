import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const categoryMenus = {
  Laptops: [
    { name: "All Laptops", path: "/shop?category=laptops" },
    { name: "Dell", path: "/shop?category=laptops&brand=dell" },
    { name: "HP", path: "/shop?category=laptops&brand=hp" },
    { name: "Lenovo", path: "/shop?category=laptops&brand=lenovo" },
    { name: "Asus", path: "/shop?category=laptops&brand=asus" },
    { name: "Acer", path: "/shop?category=laptops&brand=acer" },
    { name: "Apple", path: "/shop?category=laptops&brand=apple" },
  ],
  Phones: [
    { name: "All Phones", path: "/shop?category=phones" },
    { name: "Samsung", path: "/shop?category=phones&brand=samsung" },
    { name: "Apple", path: "/shop?category=phones&brand=apple" },
    { name: "Xiaomi", path: "/shop?category=phones&brand=xiaomi" },
    { name: "Tecno", path: "/shop?category=phones&brand=tecno" },
    { name: "Infinix", path: "/shop?category=phones&brand=infinix" },
    { name: "Google", path: "/shop?category=phones&brand=google" },
  ],
  Printers: [
    { name: "All Printers", path: "/shop?category=printers" },
    { name: "HP", path: "/shop?category=printers&brand=hp" },
    { name: "Canon", path: "/shop?category=printers&brand=canon" },
    { name: "Epson", path: "/shop?category=printers&brand=epson" },
    { name: "Brother", path: "/shop?category=printers&brand=brother" },
  ],
  Accessories: [
    { name: "All Accessories", path: "/shop?category=accessories" },
    { name: "Computer Accessories", path: "/shop?category=accessories" },
    { name: "Phone Accessories", path: "/shop?category=accessories" },
    { name: "Keyboards", path: "/shop?search=keyboards" },
    { name: "Mice", path: "/shop?search=mice" },
    { name: "Storage", path: "/shop?search=storage" },
    { name: "Chargers & Cables", path: "/shop?search=chargers" },
  ],
};

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const {totalItems} = useCart();
  const { user, logout, isAuthenticated } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenu(false);
    navigate("/login", { replace: true });
  };

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
          onClick={() => { setMobileMenu(false); setOpenDropdown(null); }}
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
        <nav className="hidden items-center gap-5 lg:flex">
          <NavLink
            to="/"
            className={navLinkClass}
            onClick={() => setOpenDropdown(null)}
          >
            Home
          </NavLink>

          <NavLink
            to="/shop"
            className={navLinkClass}
            onClick={() => setOpenDropdown(null)}
          >
            Shop
          </NavLink>

          {Object.entries(categoryMenus).map(([category, items]) => (
            <div
              key={category}
              className="relative"
              onMouseEnter={() => setOpenDropdown(category)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === category ? null : category
                  )
                }
                className={`${navLinkClass({
                  isActive: false,
                })} flex items-center gap-1`}
                aria-expanded={openDropdown === category}
              >
                {category}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className={`h-4 w-4 transition-transform ${
                    openDropdown === category ? "rotate-180" : ""
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m6 9 6 6 6-6"
                  />
                </svg>
              </button>

              {openDropdown === category && (
                <div className="absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-3">
                  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-xl">
                    {items.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-2.5 text-sm text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Actions */}
        <div className="ml-auto flex shrink-0 items-center gap-2">

          {/* Account / Logged-in User */}
          {isAuthenticated && user ? (
            <div className="hidden items-center gap-2 sm:flex">
              {user.profile_image ? (
                <img
                  src={user.profile_image}
                  alt={user.username}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {(user.first_name || user.username || "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}

              <div className="hidden xl:block">
                <p className="text-xs text-gray-500">Welcome,</p>
                <p className="max-w-28 truncate text-sm font-semibold text-gray-900">
                  {user.first_name || user.username}
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                title="Logout"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-blue-600 sm:block"
              aria-label="Account"
              title="Login / Account"
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
                  d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0M4.5 20.25a7.5 7.5 0 0 1 15 0"
                />
              </svg>
            </Link>
          )}

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
                onClick={() => { setMobileMenu(false); setOpenDropdown(null); }}
                className={navLinkClass}
              >
                Home
              </NavLink>

              <NavLink
                to="/shop"
                onClick={() => { setMobileMenu(false); setOpenDropdown(null); }}
                className="border-b border-gray-100 py-3 text-sm font-medium text-gray-700"
              >
                Shop
              </NavLink>

              {/* Mobile category menus */}
              {Object.entries(categoryMenus).map(([category, items]) => (
                <div key={category} className="border-b border-gray-100">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === category ? null : category
                      )
                    }
                    className="flex w-full items-center justify-between py-3 text-left text-sm font-medium text-gray-700"
                  >
                    <span>{category}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className={`h-4 w-4 transition-transform ${
                        openDropdown === category ? "rotate-180" : ""
                      }`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m6 9 6 6 6-6"
                      />
                    </svg>
                  </button>

                  {openDropdown === category && (
                    <div className="mb-2 rounded-lg bg-gray-50">
                      {items.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => {
                            setOpenDropdown(null);
                            setMobileMenu(false);
                          }}
                          className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isAuthenticated && user ? (
                <div className="border-t border-gray-100 pt-3">
                  <div className="mb-3 flex items-center gap-3">
                    {user.profile_image ? (
                      <img
                        src={user.profile_image}
                        alt={user.username}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                        {(user.first_name || user.username || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    <div>
                      <p className="text-xs text-gray-500">Welcome,</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {user.first_name || user.username}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-lg py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    🚪 Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => { setMobileMenu(false); setOpenDropdown(null); }}
                  className="py-3 text-sm font-medium text-gray-700"
                >
                  Login / Account
                </Link>
              )}

            </div>

          </nav>

        </div>
      )}

    </header>
  );
}