import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../services/api";
import ProductGallery from "../components/ProductGallery";
import ProductReviews from "../components/ProductReviews";
import QuantitySelector from "../components/QuantitySelector";
import { useCart } from "../context/CartContext";

const formatPrice = (value) => Number(value || 0).toLocaleString("en-KE");

function ProductDetails() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setProduct(null);
    setQuantity(1);
    setAddedToCart(false);
    setActiveTab("description");

    api.get(`products/${slug}/`)
      .then(({ data }) => { if (active) setProduct(data); })
      .catch((err) => {
        console.error("Error fetching product:", err);
        if (active) setError("Unable to load this product. Please try again.");
      })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [slug]);

  useEffect(() => {
    let active = true;
    setRelatedLoading(true);
    setRelatedProducts([]);

    api.get(`products/${slug}/related/`)
      .then(({ data }) => {
        if (!active) return;
        setRelatedProducts(Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : []);
      })
      .catch((err) => {
        console.error("Error fetching related products:", err);
        if (active) setRelatedProducts([]);
      })
      .finally(() => { if (active) setRelatedLoading(false); });

    return () => { active = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-semibold">Product Not Found</h1>
        <p className="text-gray-600">{error || "The product you are looking for does not exist."}</p>
        <Link to="/shop" className="rounded-lg bg-gray-900 px-6 py-3 text-white">Back to Shop</Link>
      </div>
    );
  }

  const specifications = Array.isArray(product.specifications) ? product.specifications : [];
  const technicalSpecifications = [
    { name: "Model", value: product.model },
    { name: "CPU Manufacturer", value: product.cpu_manufacturer },
    { name: "CPU Cores", value: product.cpu_cores },
    { name: "CPU Speed", value: product.cpu_speed ? `${product.cpu_speed} GHz` : "" },
    { name: "Display Size", value: product.display_size ? `${product.display_size} inches` : "" },
    { name: "Drive Type", value: product.drive_type },
    { name: "Graphics Type", value: product.graphics_type },
    { name: "Storage Capacity", value: product.storage_capacity },
    { name: "System Memory", value: product.system_memory },
    { name: "Color", value: product.color },
    { name: "Weight", value: product.weight ? `${product.weight} kg` : "" },
    { name: "Variation", value: product.variation },
    { name: "Condition", value: product.condition === "refurbished" ? "Refurbished" : product.condition === "new" ? "New" : product.condition },
  ].filter((spec) => spec.value !== null && spec.value !== undefined && String(spec.value).trim() !== "");
  const allSpecifications = [...technicalSpecifications, ...specifications];
  const highlights = Array.isArray(product.highlights) ? product.highlights : [];
  const stock = Number(product.stock_quantity ?? product.stock ?? 0);
  const price = Number(product.price || 0);
  const salePrice = Number(product.sale_price || 0);
  const now = new Date();
  const saleStarts = product.sale_start_date ? new Date(product.sale_start_date) : null;
  const saleEnds = product.sale_end_date ? new Date(product.sale_end_date) : null;
  const hasSale = salePrice > 0 && salePrice < price && (!saleStarts || now >= saleStarts) && (!saleEnds || now <= saleEnds);
  const currentPrice = hasSale ? salePrice : price;
  const reviewCount = Number(product.review_count || 0);
  const averageRating = reviewCount > 0 ? Math.max(0, Math.min(5, Number(product.average_rating || 0))) : 5;

  const categoryId = product.category?.id;
  const categorySlug = product.category?.slug;
  const categoryName = product.category?.name;
  const sameTypeProducts = relatedProducts.filter((item) => {
    if (item.id === product.id || item.slug === product.slug) return false;
    const category = item.category;
    if (!category || !product.category) return false;
    if (categoryId != null && typeof category === "object" && category.id != null) return String(category.id) === String(categoryId);
    if (categorySlug && typeof category === "object" && category.slug) return category.slug === categorySlug;
    const name = typeof category === "object" ? category.name : category;
    return Boolean(categoryName && name && String(name).toLowerCase() === String(categoryName).toLowerCase());
  });

  const getProductImage = (item) => {
    if (item.image) return item.image;
    if (item.image_url) return item.image_url;
    const images = Array.isArray(item.images) ? item.images : [];
    const primary = images.find((image) => image.is_primary) || images[0];
    return primary?.image_url || primary?.image || null;
  };

  const getItemPrice = (item) => {
    const original = Number(item.price || 0);
    const discounted = Number(item.sale_price || 0);
    const start = item.sale_start_date ? new Date(item.sale_start_date) : null;
    const end = item.sale_end_date ? new Date(item.sale_end_date) : null;
    return discounted > 0 && discounted < original && (!start || now >= start) && (!end || now <= end) ? discounted : original;
  };

  const handleAddToCart = () => {
    if (stock <= 0) return;
    addToCart(product, quantity);
    setAddedToCart(true);
  };

  const renderRelatedCards = (items) => (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const image = getProductImage(item);
        const count = Number(item.review_count || 0);
        const rating = count > 0 ? Number(item.average_rating || 0) : 5;
        return (
          <Link key={item.id} to={`/products/${item.slug}`} className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-md">
            <div className="flex h-48 items-center justify-center bg-gray-50 p-4">
              {image ? <img src={image} alt={item.name} className="h-full w-full object-contain transition group-hover:scale-105" /> : <span className="text-sm text-gray-400">No image</span>}
            </div>
            <div className="space-y-2 p-4">
              <h3 className="line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-blue-700">{item.name}</h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-amber-500">{"★".repeat(Math.max(0, Math.min(5, Math.round(rating))))}{"☆".repeat(5 - Math.max(0, Math.min(5, Math.round(rating))))}</span>
                <span className="text-gray-500">{count ? `(${count})` : "No reviews"}</span>
              </div>
              <p className="text-base font-semibold text-gray-900">KSh {formatPrice(getItemPrice(item))}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 pt-6">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-blue-700">Home</Link><span>/</span>
          <Link to="/shop" className="hover:text-blue-700">Shop</Link><span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>
      </div>

      <main className="mx-auto max-w-7xl px-6 pb-14 pt-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="lg:sticky lg:top-24">
            <ProductGallery product={product} />
          </div>

          <div>
            {product.brand?.name && <p className="mb-2 text-xs font-medium uppercase tracking-widest text-gray-500">{product.brand.name}</p>}
            <h1 className="text-xl md:text-2xl font-normal text-gray-900 mb-2">{product.name}</h1>

            <a href="#product-tabs" onClick={() => setActiveTab("reviews")} className="mt-3 inline-flex flex-wrap items-center gap-2 text-sm hover:opacity-80">
              <span className="tracking-wide text-amber-500" aria-label={reviewCount ? `${averageRating.toFixed(1)} out of 5 stars` : "Five decorative stars; not yet rated"}>
                {"★".repeat(Math.round(averageRating))}{"☆".repeat(5 - Math.round(averageRating))}
              </span>
              <span className="font-medium text-gray-800">{reviewCount ? averageRating.toFixed(1) : "Not yet rated"}</span>
              <span className="text-gray-500">{reviewCount ? `(${reviewCount} ${reviewCount === 1 ? "review" : "reviews"})` : "Be the first to review"}</span>
            </a>

            <div className="mt-5 flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${stock > 0 ? "bg-green-500" : "bg-red-500"}`} />
              <span className={`text-sm font-medium ${stock > 0 ? "text-green-700" : "text-red-600"}`}>
                {stock > 0 ? `In Stock${stock < 10 ? ` — Only ${stock} left` : ""}` : "Out of Stock"}
              </span>
            </div>

            <div className="mt-5 border-b border-gray-200 pb-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">KSh {formatPrice(currentPrice)}</span>
                {hasSale && <span className="text-lg text-gray-400 line-through">KSh {formatPrice(price)}</span>}
                {hasSale && <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">Sale</span>}
              </div>
            </div>

            <div className="mt-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Specifications</h2>
              {allSpecifications.length ? (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  {allSpecifications.slice(0, 7).map((spec, index) => (
                    <div key={`${spec.id || spec.name || spec.key || "spec"}-${index}`} className={`grid grid-cols-2 gap-4 px-4 py-3 text-sm ${index % 2 ? "bg-white" : "bg-gray-50"}`}>
                      <span className="text-gray-500">{spec.name || spec.key || "Specification"}</span>
                      <span className="break-words font-medium text-gray-800">{String(spec.value ?? spec.description ?? "-")}</span>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-gray-500">Specifications are not available for this product.</p>}
              {allSpecifications.length > 7 && <a href="#full-specifications" className="mt-3 inline-block text-sm font-medium text-blue-700 hover:underline">View all specifications</a>}
            </div>

            {stock > 0 && (
              <div className="mt-7">
                <label className="mb-2 block text-sm font-medium text-gray-700">Quantity</label>
                <QuantitySelector key={slug} stock={stock} onChange={(value) => { setQuantity(value); setAddedToCart(false); }} />
              </div>
            )}

            <button type="button" onClick={handleAddToCart} disabled={stock <= 0} className={`mt-5 w-full rounded-lg px-6 py-4 text-base font-semibold transition ${stock > 0 ? "bg-blue-700 text-white hover:bg-blue-800" : "cursor-not-allowed bg-gray-200 text-gray-500"}`}>
              {stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
            {addedToCart && <p role="status" className="mt-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-center text-sm text-green-700">✓ Product added to cart successfully</p>}
            {product.warranty && <p className="mt-5 text-sm text-gray-600"><span className="font-semibold text-gray-900">Warranty:</span> {product.warranty}</p>}
            <p className="mt-3 text-sm text-gray-500">Secure payment · Delivery across Kenya</p>
          </div>
        </div>

        <section id="product-tabs" className="mt-14 scroll-mt-24 border-t border-gray-200 pt-8">
          <div role="tablist" aria-label="Product details" className="flex gap-1 overflow-x-auto border-b border-gray-200">
            {[
              { id: "description", label: "Description" },
              { id: "reviews", label: `Reviews (${reviewCount})` },
              { id: "recommended", label: "Recommended" },
            ].map((tab) => (
              <button key={tab.id} id={`tab-${tab.id}`} type="button" role="tab" aria-selected={activeTab === tab.id} aria-controls={`panel-${tab.id}`} onClick={() => setActiveTab(tab.id)} className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition sm:px-6 ${activeTab === tab.id ? "border-blue-700 text-blue-700" : "border-transparent text-gray-500 hover:text-gray-900"}`}>
                {tab.label}
              </button>
            ))}
          </div>

          <div role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`} className="py-8">
            {activeTab === "description" && (
              <div className="space-y-10">
                {product.description ? (
                  <div>
                    <h2 className="mb-5 text-xl font-semibold text-gray-900">Product Description</h2>
                    <div className="prose prose-gray max-w-none text-gray-700 [&_img]:my-4 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6" dangerouslySetInnerHTML={{ __html: product.description }} />
                  </div>
                ) : <p className="text-gray-500">No description is available for this product.</p>}
              </div>
            )}

            {activeTab === "reviews" && <ProductReviews key={slug} />}

            {activeTab === "recommended" && (
              <div>
                <h2 className="mb-5 text-xl font-semibold">Recommended Products</h2>
                {relatedLoading ? <p className="text-gray-500">Loading recommendations...</p> : sameTypeProducts.length ? renderRelatedCards(sameTypeProducts.slice(0, 4)) : <p className="text-gray-500">No similar products available at the moment.</p>}
              </div>
            )}
          </div>
        </section>
      </main>

      <section className="bg-gray-50 py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">You May Also Like</h2>
              <p className="mt-1 text-sm text-gray-500">Explore more products in the same category</p>
            </div>
            <Link to={categorySlug ? `/shop?category=${encodeURIComponent(categorySlug)}` : "/shop"} className="text-sm font-medium text-blue-700 hover:underline">View All</Link>
          </div>
          {relatedLoading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-72 animate-pulse rounded-xl bg-gray-200" />)}
            </div>
          ) : sameTypeProducts.length ? renderRelatedCards(sameTypeProducts.slice(0, 4)) : (
            <p className="text-sm text-gray-500">No other products in this category are available right now.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default ProductDetails;
