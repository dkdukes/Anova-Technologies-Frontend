
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const hasImage =
    product.images && product.images.length > 0;

  // Pricing
  const price = Number(product.price || 0);
  const salePrice = Number(product.sale_price || 0);

  const hasSale =
    salePrice > 0 && salePrice < price;

  const currentPrice = hasSale ? salePrice : price;

  return (
    <article className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg">

      {/* Product Image */}
      <Link
        to={`/products/${product.slug}`}
        className="block"
      >
        <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gray-50 p-4">

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
              <p className="text-xs text-gray-400">
                Product image coming soon
              </p>
            </div>
          )}

          {/* Sale Badge */}
          {hasSale && (
            <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-1 text-[10px] font-normal text-white">
              Sale
            </span>
          )}

          {/* Featured Badge */}
          {product.is_featured && (
            <span className="absolute right-2 top-2 rounded-full bg-blue-600 px-2 py-1 text-[10px] font-normal text-white">
              Featured
            </span>
          )}
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-3">

        {/* Product Name */}
        <Link
          to={`/products/${product.slug}`}
          className="block"
        >
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-normal text-gray-800 transition group-hover:text-blue-600">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-3">
          {hasSale ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base font-normal text-gray-900">
                KSh {currentPrice.toLocaleString()}
              </span>

              <span className="text-xs font-normal text-gray-400 line-through">
                KSh {price.toLocaleString()}
              </span>
            </div>
          ) : (
            <span className="text-base font-normal text-gray-900">
              KSh {currentPrice.toLocaleString()}
            </span>
          )}
        </div>

          <div className="mt-1 flex items-center gap-1.5 text-sm">
            {product.review_count > 0 ? (
              <>
                <span className="text-amber-500">
                  {"★".repeat(
                    Math.round(product.average_rating)
                  )}
                  {"☆".repeat(
                    5 - Math.round(product.average_rating)
                  )}
                </span>

                <span className="font-medium text-gray-700">
                  {Number(product.average_rating).toFixed(1)}
                </span>

                <span className="text-gray-500">
                  ({product.review_count}{" "}
                  {product.review_count === 1 ? "review" : "reviews"})
                </span>
              </>
            ) : (
              <>
                <span className="text-amber-500">★★★★★</span>
                <span className="font-medium text-gray-700">5.0</span>
                <span className="text-gray-500">(0 reviews)</span>
              </>
            )}
          </div>

        {/* View Product */}
        <Link
          to={`/products/${product.slug}`}
          className="mt-3 block rounded-lg bg-gray-900 px-3 py-2 text-center text-xs font-normal text-white transition hover:bg-blue-600"
        >
          View Product
        </Link>
      </div>
    </article>
  );
}
