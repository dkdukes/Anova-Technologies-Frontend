import ProductGallery from "../components/ProductGallery";
import QuantitySelector from "../components/QuantitySelector";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../services/api";

export default function ProductDetails() {
  const { slug } = useParams();
  const {addToCart}= useCart();
  const {quantity,setQuantity}=useState(1);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`products/${slug}/`);

        setProduct(response.data);
      } catch (err) {
        console.error("Product details error:", err);

        setError(
          "We couldn't find this product. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  /* Loading */
  if (loading) {
    return (
      <div className="mx-auto flex min-h-[500px] max-w-7xl flex-col items-center justify-center px-6">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

        <p className="mt-4 text-gray-500">
          Loading product...
        </p>
      </div>
    );
  }

  /* Error */
  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">

        <div className="text-6xl">
          😕
        </div>

        <h1 className="mt-5 text-2xl font-bold text-gray-900">
          Product not found
        </h1>

        <p className="mt-2 text-gray-500">
          {error}
        </p>

        <Link
          to="/shop"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Back to Shop
        </Link>

      </div>
    );
  }

  const hasImages =
    product.images && product.images.length > 0;

  const specifications =
    product.specifications || [];

  const isInStock =
    product.stock_quantity > 0;

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">

      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-500">

        <Link
          to="/"
          className="hover:text-blue-600"
        >
          Home
        </Link>

        <span className="mx-2">
          /
        </span>

        <Link
          to="/shop"
          className="hover:text-blue-600"
        >
          Shop
        </Link>

        <span className="mx-2">
          /
        </span>

        <span className="text-gray-900">
          {product.name}
        </span>

      </nav>


      {/* Main Product */}
      <div className="grid gap-10 lg:grid-cols-2">

        {/* =================================================
            PRODUCT IMAGE
        ================================================== */}
        <div>

          <ProductGallery product={product}/>

        </div>


        {/* =================================================
            PRODUCT INFORMATION
        ================================================== */}
        <div>

          {/* Brand */}
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            {product.brand?.name}
          </p>


          {/* Name */}
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {product.name}
          </h1>


          {/* SKU */}
          <p className="mt-3 text-sm text-gray-500">
            SKU:{" "}
            <span className="font-medium text-gray-700">
              {product.sku}
            </span>
          </p>


          {/* Short description */}
          <p className="mt-6 text-base leading-7 text-gray-600">
            {product.short_description}
          </p>


          {/* Price */}
          <div className="mt-7 border-y border-gray-200 py-6">

            {product.is_on_sale ? (
              <div className="flex flex-wrap items-center gap-3">

                <span className="text-3xl font-bold text-gray-900">
                  KSh{" "}
                  {Number(
                    product.current_price
                  ).toLocaleString()}
                </span>

                <span className="text-lg text-gray-400 line-through">
                  KSh{" "}
                  {Number(
                    product.price
                  ).toLocaleString()}
                </span>

                <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-600">
                  SALE
                </span>

              </div>
            ) : (
              <span className="text-3xl font-bold text-gray-900">
                KSh{" "}
                {Number(
                  product.current_price
                ).toLocaleString()}
              </span>
            )}

          </div>


          {/* Stock */}
          <div className="mt-6">

            {isInStock ? (
              <div>
                <p className="font-semibold text-green-600">
                  ✓ In Stock
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {product.stock_quantity} units available
                </p>
              </div>
            ) : (
              <p className="font-semibold text-red-600">
                Out of Stock
              </p>
            )}

          </div>


          {/* Warranty */}
          {product.warranty && (
            <div className="mt-5 flex items-center gap-3 rounded-lg bg-gray-50 p-4">

              <span className="text-xl">
                🛡️
              </span>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Warranty
                </p>

                <p className="text-sm text-gray-500">
                  {product.warranty}
                </p>
              </div>

            </div>
          )}


          {/* Add to cart */}
          <div className="mt-7 flex gap-3">

            {isInStock && (
                <div className="mt-6">
                    <QuantitySelector
                    stock={product.stock_quantity}
                    onChange={setQuantity}
                    />
                </div>
            )}
            <button
                type="button"
                disabled={!isInStock}
                onClick={() => {
                    addToCart(product, quantity);
                }}
                className={`flex-1 rounded-lg px-6 py-3 font-semibold text-white transition ${
                    isInStock
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "cursor-not-allowed bg-gray-400"
                }`}
                >
                {isInStock
                    ? "Add to Cart"
                    : "Out of Stock"}
            </button>

          </div>


          {/* Product benefits */}
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-gray-200 pt-7">

            <div>
              <p className="font-semibold text-gray-900">
                🚚 Delivery
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Delivery available across Kenya
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-900">
                🔒 Secure shopping
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Safe and secure checkout
              </p>
            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          DESCRIPTION
      ================================================== */}
      <section className="mt-16 border-t border-gray-200 pt-12">

        <h2 className="text-2xl font-bold text-gray-900">
          Product Description
        </h2>

        <div className="mt-5 max-w-4xl text-gray-600">

          <p className="whitespace-pre-line leading-8">
            {product.description}
          </p>

        </div>

      </section>


      {/* =================================================
          SPECIFICATIONS
      ================================================== */}
      {specifications.length > 0 && (
        <section className="mt-14 border-t border-gray-200 pt-12">

          <h2 className="text-2xl font-bold text-gray-900">
            Specifications
          </h2>

          <div className="mt-6 max-w-4xl overflow-hidden rounded-xl border border-gray-200">

            {specifications.map((spec, index) => (
              <div
                key={spec.id}
                className={`grid grid-cols-2 ${
                  index % 2 === 0
                    ? "bg-gray-50"
                    : "bg-white"
                }`}
              >

                <div className="border-r border-gray-200 px-5 py-4 font-medium text-gray-700">
                  {spec.name}
                </div>

                <div className="px-5 py-4 text-gray-600">
                  {spec.value}
                </div>

              </div>
            ))}

          </div>

        </section>
      )}


      {/* =================================================
          DELIVERY / PRODUCT INFORMATION
      ================================================== */}
      <section className="mt-14 border-t border-gray-200 pt-12">

        <h2 className="text-2xl font-bold text-gray-900">
          Product Information
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-xl bg-gray-50 p-5">
            <p className="text-sm text-gray-500">
              Condition
            </p>

            <p className="mt-1 font-semibold capitalize text-gray-900">
              {product.condition}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-5">
            <p className="text-sm text-gray-500">
              Warranty
            </p>

            <p className="mt-1 font-semibold text-gray-900">
              {product.warranty || "Not specified"}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-5">
            <p className="text-sm text-gray-500">
              Weight
            </p>

            <p className="mt-1 font-semibold text-gray-900">
              {product.weight
                ? `${product.weight} kg`
                : "Not specified"}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-5">
            <p className="text-sm text-gray-500">
              SKU
            </p>

            <p className="mt-1 font-semibold text-gray-900">
              {product.sku}
            </p>
          </div>

        </div>

      </section>

    </section>
  );
}