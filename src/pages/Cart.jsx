import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
  } = useCart();

 
const handleWhatsAppOrder = () => {
    if (!cartItems.length) return;

    const phoneNumber = "254726128360";

    const formatPrice = (price) =>
        Number(price || 0).toLocaleString("en-KE");

    const subtotal = cartItems.reduce((total, item) => {
        const price = Number(item.current_price || item.price || 0);
        return total + price * Number(item.quantity);
    }, 0);

    const orderDetails = cartItems.map((item, index) => {
        const price = Number(item.current_price || item.price || 0);
        const quantity = Number(item.quantity || 0);

        return `
${index + 1}. ${item.name}
SKU: ${item.sku || "N/A"}
Quantity: ${quantity}
Unit Price: KSh ${formatPrice(price)}
Item Total: KSh ${formatPrice(price * quantity)}
`;
    }).join("\n");

    const message = `
Hello Anova Technologies!

I would like to place an order.

ORDER DETAILS:
${orderDetails}

--------------------------------
Subtotal: KSh ${formatPrice(subtotal)}
Delivery: To be confirmed
--------------------------------

CUSTOMER DETAILS:
Please let me know what information you need to complete my order.

Kindly confirm product availability, delivery charges and payment instructions.

Thank you for choosing Anova Technologies!
`;

    const whatsappURL =
        `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank", "noopener,noreferrer");
};


  /* Empty cart */
  if (cartItems.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="mx-auto max-w-xl text-center">

          <div className="text-7xl">
            🛒
          </div>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Your cart is empty
          </h1>

          <p className="mt-3 text-gray-500">
            You haven't added any products to your cart yet.
          </p>

          <Link
            to="/shop"
            className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Continue Shopping
          </Link>

        </div>

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
          Shopping Cart
        </h1>

        <p className="mt-2 text-gray-500">
          {totalItems}{" "}
          {totalItems === 1 ? "item" : "items"} in your cart
        </p>

      </div>


      {/* Cart layout */}
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

        {/* Cart items */}
        <div className="space-y-4">

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-gray-200 bg-white p-5"
            >

              <div className="flex gap-5">

                {/* Image */}
                <Link
                  to={`/products/${item.slug}`}
                  className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl bg-gray-50 p-3"
                >

                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-4xl">
                      💻
                    </span>
                  )}

                </Link>


                {/* Details */}
                <div className="min-w-0 flex-1">

                  <Link
                    to={`/products/${item.slug}`}
                    className="font-semibold text-gray-900 transition hover:text-blue-600"
                  >
                    {item.name}
                  </Link>

                  <p className="mt-1 text-sm text-gray-500">
                    SKU: {item.sku}
                  </p>

                  <p className="mt-3 text-lg font-bold text-gray-900">
                    KSh {item.price.toLocaleString()}
                  </p>


                  {/* Quantity + remove */}
                  <div className="mt-4 flex flex-wrap items-center gap-4">

                    <div className="flex items-center rounded-lg border border-gray-300">

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity - 1
                          )
                        }
                        disabled={item.quantity <= 1}
                        className="px-3 py-1.5 text-lg text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        −
                      </button>

                      <span className="min-w-10 border-x border-gray-300 px-3 py-1.5 text-center font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity + 1
                          )
                        }
                        disabled={
                          item.quantity >=
                          item.stock_quantity
                        }
                        className="px-3 py-1.5 text-lg text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        +
                      </button>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeFromCart(item.id)
                      }
                      className="text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>

                  </div>

                </div>


                {/* Item total */}
                <div className="hidden text-right sm:block">

                  <p className="text-sm text-gray-500">
                    Item total
                  </p>

                  <p className="mt-1 font-bold text-gray-900">
                    KSh{" "}
                    {(
                      item.price *
                      item.quantity
                    ).toLocaleString()}
                  </p>

                </div>

              </div>

            </div>
          ))}

          {/* Continue shopping */}
          <Link
            to="/shop"
            className="inline-block pt-3 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Continue Shopping
          </Link>

        </div>


        {/* Order summary */}
        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 lg:sticky lg:top-24">

          <h2 className="text-xl font-bold text-gray-900">
            Order Summary
          </h2>

          <div className="mt-6 space-y-4">

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
                Calculated at checkout
              </span>
            </div>

          </div>


          <div className="my-6 border-t border-gray-200" />


          <div className="flex items-center justify-between">

            <span className="text-lg font-bold text-gray-900">
              Total
            </span>

            <span className="text-2xl font-bold text-gray-900">
              KSh {totalPrice.toLocaleString()}
            </span>

          </div>


          <Link
            to="/checkout"
            className="mt-6 block w-full rounded-lg bg-blue-600 px-6 py-3 mb-4 text-center font-semibold text-white transition hover:bg-blue-700"
          >
            Proceed to Checkout
          </Link>

          <button
              onClick={handleWhatsAppOrder}
              disabled={cartItems.length === 0}
              className="w-full flex items-center justify-center gap-2
                        bg-green-600 hover:bg-green-700
                        text-white py-3 rounded-lg
                        font-medium transition-colors"
          >
              <span>Order via WhatsApp</span>
          </button>

          <div className="mt-5 rounded-lg bg-gray-50 p-4">

            <p className="text-sm font-semibold text-gray-900">
              🔒 Secure Checkout
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Your order and payment information are securely handled.
            </p>

          </div>

        </aside>

      </div>

    </section>
  );
}