import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import api from "../services/api";

export default function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    totalItems,
    totalPrice,
    clearCart,
  } = useCart();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    county: "",
    town: "",
    address: "",
    payment_method: "mpesa",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        customer: {
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
        },

        delivery: {
          county: form.county,
          town: form.town,
          address: form.address,
        },

        payment_method: form.payment_method,

        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await api.post(
        "orders/create/",
        payload
      );

      setOrder(response.data);

      /*
       * We only clear the cart after Django
       * successfully creates the order.
       */
      clearCart();

    } catch (err) {
      console.error("Checkout error:", err);

      const backendError =
        err.response?.data?.error ||
        "Unable to place your order. Please try again.";

      setError(backendError);
    } finally {
      setLoading(false);
    }
  };

  /* Successful order */
  if (order) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-20">

        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
            ✓
          </div>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Order received
          </h1>

          <p className="mt-3 text-gray-600">
            Thank you for shopping with Anova Technologies.
          </p>

          <div className="mx-auto mt-8 max-w-md rounded-xl bg-gray-50 p-5 text-left">

            <div className="flex justify-between">
              <span className="text-gray-500">
                Order number
              </span>

              <span className="font-bold text-gray-900">
                {order.order_number}
              </span>
            </div>

            <div className="mt-3 flex justify-between">
              <span className="text-gray-500">
                Total
              </span>

              <span className="font-bold text-gray-900">
                KSh{" "}
                {Number(order.total).toLocaleString()}
              </span>
            </div>

            <div className="mt-3 flex justify-between">
              <span className="text-gray-500">
                Payment
              </span>

              <span className="font-semibold capitalize text-orange-600">
                {order.payment_status}
              </span>
            </div>

          </div>

          {order.payment_method === "mpesa" && (
            <div className="mt-6 rounded-xl bg-blue-50 p-5 text-left">

              <h2 className="font-bold text-gray-900">
                M-Pesa payment
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Your order has been created and is awaiting
                payment. We'll initiate the M-Pesa payment
                process in the next step.
              </p>

            </div>
          )}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              to="/shop"
              className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-800 hover:bg-gray-50"
            >
              Continue Shopping
            </Link>

            <Link
              to="/"
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Back to Home
            </Link>

          </div>

        </div>

      </section>
    );
  }


  /* Empty cart */
  if (cartItems.length === 0) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-20 text-center">

        <div className="text-6xl">
          🛒
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Your cart is empty
        </h1>

        <p className="mt-3 text-gray-500">
          Add some products before checking out.
        </p>

        <Link
          to="/shop"
          className="mt-7 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Browse Products
        </Link>

      </section>
    );
  }


  return (
    <section className="mx-auto max-w-7xl px-6 py-10">

      {/* Header */}
      <div className="mb-10">

        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Anova Technologies
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Checkout
        </h1>

        <p className="mt-2 text-gray-500">
          Complete your order details below.
        </p>

      </div>


      <form onSubmit={handleSubmit}>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* LEFT */}
          <div className="space-y-8">

            {/* Customer information */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">

              <h2 className="text-xl font-bold text-gray-900">
                Contact Information
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">

                {/* Name */}
                <div className="sm:col-span-2">

                  <label className="text-sm font-semibold text-gray-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />

                </div>


                {/* Email */}
                <div>

                  <label className="text-sm font-semibold text-gray-700">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />

                </div>


                {/* Phone */}
                <div>

                  <label className="text-sm font-semibold text-gray-700">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="0712345678"
                    required
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

              </div>

            </div>


            {/* Delivery */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">

              <h2 className="text-xl font-bold text-gray-900">
                Delivery Information
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">

                {/* County */}
                <div>

                  <label className="text-sm font-semibold text-gray-700">
                    County
                  </label>

                  <input
                    type="text"
                    name="county"
                    value={form.county}
                    onChange={handleChange}
                    placeholder="Nairobi"
                    required
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />

                </div>


                {/* Town */}
                <div>

                  <label className="text-sm font-semibold text-gray-700">
                    Town / City
                  </label>

                  <input
                    type="text"
                    name="town"
                    value={form.town}
                    onChange={handleChange}
                    placeholder="Nairobi"
                    required
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />

                </div>


                {/* Address */}
                <div className="sm:col-span-2">

                  <label className="text-sm font-semibold text-gray-700">
                    Delivery Address
                  </label>

                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Building, street, area, landmark..."
                    rows="4"
                    required
                    className="mt-2 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

              </div>

            </div>


            {/* Payment */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">

              <h2 className="text-xl font-bold text-gray-900">
                Payment Method
              </h2>

              <div className="mt-6 space-y-3">

                {/* M-Pesa */}
                <label
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                    form.payment_method === "mpesa"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >

                  <input
                    type="radio"
                    name="payment_method"
                    value="mpesa"
                    checked={
                      form.payment_method === "mpesa"
                    }
                    onChange={handleChange}
                  />

                  <div>
                    <p className="font-semibold text-gray-900">
                      M-Pesa
                    </p>

                    <p className="text-sm text-gray-500">
                      Pay securely using M-Pesa.
                    </p>
                  </div>

                </label>


                {/* Card */}
                <label
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                    form.payment_method === "card"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >

                  <input
                    type="radio"
                    name="payment_method"
                    value="card"
                    checked={
                      form.payment_method === "card"
                    }
                    onChange={handleChange}
                  />

                  <div>
                    <p className="font-semibold text-gray-900">
                      Card
                    </p>

                    <p className="text-sm text-gray-500">
                      Card payment will be available soon.
                    </p>
                  </div>

                </label>


                {/* COD */}
                <label
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                    form.payment_method === "cod"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >

                  <input
                    type="radio"
                    name="payment_method"
                    value="cod"
                    checked={
                      form.payment_method === "cod"
                    }
                    onChange={handleChange}
                  />

                  <div>
                    <p className="font-semibold text-gray-900">
                      Cash on Delivery
                    </p>

                    <p className="text-sm text-gray-500">
                      Pay when your order is delivered.
                    </p>
                  </div>

                </label>

              </div>

            </div>


            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

          </div>


          {/* RIGHT - SUMMARY */}
          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 lg:sticky lg:top-24">

            <h2 className="text-xl font-bold text-gray-900">
              Order Summary
            </h2>


            {/* Products */}
            <div className="mt-6 space-y-4">

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3"
                >

                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gray-50">

                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain p-1"
                      />
                    ) : (
                      <span className="text-2xl">
                        💻
                      </span>
                    )}

                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="line-clamp-2 text-sm font-semibold text-gray-900">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>

                  </div>

                  <p className="text-sm font-semibold text-gray-900">
                    KSh{" "}
                    {(
                      item.price *
                      item.quantity
                    ).toLocaleString()}
                  </p>

                </div>
              ))}

            </div>


            <div className="my-6 border-t border-gray-200" />


            {/* Totals */}
            <div className="space-y-4">

              <div className="flex justify-between text-gray-600">
                <span>
                  Items
                </span>

                <span>
                  {totalItems}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>
                  Subtotal
                </span>

                <span className="font-medium text-gray-900">
                  KSh {totalPrice.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>
                  Delivery
                </span>

                <span className="font-medium text-gray-900">
                  KSh 300
                </span>
              </div>

            </div>


            <div className="my-6 border-t border-gray-200" />


            <div className="flex items-center justify-between">

              <span className="text-lg font-bold text-gray-900">
                Total
              </span>

              <span className="text-2xl font-bold text-gray-900">
                KSh{" "}
                {(totalPrice + 300).toLocaleString()}
              </span>

            </div>


            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Processing Order..."
                : "Place Order"}
            </button>


            <p className="mt-4 text-center text-xs leading-5 text-gray-500">
              By placing your order, you agree to Anova
              Technologies' terms and conditions.
            </p>

          </aside>

        </div>

      </form>

    </section>
  );
}