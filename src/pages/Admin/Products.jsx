import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "out_of_stock", label: "Out of Stock" },
  { value: "archived", label: "Archived" },
];

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const [deletingId, setDeletingId] = useState(null);

  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "admin/products/"
      );

      const data = response.data;

      setProducts(
        data.results || data
      );

    } catch (err) {
      console.error(
        "Products loading error:",
        err
      );

      setError(
        "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD CATEGORIES
  // =====================================================

  const loadCategories = async () => {
    try {
      const response = await api.get(
        "categories/"
      );

      const data = response.data;

      setCategories(
        data.results || data
      );

    } catch (err) {
      console.error(
        "Category loading error:",
        err
      );
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // =====================================================
  // FILTER PRODUCTS
  // =====================================================

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {

      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        product.name
          ?.toLowerCase()
          .includes(searchText) ||
        product.sku
          ?.toLowerCase()
          .includes(searchText);

      const matchesCategory =
        !category ||
        String(
          product.category?.id
        ) === String(category);

      const matchesStatus =
        !status ||
        product.status === status;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    products,
    search,
    category,
    status,
  ]);

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const handleDelete = async (product) => {

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${product.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {

      setDeletingId(product.id);

      await api.delete(
        `admin/products/${product.id}/`
      );

      setProducts((previous) =>
        previous.filter(
          (item) =>
            item.id !== product.id
        )
      );

    } catch (err) {

      console.error(
        "Delete error:",
        err
      );

      alert(
        "Unable to delete this product."
      );

    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // STATUS BADGE
  // =====================================================

  const getStatusBadge = (product) => {

    const status =
      product.status;

    if (status === "active") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Active
        </span>
      );
    }

    if (status === "draft") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
          <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
          Draft
        </span>
      );
    }

    if (
      status === "out_of_stock"
    ) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
          Out of Stock
        </span>
      );
    }

    if (status === "archived") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
          Archived
        </span>
      );
    }

    return (
      <span className="text-xs text-gray-500">
        {status}
      </span>
    );
  };

  // =====================================================
  // STOCK DISPLAY
  // =====================================================

  const getStockDisplay = (product) => {

    const stock =
      Number(
        product.stock_quantity || 0
      );

    const threshold =
      Number(
        product.low_stock_threshold || 3
      );

    if (stock === 0) {
      return (
        <span className="font-medium text-red-600">
          Out of stock
        </span>
      );
    }

    if (stock <= threshold) {
      return (
        <span className="font-medium text-orange-600">
          {stock} low
        </span>
      );
    }

    return (
      <span className="text-gray-700">
        {stock}
      </span>
    );
  };

  // =====================================================
  // PRODUCT IMAGE
  // =====================================================

  const getProductImage = (
    product
  ) => {

    const images =
      product.images || [];

    if (!images.length) {
      return null;
    }

    const primary =
      images.find(
        (image) =>
          image.is_primary
      );

    return (
      primary ||
      images[0]
    )?.image_url;
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">

        <div className="text-center">

          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />

          <p className="text-sm text-gray-500">
            Loading products...
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="min-h-screen bg-gray-50">

      {/* ============================================
          HEADER
      ============================================ */}

      <div className="border-b bg-white">

        <div className="mx-auto max-w-7xl px-6 py-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h1 className="text-2xl font-bold text-gray-900">
                Products
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage your Anova Technologies products
              </p>

            </div>

            <Link
              to="/admin/products/create"
              className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              + Add New Product
            </Link>

          </div>

        </div>

      </div>

      {/* ============================================
          CONTENT
      ============================================ */}

      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* ERROR */}

        {error && (

          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>

        )}

        {/* ==========================================
            STAT CARDS
        ========================================== */}

        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

          <div className="rounded-xl border bg-white p-5 shadow-sm">

            <p className="text-sm text-gray-500">
              Total Products
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {products.length}
            </p>

          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">

            <p className="text-sm text-gray-500">
              Active
            </p>

            <p className="mt-2 text-2xl font-bold text-green-600">
              {
                products.filter(
                  (product) =>
                    product.status ===
                    "active"
                ).length
              }
            </p>

          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">

            <p className="text-sm text-gray-500">
              Drafts
            </p>

            <p className="mt-2 text-2xl font-bold text-yellow-600">
              {
                products.filter(
                  (product) =>
                    product.status ===
                    "draft"
                ).length
              }
            </p>

          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">

            <p className="text-sm text-gray-500">
              Low Stock
            </p>

            <p className="mt-2 text-2xl font-bold text-orange-600">
              {
                products.filter(
                  (product) =>
                    product.is_low_stock
                ).length
              }
            </p>

          </div>

        </div>

        {/* ==========================================
            FILTERS
        ========================================== */}

        <div className="mb-6 rounded-xl border bg-white p-5 shadow-sm">

          <div className="grid gap-4 md:grid-cols-3">

            {/* SEARCH */}

            <div className="md:col-span-1">

              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500">
                Search
              </label>

              <div className="relative">

                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  🔍
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search by name or SKU..."
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-gray-900"
                />

              </div>

            </div>

            {/* CATEGORY */}

            <div>

              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500">
                Category
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-900"
              >

                <option value="">
                  All Categories
                </option>

                {categories.map(
                  (item) => (

                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </option>

                  )
                )}

              </select>

            </div>

            {/* STATUS */}

            <div>

              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-900"
              >

                {STATUS_OPTIONS.map(
                  (item) => (

                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>

                  )
                )}

              </select>

            </div>

          </div>

        </div>

        {/* ==========================================
            PRODUCT TABLE
        ========================================== */}

        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

          <div className="flex items-center justify-between border-b px-5 py-4">

            <div>

              <h2 className="font-semibold text-gray-900">
                All Products
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                {filteredProducts.length} product
                {filteredProducts.length !== 1
                  ? "s"
                  : ""} found
              </p>

            </div>

            {(search ||
              category ||
              status) && (

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("");
                  setStatus("");
                }}
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Clear Filters
              </button>

            )}

          </div>

          {/* DESKTOP TABLE */}

          <div className="hidden overflow-x-auto lg:block">

            <table className="w-full">

              <thead className="border-b bg-gray-50">

                <tr>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Product
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Category
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Price
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Stock
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y">

                {filteredProducts.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="px-5 py-16 text-center"
                    >

                      <div className="text-4xl">
                        📦
                      </div>

                      <h3 className="mt-3 font-medium text-gray-900">
                        No products found
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Try changing your search or filters.
                      </p>

                    </td>

                  </tr>

                ) : (

                  filteredProducts.map(
                    (product) => {

                      const image =
                        getProductImage(
                          product
                        );

                      return (

                        <tr
                          key={product.id}
                          className="transition hover:bg-gray-50"
                        >

                          {/* PRODUCT */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-4">

                              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-gray-50">

                                {image ? (

                                  <img
                                    src={image}
                                    alt={
                                      product.name
                                    }
                                    className="h-full w-full object-contain"
                                  />

                                ) : (

                                  <div className="flex h-full items-center justify-center text-2xl text-gray-300">
                                    📦
                                  </div>

                                )}

                              </div>

                              <div className="min-w-0">

                                <p className="max-w-xs truncate font-medium text-gray-900">
                                  {product.name}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                  SKU:{" "}
                                  {product.sku}
                                </p>

                                {product.is_featured && (

                                  <span className="mt-1 inline-block text-xs font-medium text-yellow-600">
                                    ★ Featured
                                  </span>

                                )}

                              </div>

                            </div>

                          </td>

                          {/* CATEGORY */}

                          <td className="px-5 py-4 text-sm text-gray-600">

                            {product.category?.name ||
                              "—"}

                          </td>

                          {/* PRICE */}

                          <td className="px-5 py-4">

                            <div className="text-sm font-semibold text-gray-900">

                              KSh{" "}
                              {Number(
                                product.current_price ||
                                product.price ||
                                0
                              ).toLocaleString()}

                            </div>

                            {product.is_on_sale && (

                              <div className="text-xs text-gray-400 line-through">
                                KSh{" "}
                                {Number(
                                  product.price ||
                                  0
                                ).toLocaleString()}
                              </div>

                            )}

                          </td>

                          {/* STOCK */}

                          <td className="px-5 py-4 text-sm">
                            {getStockDisplay(
                              product
                            )}
                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-4">
                            {getStatusBadge(
                              product
                            )}
                          </td>

                          {/* ACTIONS */}

                          <td className="px-5 py-4">

                            <div className="flex justify-end gap-2">

                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/admin/products/${product.id}`
                                  )
                                }
                                className="rounded-lg border px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                              >
                                View
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/admin/products/${product.id}/edit`
                                  )
                                }
                                className="rounded-lg border px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                disabled={
                                  deletingId ===
                                  product.id
                                }
                                onClick={() =>
                                  handleDelete(
                                    product
                                  )
                                }
                                className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                              >
                                {deletingId ===
                                product.id
                                  ? "..."
                                  : "Delete"}
                              </button>

                            </div>

                          </td>

                        </tr>

                      );
                    }
                  )

                )}

              </tbody>

            </table>

          </div>

          {/* MOBILE CARDS */}

          <div className="divide-y lg:hidden">

            {filteredProducts.length === 0 ? (

              <div className="px-5 py-16 text-center">

                <div className="text-4xl">
                  📦
                </div>

                <h3 className="mt-3 font-medium text-gray-900">
                  No products found
                </h3>

              </div>

            ) : (

              filteredProducts.map(
                (product) => {

                  const image =
                    getProductImage(
                      product
                    );

                  return (

                    <div
                      key={product.id}
                      className="p-5"
                    >

                      <div className="flex gap-4">

                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border bg-gray-50">

                          {image ? (

                            <img
                              src={image}
                              alt={
                                product.name
                              }
                              className="h-full w-full object-contain"
                            />

                          ) : (

                            <div className="flex h-full items-center justify-center text-2xl text-gray-300">
                              📦
                            </div>

                          )}

                        </div>

                        <div className="min-w-0 flex-1">

                          <h3 className="truncate font-medium text-gray-900">
                            {product.name}
                          </h3>

                          <p className="mt-1 text-xs text-gray-500">
                            SKU:{" "}
                            {product.sku}
                          </p>

                          <p className="mt-2 font-semibold text-gray-900">
                            KSh{" "}
                            {Number(
                              product.current_price ||
                              product.price ||
                              0
                            ).toLocaleString()}
                          </p>

                        </div>

                      </div>

                      <div className="mt-4 flex items-center justify-between">

                        <div>

                          {getStatusBadge(
                            product
                          )}

                          <p className="mt-2 text-xs text-gray-500">
                            Stock:{" "}
                            {getStockDisplay(
                              product
                            )}
                          </p>

                        </div>

                        <div className="flex gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/admin/products/${product.id}/edit`
                              )
                            }
                            className="rounded-lg border px-3 py-2 text-xs font-medium"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            disabled={
                              deletingId ===
                              product.id
                            }
                            onClick={() =>
                              handleDelete(
                                product
                              )
                            }
                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600"
                          >
                            Delete
                          </button>

                        </div>

                      </div>

                    </div>

                  );
                }
              )

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Products;