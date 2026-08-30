import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";
import api from "../services/api";

const counties = [
  "Baringo",
  "Bomet",
  "Bungoma",
  "Busia",
  "Elgeyo-Marakwet",
  "Embu",
  "Garissa",
  "Homa Bay",
  "Isiolo",
  "Kajiado",
  "Kakamega",
  "Kericho",
  "Kiambu",
  "Kilifi",
  "Kirinyaga",
  "Kisii",
  "Kisumu",
  "Kitui",
  "Kwale",
  "Laikipia",
  "Lamu",
  "Machakos",
  "Makueni",
  "Mandera",
  "Marsabit",
  "Meru",
  "Migori",
  "Mombasa",
  "Murang'a",
  "Nairobi",
  "Nakuru",
  "Nandi",
  "Narok",
  "Nyamira",
  "Nyandarua",
  "Nyeri",
  "Samburu",
  "Siaya",
  "Taita-Taveta",
  "Tana River",
  "Tharaka-Nithi",
  "Trans Nzoia",
  "Turkana",
  "Uasin Gishu",
  "Vihiga",
  "Wajir",
  "West Pokot",
];

export default function Checkout() {
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

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const [loading, setLoading] = useState(false);

  const [deliveryFee, setDeliveryFee] = useState(null);
  const [deliveryLoading, setDeliveryLoading] = useState(false);

  const [order, setOrder] = useState(null);

  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState("");

  // -----------------------------------------
  // Normalize Kenyan phone number
  // -----------------------------------------

  const normalizePhoneNumber = (phone) => {
    let value = phone.trim();

    value = value.replace(/[\s\-()]/g, "");

    // 0712345678 -> 254712345678
    if (/^0[17]\d{8}$/.test(value)) {
      return `254${value.slice(1)}`;
    }

    // 254712345678
    if (/^254[17]\d{8}$/.test(value)) {
      return value;
    }

    // +254712345678 -> 254712345678
    if (/^\+254[17]\d{8}$/.test(value)) {
      return value.slice(1);
    }

    return null;
  };

  // -----------------------------------------
  // Get delivery fee
  // -----------------------------------------

  useEffect(() => {
    if (!form.county) {
      setDeliveryFee(null);
      return;
    }

    const fetchDeliveryFee = async () => {
      try {
        setDeliveryLoading(true);

        const response = await api.get(
          `orders/delivery-fee/?county=${encodeURIComponent(
            form.county
          )}`
        );

        setDeliveryFee(
          Number(response.data.delivery_fee)
        );
      } catch (error) {
        console.error(
          "Delivery fee error:",
          error
        );

        setDeliveryFee(null);
      } finally {
        setDeliveryLoading(false);
      }
    };

    fetchDeliveryFee();
  }, [form.county]);

  // -----------------------------------------
  // Handle input changes
  // -----------------------------------------

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: "",
      }));
    }

    if (serverError) {
      setServerError("");
    }
  };

  // -----------------------------------------
  // Validate individual field
  // -----------------------------------------

  const validateField = (name, value) => {
    const trimmedValue = value.trim();

    switch (name) {
      case "full_name":
        if (!trimmedValue) {
          return "Full name is required.";
        }

        if (trimmedValue.length < 2) {
          return "Please enter your full name.";
        }

        if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(trimmedValue)) {
          return "Please enter a valid name.";
        }

        return "";

      case "email":
        if (!trimmedValue) {
          return "Email address is required.";
        }

        if (
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            trimmedValue
          )
        ) {
          return "Enter a valid email address.";
        }

        return "";

      case "phone":
        if (!trimmedValue) {
          return "Phone number is required.";
        }

        if (!normalizePhoneNumber(trimmedValue)) {
          return "Enter a valid Kenyan phone number, e.g. 0712345678.";
        }

        return "";

      case "county":
        if (!value) {
          return "Please select your county.";
        }

        return "";

      case "town":
        if (!trimmedValue) {
          return "Town or city is required.";
        }

        if (trimmedValue.length < 2) {
          return "Please enter a valid town or city.";
        }

        return "";

      case "address":
        if (!trimmedValue) {
          return "Delivery address is required.";
        }

        if (trimmedValue.length < 5) {
          return "Please enter a more complete delivery address.";
        }

        return "";

      case "payment_method":
        if (!value) {
          return "Please select a payment method.";
        }

        return "";

      default:
        return "";
    }
  };

  // -----------------------------------------
  // Validate on blur
  // -----------------------------------------

  const handleBlur = (event) => {
    const { name, value } = event.target;

    const fieldError = validateField(
      name,
      value
    );

    if (fieldError) {
      setErrors((current) => ({
        ...current,
        [name]: fieldError,
      }));
    }
  };

  // -----------------------------------------
  // Validate form
  // -----------------------------------------

  const validateForm = () => {
    const newErrors = {};

    const fields = [
      "full_name",
      "email",
      "phone",
      "county",
      "town",
      "address",
      "payment_method",
    ];

    fields.forEach((field) => {
      const error = validateField(
        field,
        form[field]
      );

      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);

    return newErrors;
  };

  // -----------------------------------------
  // Poll payment status
  // -----------------------------------------

  const waitForPayment = async (
    checkoutRequestId
  ) => {
    const maxAttempts = 20;
    const interval = 3000;

    setPaymentStatus("pending");

    setPaymentMessage(
      "Check your phone and enter your M-Pesa PIN to complete the payment."
    );

    for (
      let attempt = 0;
      attempt < maxAttempts;
      attempt++
    ) {
      try {
        const response = await api.get(
          `payments/mpesa/status/${checkoutRequestId}/`
        );

        const status =
          response.data.payment_status;

        // -------------------------------------
        // Payment successful
        // -------------------------------------

        if (status === "paid") {
          setPaymentStatus("paid");

          setPaymentMessage(
            "Payment received successfully."
          );

          clearCart();

          return;
        }

        // -------------------------------------
        // Payment failed
        // -------------------------------------

        if (status === "failed") {
          setPaymentStatus("failed");

          setPaymentMessage(
            response.data.result_description ||
              "The M-Pesa payment was not completed."
          );

          return;
        }
      } catch (error) {
        console.error(
          "Payment status error:",
          error
        );
      }

      await new Promise((resolve) =>
        setTimeout(resolve, interval)
      );
    }

    // -----------------------------------------
    // Timeout
    // -----------------------------------------

    setPaymentStatus("timeout");

    setPaymentMessage(
      "We could not confirm your payment yet. Please check your M-Pesa messages before trying again."
    );
  };

  // -----------------------------------------
  // Submit order
  // -----------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    setServerError("");

    if (cartItems.length === 0) {
      setServerError("Your cart is empty.");
      return;
    }

    const validationErrors =
      validateForm();

    if (
      Object.keys(validationErrors).length > 0
    ) {
      const firstErrorField =
        Object.keys(validationErrors)[0];

      setTimeout(() => {
        document
          .getElementById(firstErrorField)
          ?.focus();
      }, 0);

      return;
    }

    const normalizedPhone =
      normalizePhoneNumber(form.phone);

    if (!normalizedPhone) {
      setErrors((current) => ({
        ...current,
        phone:
          "Enter a valid Kenyan phone number, e.g. 0712345678.",
      }));

      document
        .getElementById("phone")
        ?.focus();

      return;
    }

    try {
      setLoading(true);

      const payload = {
        customer: {
          full_name:
            form.full_name.trim(),

          email:
            form.email.trim(),

          phone:
            normalizedPhone,
        },

        delivery: {
          county:
            form.county.trim(),

          town:
            form.town.trim(),

          address:
            form.address.trim(),
        },

        payment_method:
          form.payment_method,

        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await api.post(
        "orders/create/",
        payload
      );

      // ---------------------------------------
      // M-PESA
      // ---------------------------------------

      if (
        form.payment_method === "mpesa"
      ) {
        const createdOrder =
          response.data.order;

        const checkoutRequestId =
          response.data.payment
            ?.checkout_request_id;

        setOrder(createdOrder);

        if (!checkoutRequestId) {
          setPaymentStatus("failed");

          setPaymentMessage(
            "The M-Pesa request could not be initiated. Please try again."
          );

          return;
        }

        // Don't clear cart yet.
        await waitForPayment(
          checkoutRequestId
        );

        return;
      }

      // ---------------------------------------
      // COD
      // ---------------------------------------

      setOrder(response.data);

      clearCart();
    } catch (err) {
      console.error(
        "Checkout error:",
        err
      );

      const backendError =
        err.response?.data?.error ||
        "Unable to place your order. Please try again.";

      setServerError(
        backendError
      );

      setTimeout(() => {
        document
          .getElementById("server-error")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
      }, 50);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // Field error
  // -----------------------------------------

  const FieldError = ({ name }) => {
    if (!errors[name]) {
      return null;
    }

    return (
      <p
        id={`${name}-error`}
        role="alert"
        className="mt-2 flex items-start gap-2 text-sm font-medium text-red-600"
      >
        <span aria-hidden="true">
          ⚠
        </span>

        <span>
          {errors[name]}
        </span>
      </p>
    );
  };

  // -----------------------------------------
  // Input class
  // -----------------------------------------

  const inputClass = (name) => {
    return `mt-2 w-full rounded-lg border px-4 py-3 outline-none transition focus:ring-2 ${
      errors[name]
        ? "border-red-500 bg-red-50/30 focus:border-red-500 focus:ring-red-100"
        : "border-gray-300 focus:border-blue-600 focus:ring-blue-100"
    }`;
  };

  // -----------------------------------------
  // Payment waiting / result screen
  // -----------------------------------------

  if (
    order &&
    order.payment_method === "mpesa"
  ) {
    const isPaid =
      paymentStatus === "paid";

    const isFailed =
      paymentStatus === "failed";

    const isTimeout =
      paymentStatus === "timeout";

    return (
      <section className="mx-auto max-w-3xl px-6 py-20">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">

          {/* Pending */}
          {!isPaid &&
            !isFailed &&
            !isTimeout && (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl">
                  📱
                </div>

                <h1 className="mt-6 text-3xl font-bold text-gray-900">
                  Check your phone
                </h1>

                <p className="mt-3 text-gray-600">
                  We've sent an M-Pesa payment request to:
                </p>

                <p className="mt-2 font-bold text-gray-900">
                  {form.phone}
                </p>

                <div className="mx-auto mt-6 max-w-md rounded-xl bg-blue-50 p-5">
                  <p className="font-semibold text-blue-900">
                    Enter your M-Pesa PIN
                  </p>

                  <p className="mt-2 text-sm leading-6 text-blue-700">
                    {paymentMessage}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-blue-600" />
                  Waiting for payment confirmation...
                </div>
              </>
            )}

          {/* Paid */}
          {isPaid && (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl font-bold text-green-600">
                ✓
              </div>

              <h1 className="mt-6 text-3xl font-bold text-gray-900">
                Payment successful
              </h1>

              <p className="mt-3 text-gray-600">
                Thank you for shopping with
                Anova Technologies.
              </p>

              <div className="mx-auto mt-8 max-w-md rounded-xl bg-gray-50 p-5 text-left">

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Order number
                  </span>

                  <span className="font-bold text-gray-900">
                    {order.order_number}
                  </span>
                </div>

                <div className="mt-3 flex justify-between gap-4">
                  <span className="text-gray-500">
                    Total
                  </span>

                  <span className="font-bold text-gray-900">
                    KSh{" "}
                    {Number(
                      order.total
                    ).toLocaleString()}
                  </span>
                </div>

                <div className="mt-3 flex justify-between gap-4">
                  <span className="text-gray-500">
                    Payment
                  </span>

                  <span className="font-semibold text-green-600">
                    Paid
                  </span>
                </div>
              </div>

              <p className="mt-6 text-sm text-gray-500">
                Your order has been confirmed successfully.
              </p>
            </>
          )}

          {/* Failed */}
          {isFailed && (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl text-red-600">
                ✕
              </div>

              <h1 className="mt-6 text-3xl font-bold text-gray-900">
                Payment failed
              </h1>

              <p className="mt-3 text-gray-600">
                {paymentMessage}
              </p>

              <p className="mt-4 text-sm text-gray-500">
                Your cart has been kept so you can try again.
              </p>

              <Link
                to="/cart"
                className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Return to Cart
              </Link>
            </>
          )}

          {/* Timeout */}
          {isTimeout && (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-3xl">
                ⏳
              </div>

              <h1 className="mt-6 text-3xl font-bold text-gray-900">
                Payment confirmation pending
              </h1>

              <p className="mt-3 text-gray-600">
                {paymentMessage}
              </p>

              <div className="mt-6 rounded-xl bg-yellow-50 p-5 text-left">
                <p className="font-semibold text-yellow-900">
                  Important
                </p>

                <p className="mt-2 text-sm leading-6 text-yellow-800">
                  If you already entered your M-Pesa PIN,
                  don't make another payment immediately.
                  Check your M-Pesa messages first.
                </p>
              </div>

              <Link
                to="/"
                className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Back to Home
              </Link>
            </>
          )}

        </div>
      </section>
    );
  }

  // -----------------------------------------
  // Empty cart
  // -----------------------------------------

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

  // -----------------------------------------
  // Checkout
  // -----------------------------------------

  const estimatedTotal =
    deliveryFee !== null
      ? totalPrice + deliveryFee
      : totalPrice;

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">

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

      <form
        onSubmit={handleSubmit}
        noValidate
      >

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* LEFT */}
          <div className="space-y-8">

            {/* Contact */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">

              <h2 className="text-xl font-bold text-gray-900">
                Contact Information
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">

                <div className="sm:col-span-2">

                  <label
                    htmlFor="full_name"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Full Name
                  </label>

                  <input
                    id="full_name"
                    type="text"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="John Doe"
                    autoComplete="name"
                    aria-invalid={!!errors.full_name}
                    className={inputClass(
                      "full_name"
                    )}
                  />

                  <FieldError name="full_name" />

                </div>

                <div>

                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="john@example.com"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    className={inputClass(
                      "email"
                    )}
                  />

                  <FieldError name="email" />

                </div>

                <div>

                  <label
                    htmlFor="phone"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="0712345678"
                    autoComplete="tel"
                    inputMode="tel"
                    aria-invalid={!!errors.phone}
                    className={inputClass(
                      "phone"
                    )}
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    Example: 0712345678 or +254712345678
                  </p>

                  <FieldError name="phone" />

                </div>

              </div>

            </div>

            {/* Delivery */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">

              <h2 className="text-xl font-bold text-gray-900">
                Delivery Information
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">

                <div>

                  <label
                    htmlFor="county"
                    className="text-sm font-semibold text-gray-700"
                  >
                    County
                  </label>

                  <select
                    id="county"
                    name="county"
                    value={form.county}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="address-level1"
                    aria-invalid={!!errors.county}
                    className={inputClass(
                      "county"
                    )}
                  >
                    <option value="">
                      Select your county
                    </option>

                    {counties.map(
                      (county) => (
                        <option
                          key={county}
                          value={county}
                        >
                          {county}
                        </option>
                      )
                    )}
                  </select>

                  <FieldError name="county" />

                </div>

                <div>

                  <label
                    htmlFor="town"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Town / City
                  </label>

                  <input
                    id="town"
                    type="text"
                    name="town"
                    value={form.town}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Nairobi"
                    autoComplete="address-level2"
                    aria-invalid={!!errors.town}
                    className={inputClass(
                      "town"
                    )}
                  />

                  <FieldError name="town" />

                </div>

                <div className="sm:col-span-2">

                  <label
                    htmlFor="address"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Delivery Address
                  </label>

                  <textarea
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Building, street, area, landmark..."
                    rows="4"
                    autoComplete="street-address"
                    aria-invalid={!!errors.address}
                    className={inputClass(
                      "address"
                    )}
                  />

                  <FieldError name="address" />

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
                    form.payment_method ===
                    "mpesa"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="mpesa"
                    checked={
                      form.payment_method ===
                      "mpesa"
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
                    form.payment_method ===
                    "card"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="card"
                    checked={
                      form.payment_method ===
                      "card"
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
                    form.payment_method ===
                    "cod"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="cod"
                    checked={
                      form.payment_method ===
                      "cod"
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

              <FieldError name="payment_method" />

            </div>

            {/* Server Error */}
            {serverError && (
              <div
                id="server-error"
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-4"
              >
                <div className="flex items-start gap-3">

                  <span className="text-lg text-red-600">
                    ⚠
                  </span>

                  <div>
                    <p className="font-semibold text-red-800">
                      Unable to place your order
                    </p>

                    <p className="mt-1 text-sm text-red-700">
                      {serverError}
                    </p>
                  </div>

                </div>
              </div>
            )}

          </div>

          {/* RIGHT */}
          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 lg:sticky lg:top-24">

            <h2 className="text-xl font-bold text-gray-900">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">

              {cartItems.map(
                (item) => (
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
                        SKU: {item.sku}
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
                )
              )}

            </div>

            <div className="my-6 border-t border-gray-200" />

            <div className="space-y-4">

              <div className="flex justify-between text-gray-600">
                <span>Items</span>
                <span>
                  {totalItems}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>

                <span className="font-medium text-gray-900">
                  KSh{" "}
                  {totalPrice.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>

                <span className="font-medium text-gray-900">
                  {deliveryLoading
                    ? "Calculating..."
                    : deliveryFee !== null
                    ? `KSh ${deliveryFee.toLocaleString()}`
                    : "—"}
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
                {estimatedTotal.toLocaleString()}
              </span>

            </div>

            <button
              type="submit"
              disabled={
                loading ||
                deliveryLoading
              }
              className="mt-6 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? form.payment_method ===
                  "mpesa"
                  ? "Sending M-Pesa Request..."
                  : "Processing Order..."
                : form.payment_method ===
                  "mpesa"
                ? "Place Order & Pay"
                : "Place Order"}
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-gray-500">
              Your payment information is securely handled.
            </p>

          </aside>

        </div>

      </form>

    </section>
  );
}