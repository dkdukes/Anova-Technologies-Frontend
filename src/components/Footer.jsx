import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-950 text-gray-300">

      {/* =========================
          MAIN FOOTER
      ========================= */}
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-10">

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* =========================
              BRAND
          ========================= */}
          <div>
            <Link
              to="/"
              className="inline-block"
            >
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Anova
                <span className="text-gray-400">
                  Technologies
                </span>
              </h2>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
              Your trusted destination for quality laptops,
              smartphones, printers, computer accessories,
              and technology solutions in Kenya.
            </p>

            {/* Social Media */}
            <div className="mt-6 flex gap-3">

              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 text-gray-400 transition hover:border-white hover:bg-white hover:text-gray-900"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14 8h3V4h-3c-3.3 0-5 1.7-5 5v3H6v4h3v8h4v-8h3l1-4h-4V9c0-.7.3-1 1-1z" />
                </svg>
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 text-gray-400 transition hover:border-white hover:bg-white hover:text-gray-900"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="5"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                  />
                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </a>

              <a
                href="#"
                aria-label="X"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 text-gray-400 transition hover:border-white hover:bg-white hover:text-gray-900"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-5-6.5L6.2 22H3.1l7.2-8.2L2.8 2h6.4l4.5 5.9L18.9 2zm-1.1 17.9h1.7L8.3 4H6.5l11.3 15.9z" />
                </svg>
              </a>

              <a
                href="#"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 text-gray-400 transition hover:border-white hover:bg-white hover:text-gray-900"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z" />
                  <path d="M8.5 8.5c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4-.1.6l-.5.6c.7 1.2 1.5 1.9 2.8 2.5l.6-.6c.2-.2.4-.2.6-.1l1.5.7c.3.1.4.3.3.6-.2.8-.7 1.4-1.4 1.6-1 .2-2.5-.4-4-1.5-1.4-1-2.5-2.4-3.1-3.7-.5-1-.5-1.8-.1-2.3Z" />
                </svg>
              </a>

            </div>
          </div>


          {/* =========================
              SHOP
          ========================= */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Shop
            </h3>

            <ul className="mt-5 space-y-3 text-sm">

              <li>
                <Link
                  to="/shop"
                  className="transition hover:text-white"
                >
                  All Products
                </Link>
              </li>

              <li>
                <Link
                  to="/shop?category=laptops"
                  className="transition hover:text-white"
                >
                  Laptops
                </Link>
              </li>

              <li>
                <Link
                  to="/shop?category=smartphones"
                  className="transition hover:text-white"
                >
                  Smartphones
                </Link>
              </li>

              <li>
                <Link
                  to="/shop?category=printers"
                  className="transition hover:text-white"
                >
                  Printers
                </Link>
              </li>

              <li>
                <Link
                  to="/shop?category=computer-accessories"
                  className="transition hover:text-white"
                >
                  Computer Accessories
                </Link>
              </li>

              <li>
                <Link
                  to="/shop?category=phone-accessories"
                  className="transition hover:text-white"
                >
                  Phone Accessories
                </Link>
              </li>

            </ul>
          </div>


          {/* =========================
              CUSTOMER SERVICE
          ========================= */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Customer Service
            </h3>

            <ul className="mt-5 space-y-3 text-sm">

              <li>
                <Link
                  to="/cart"
                  className="transition hover:text-white"
                >
                  Shopping Cart
                </Link>
              </li>

              <li>
                <Link
                  to="/checkout"
                  className="transition hover:text-white"
                >
                  Checkout
                </Link>
              </li>

              <li>
                <Link
                  to="/login"
                  className="transition hover:text-white"
                >
                  My Account
                </Link>
              </li>

              <li>
                <a
                  href="#"
                  className="transition hover:text-white"
                >
                  Delivery Information
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="transition hover:text-white"
                >
                  Returns & Refunds
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="transition hover:text-white"
                >
                  Contact Support
                </a>
              </li>

            </ul>
          </div>


          {/* =========================
              CONTACT
          ========================= */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Contact Us
            </h3>

            <div className="mt-5 space-y-5 text-sm">

              {/* Location */}
              <div className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 shrink-0 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12Z"
                  />
                  <circle
                    cx="12"
                    cy="9"
                    r="2.2"
                  />
                </svg>

                <div>
                  <p className="font-medium text-gray-200">
                    Location
                  </p>

                  <p className="mt-1 text-gray-400">
                    Nairobi, Kenya
                  </p>
                </div>
              </div>


              {/* Phone */}
              <div className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 shrink-0 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 4h3l1.5 4-2 1.5a15 15 0 0 0 7 7l1.5-2 4 1.5v3a2 2 0 0 1-2 2C10.3 21 3 13.7 3 5a2 2 0 0 1 2-2Z"
                  />
                </svg>

                <div>
                  <p className="font-medium text-gray-200">
                    Phone
                  </p>

                  <a
                    href="tel:+254700000000"
                    className="mt-1 block text-gray-400 transition hover:text-white"
                  >
                    +254 700 000 000
                  </a>
                </div>
              </div>


              {/* Email */}
              <div className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 shrink-0 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                  />

                  <path d="m3 7 9 6 9-6" />
                </svg>

                <div>
                  <p className="font-medium text-gray-200">
                    Email
                  </p>

                  <a
                    href="mailto:info@anovatechnologies.co.ke"
                    className="mt-1 block break-all text-gray-400 transition hover:text-white"
                  >
                    info@anovatechnologies.co.ke
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>


      {/* =========================
          NEWSLETTER
      ========================= */}
      <div className="border-y border-gray-800 bg-gray-900">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">

          <div>
            <h3 className="text-lg font-semibold text-white">
              Stay Updated
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              Get updates on new products, deals and special offers.
            </p>
          </div>

          <form
            className="flex w-full max-w-md"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              aria-label="Email address"
              className="min-w-0 flex-1 rounded-l-lg border border-gray-700 bg-gray-950 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-gray-400"
            />

            <button
              type="submit"
              className="rounded-r-lg bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-200"
            >
              Subscribe
            </button>
          </form>

        </div>
      </div>


      {/* =========================
          BOTTOM FOOTER
      ========================= */}
      <div className="mx-auto max-w-7xl px-6 py-6 sm:px-8 lg:px-10">

        <div className="flex flex-col gap-4 text-sm md:flex-row md:items-center md:justify-between">

          <p className="text-gray-500">
            © {new Date().getFullYear()} Anova Technologies.
            All rights reserved.
          </p>

          <div className="flex flex-wrap gap-5">

            <a
              href="#"
              className="text-gray-500 transition hover:text-white"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="text-gray-500 transition hover:text-white"
            >
              Terms & Conditions
            </a>

            <a
              href="#"
              className="text-gray-500 transition hover:text-white"
            >
              Cookie Policy
            </a>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;