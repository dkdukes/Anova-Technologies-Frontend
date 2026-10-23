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
  const [accountOpen, setAccountOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, logout, isAuthenticated } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenu(false);
    setAccountOpen(false);
    setOpenDropdown(null);
    navigate("/login", { replace: true });
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const query = search.trim();

    if (!query) return;

    navigate(`/shop?search=${encodeURIComponent(query)}`);
    setMobileMenu(false);
    setOpenDropdown(null);
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive
        ? "text-blue-600"
        : "text-gray-700 hover:text-blue-600"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/90">

      {/* Main Navbar */}
      <div className="mx-auto flex min-h-16 max-w-[1440px] items-center gap-3 px-4 py-2 sm:gap-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2.5"
          onClick={() => { setMobileMenu(false); setOpenDropdown(null); }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-extrabold text-white shadow-sm shadow-blue-600/20">
            A
          </div>

          <span className="hidden whitespace-nowrap text-lg font-extrabold tracking-tight text-gray-900 sm:block lg:text-xl">
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
          className="mx-auto hidden min-w-[220px] max-w-2xl flex-[1.5] md:flex"
        >
          <div className="relative w-full">

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search laptops, phones, printers..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-4 pr-12 text-sm outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
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
        <nav className="hidden items-center gap-3 xl:flex 2xl:gap-4">
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
                        onClick={() => { setOpenDropdown(null); setAccountOpen(false); }}
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

          {/* Account dropdown */}
          {isAuthenticated && user ? (
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setAccountOpen((open) => !open)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setAccountOpen(false);
                }}
                aria-haspopup="menu"
                aria-expanded={accountOpen}
                className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {user.profile_image ? (
                  <img src={user.profile_image} alt={user.username || "User profile"} className="h-9 w-9 rounded-full border border-gray-200 object-cover" />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {(user.first_name || user.username || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden max-w-28 text-left xl:block">
                  <span className="block text-[11px] text-gray-500">Welcome back</span>
                  <span className="block truncate text-sm font-semibold text-gray-900">{user.first_name || user.username}</span>
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className={`hidden h-4 w-4 text-gray-500 transition-transform xl:block ${accountOpen ? "rotate-180" : ""}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {accountOpen && (
                <>
                  <button type="button" aria-label="Close account menu" className="fixed inset-0 z-40 cursor-default" onClick={() => setAccountOpen(false)} />
                  <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                    <div className="border-b border-gray-100 bg-gray-50 px-4 py-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Signed in as</p>
                      <p className="mt-1 truncate text-sm font-bold text-gray-900">{user.first_name || user.username}</p>
                      {user.email && <p className="mt-0.5 truncate text-xs text-gray-500">{user.email}</p>}
                    </div>
                    <div className="p-2">
                      {user.profile_url && (
                        <Link role="menuitem" to={user.profile_url} onClick={() => setAccountOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-blue-50 hover:text-blue-700">Profile</Link>
                      )}
                      {user.orders_url && (
                        <Link role="menuitem" to={user.orders_url} onClick={() => setAccountOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-blue-50 hover:text-blue-700">My orders</Link>
                      )}
                      {!user.profile_url && !user.orders_url && (
                        <p className="px-3 py-2 text-xs leading-5 text-gray-500">Profile and order-history pages can be added here when their routes are available.</p>
                      )}
                      <button role="menuitem" type="button" onClick={handleLogout} className="mt-1 w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50">Log out</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link to="/login" className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-blue-50 hover:text-blue-700 sm:inline-flex" aria-label="Sign in" title="Login / Account">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0M4.5 20.25a7.5 7.5 0 0 1 15 0" />
              </svg>
              <span className="hidden xl:inline">Sign in</span>
            </Link>
          )}

          {/* Cart */}
          <Link
            to="/cart"
            className="relative rounded-xl p-2.5 text-gray-600 transition hover:bg-blue-50 hover:text-blue-600"
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

            {/* Live cart item count from CartContext */}
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-xs font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile Menu */}
          <button
            type="button"
            onClick={() => { setMobileMenu(!mobileMenu); setAccountOpen(false); setOpenDropdown(null); }}
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

                  {user.profile_url && (
                    <Link to={user.profile_url} onClick={() => setMobileMenu(false)} className="block rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                      Profile
                    </Link>
                  )}
                  {user.orders_url && (
                    <Link to={user.orders_url} onClick={() => setMobileMenu(false)} className="block rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                      My orders
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-1 w-full rounded-lg px-3 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    Log out
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