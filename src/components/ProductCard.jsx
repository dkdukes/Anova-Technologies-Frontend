
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const hasImage =
    product.images && product.images.length > 0;

  // Pricing
  const price = Number(product.price || 0);
  const salePrice = Number(product.sale_price || 0);

  const hasSale =
    salePrice > 0 &&
    salePrice < price;

  const currentPrice = hasSale
    ? salePrice
    : price;

  // Stock
  const stock = Number(
    product.stock_quantity || 0
  );

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-xl">

      {/* Product Image */}
      <Link
        to={`/products/${product.slug}`}
        className="block"
      >
        <div className="relative flex h-64 items-center justify-center overflow-hidden bg-gray-50 p-6">

          {hasImage ? (
            <img
              src={product.images[0].image_url}
              alt={
                product.images[0].alt_text ||
                product.name
              }
              className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="text-center">
              <div className="text-7xl">
                💻
              </div>

              <p className="mt-3 text-sm text-gray-400">
                Product image coming soon
              </p>
            </div>
          )}

          {/* Sale Badge */}
          {hasSale && (
            <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
              Sale
            </span>
          )}

          {/* Featured Badge */}
          {product.is_featured && (
            <span className="absolute right-3 top-3 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
              Featured
            </span>
          )}

        </div>
      </Link>

      {/* Product Information */}
      <div className="p-5">

        {/* Brand */}
        {product.brand?.name && (
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {product.brand.name}
          </p>
        )}

        {/* Product Name */}
        <Link
          to={`/products/${product.slug}`}
          className="mt-2 block"
        >
          <h3 className="line-clamp-2 min-h-[3rem] font-semibold text-gray-900 transition group-hover:text-blue-600">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-4">

          {hasSale ? (
            <div className="flex items-center gap-3">

              <span className="text-xl font-bold text-gray-900">
                KSh{" "}
                {currentPrice.toLocaleString()}
              </span>

              <span className="text-sm text-gray-400 line-through">
                KSh{" "}
                {price.toLocaleString()}
              </span>

            </div>
          ) : (
            <span className="text-xl font-bold text-gray-900">
              KSh{" "}
              {currentPrice.toLocaleString()}
            </span>
          )}

        </div>

        {/* Stock */}
        <div className="mt-3">

          {stock > 0 ? (
            <span className="text-sm font-medium text-green-600">
              In stock
            </span>
          ) : (
            <span className="text-sm font-medium text-red-600">
              Out of stock
            </span>
          )}

        </div>

        {/* View Product */}
        <Link
          to={`/products/${product.slug}`}
          className="mt-4 block rounded-lg bg-gray-900 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-600"
        >
          View Product
        </Link>

      </div>
    </article>
  );
}
