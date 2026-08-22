import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import api from "../services/api";

export default function Shop() {
  const [searchParams] = useSearchParams();

  const search = searchParams.get("search");
  const category = searchParams.get("category");

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const params = {};

        if (search) {
          params.search = search;
        }

        if (category) {
          params.category = category;
        }

        const response = await api.get("products/", {
          params,
        });

        setProducts(
          response.data.results || response.data
        );

      } catch (err) {
        console.error("Product API error:", err);

        setError(
          "Unable to load products. Please try again."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, category]);


  return (
    <section className="mx-auto max-w-7xl px-6 py-12">

      {/* Header */}
      <div className="mb-10">

        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Anova Technologies
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {category
            ? category.replace("-", " ")
            : "Shop"}
        </h1>

        {search ? (
          <p className="mt-3 text-gray-600">
            Search results for{" "}
            <span className="font-semibold text-gray-900">
              "{search}"
            </span>
          </p>
        ) : (
          <p className="mt-3 text-gray-600">
            Explore computers, phones, printers and accessories.
          </p>
        )}

      </div>


      {/* Loading */}
      {loading && (
        <div className="flex min-h-[300px] flex-col items-center justify-center">

          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="mt-4 text-gray-500">
            Loading products...
          </p>

        </div>
      )}


      {/* Error */}
      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">

          <p className="font-medium text-red-700">
            {error}
          </p>

        </div>
      )}


      {/* Empty */}
      {!loading && !error && products.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-16 text-center">

          <div className="text-5xl">
            🔍
          </div>

          <h2 className="mt-4 text-xl font-bold text-gray-900">
            No products found
          </h2>

          <p className="mt-2 text-gray-500">
            Try another search or browse another category.
          </p>

        </div>
      )}


      {/* Products */}
      {!loading && !error && products.length > 0 && (

        <>
          <div className="mb-5 text-sm text-gray-500">
            {products.length}{" "}
            {products.length === 1
              ? "product"
              : "products"}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}

          </div>
        </>
      )}

    </section>
  );
}