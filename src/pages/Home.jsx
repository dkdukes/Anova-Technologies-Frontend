
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";

/* =========================================================
   CATEGORIES
========================================================= */

const customerReviews = [
  {
    name: "Brian Mwangi",
    location: "Nairobi",
    rating: 5,
    review:
      "Ordered a laptop from Anova Technologies and honestly, the service was excellent. The laptop arrived in perfect condition and the delivery was quick. The whole process was smooth from ordering to delivery. Definitely recommend them.",
  },
  {
    name: "Mercy Wanjiku",
    location: "Kiambu",
    rating: 5,
    review:
      "I bought a Samsung phone from Anova Technologies and I’m very happy with my purchase. The price was fair, the phone was exactly as described, and customer service was very helpful. I’ll definitely shop here again.",
  },
  {
    name: "Kevin Otieno",
    location: "Kisumu",
    rating: 5,
    review:
      "Great experience shopping with Anova Technologies. I ordered a printer and some accessories, and everything arrived safely. I especially liked how easy it was to place the order and track everything. Very reliable Kenyan tech store.",
  },
  {
    name: "Faith Njeri",
    location: "Nairobi",
    rating: 5,
    review:
      "Anova Technologies has some really good deals. I got a laptop at a great price and the quality is excellent. The team was responsive whenever I had a question. I’m happy with the service and would recommend Anova to anyone looking for genuine tech products.",
  },
];

const categories = [
  {
    name: "Laptops",
    slug: "laptops",
    icon: "💻",
    description: "Work, study and gaming laptops",
  },
  {
    name: "Desktops",
    slug: "desktops",
    icon: "🖥️",
    description: "Powerful desktop computers",
  },
  {
    name: "Phones",
    slug: "phones",
    icon: "📱",
    description: "Latest smartphones",
  },
  {
    name: "Printers",
    slug: "printers",
    icon: "🖨️",
    description: "Home and business printers",
  },
  {
    name: "Computer Accessories",
    slug: "accessories",
    icon: "⌨️",
    description: "Keyboards, mice, storage and more",
  },
  {
    name: "Phone Accessories",
    slug: "accessories",
    icon: "🔌",
    description: "Chargers, cables, cases and more",
  },
];

/* =========================================================
   FEATURES
========================================================= */

const features = [
  {
    icon: "✓",
    title: "Quality Products",
    description:
      "Carefully selected technology products from trusted brands.",
  },
  {
    icon: "🛡️",
    title: "Warranty & Support",
    description:
      "Get reliable support before and after your purchase.",
  },
  {
    icon: "🚚",
    title: "Convenient Delivery",
    description:
      "Get your technology delivered conveniently across Kenya.",
  },
  {
    icon: "🔒",
    title: "Secure Shopping",
    description:
      "Shop with confidence using secure checkout and payment options.",
  },
];

/* =========================================================
   HELPER FUNCTIONS
========================================================= */

function getProducts(data) {
  if (Array.isArray(data)) {
    return data;
  }

  return data?.results || [];
}

function getImage(product) {
  return (
    product?.primary_image ||
    product?.image ||
    product?.images?.find?.(
      (image) => image.is_primary
    )?.image_url ||
    product?.images?.[0]?.image_url ||
    null
  );
}

function getProductName(product) {
  return product?.name || product?.title || "Product";
}

function getPrice(product) {
  const price = Number(
    product?.sale_price ??
      product?.price ??
      0
  );

  return Number.isFinite(price) ? price : 0;
}

function getOldPrice(product) {
  const price = Number(product?.price ?? 0);
  const salePrice = Number(product?.sale_price ?? 0);

  if (
    Number.isFinite(price) &&
    Number.isFinite(salePrice) &&
    salePrice > 0 &&
    salePrice < price
  ) {
    return price;
  }

  return 0;
}

/* =========================================================
   DISCOUNT CALCULATION
========================================================= */

function getDiscount(product) {
  const price = getPrice(product);
  const oldPrice = getOldPrice(product);

  if (oldPrice <= price || oldPrice <= 0) {
    return 0;
  }

  return Math.round(
    ((oldPrice - price) / oldPrice) * 100
  );
}

/* =========================================================
   PRODUCT CARD
========================================================= */

function ProductCard({ product, addToCart }) {
  const image = getImage(product);
  const price = getPrice(product);
  const oldPrice = getOldPrice(product);
  const discount = getDiscount(product);

  const slug = product?.slug || product?.id;

  const handleAdd = () => {
    addToCart(product);
  };

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      {/* PRODUCT IMAGE / LINK */}
      <Link
        to={`/products/${slug}`}
        className="block"
      >
        <div className="relative flex h-56 items-center justify-center bg-gray-50 p-5">
          {image ? (
            <img
              src={image}
              alt={getProductName(product)}
              className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="text-6xl">
              💻
            </div>
          )}

          {/* DISCOUNT BADGE */}
          {discount > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white">
              -{discount}%
            </span>
          )}
        </div>

        {/* PRODUCT INFORMATION */}
        <div className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {product?.brand?.name ||
              product?.brand_name ||
              "Anova Technologies"}
          </p>

          <h3 className="mt-2 line-clamp-2 min-h-12 font-semibold text-gray-900 group-hover:text-blue-600">
            {getProductName(product)}
          </h3>

          {/* PRICE */}
          <div className="mt-3 flex items-end gap-2">
            <span className="text-lg font-bold text-gray-900">
              KSh {price.toLocaleString()}
            </span>

            {oldPrice > price && (
              <span className="text-sm text-gray-400 line-through">
                KSh {oldPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* ADD TO CART */}
      <div className="px-5 pb-5">
        <button
          type="button"
          onClick={handleAdd}
          className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   PRODUCT SECTION
========================================================= */

function ProductSection({
  eyebrow,
  title,
  description,
  products,
  addToCart,
  viewAllLink = "/shop",
  background = "bg-white",
}) {
  return (
    <section
      className={`${background} py-16 sm:py-20`}
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* SECTION HEADER */}
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              {eyebrow}
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {title}
            </h2>

            {description && (
              <p className="mt-3 text-gray-600">
                {description}
              </p>
            )}
          </div>

          <Link
            to={viewAllLink}
            className="hidden shrink-0 font-semibold text-blue-600 hover:text-blue-700 sm:block"
          >
            View all →
          </Link>
        </div>

        {/* PRODUCTS */}
        {products.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((product) => (
              <div
                key={product.id || product.slug}
                className="relative"
              >
                <ProductCard
                  product={product}
                  addToCart={addToCart}
                />

                {/* FLASH SALE PERCENTAGE */}
                {eyebrow === "Limited time" &&
                  getDiscount(product) > 0 && (
                    <span className="absolute right-3 top-3 z-10 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow">
                      {getDiscount(product)}% OFF
                    </span>
                  )}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
            <p className="font-medium text-gray-600">
              No products available in this section yet.
            </p>
          </div>
        )}

        {/* MOBILE VIEW ALL */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            to={viewAllLink}
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            View all products →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   HOME PAGE
========================================================= */

export default function Home() {
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =======================================================
     FETCH PRODUCTS
  ======================================================= */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        /*
         * Fetch normal products and Flash Sale products
         * separately.
         */
        const [
          productsResponse,
          saleResponse,
        ] = await Promise.all([
          api.get("products/"),

          api.get("products/", {
            params: {
              sale: "true",
            },
          }),
        ]);

        setProducts(
          getProducts(productsResponse.data)
        );

        setSaleProducts(
          getProducts(saleResponse.data)
        );
      } catch (error) {
        console.error(
          "Failed to load homepage products:",
          error
        );

        setProducts([]);
        setSaleProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* =======================================================
     CATEGORY HELPERS
  ======================================================= */

  const normalize = (value) =>
    String(value || "")
      .toLowerCase()
      .replace(/[_-]/g, " ")
      .trim();

  const matchesCategory = (
    product,
    terms
  ) => {
    const category = normalize(
      product?.category?.name ||
        product?.category_name ||
        product?.category
    );

    const name = normalize(
      getProductName(product)
    );

    return terms.some(
      (term) =>
        category.includes(term) ||
        name.includes(term)
    );
  };

  /* =======================================================
     LAPTOP DEALS
     
     IMPORTANT:
     Only actual laptop categories are included.
     Laptop accessories are excluded.
  ======================================================= */

  const laptopProducts = products.filter(
    (product) => {
      const category = normalize(
        product?.category?.name ||
          product?.category_name ||
          product?.category
      );

      return (
        category.includes("laptop") &&
        !category.includes("accessor")
      );
    }
  );

  /* =======================================================
     PHONE DEALS
  ======================================================= */

  const phoneProducts = products.filter(
    (product) =>
      matchesCategory(product, [
        "phone",
        "smartphone",
        "smartphones",
      ])
  );

  /* =======================================================
     PRINTER DEALS
  ======================================================= */

  const printerProducts = products.filter(
    (product) =>
      matchesCategory(product, [
        "printer",
        "printers",
      ])
  );

  /* =======================================================
     ACCESSORIES DEALS
  ======================================================= */

  const accessoryProducts = products.filter(
    (product) =>
      matchesCategory(product, [
        "accessor",
        "accessories",
        "computer accessory",
        "phone accessory",
      ])
  );

  /* =======================================================
     FEATURED PRODUCTS
  ======================================================= */

  const featuredProducts = products.slice(0, 4);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="bg-white">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="overflow-hidden bg-gray-50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 sm:py-20 lg:grid-cols-2 lg:py-24">

          {/* HERO TEXT */}
          <div>
            <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              Computing & Technology
            </span>

            <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Technology that works
              <span className="text-blue-600">
                {" "}for you.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Discover computers, smartphones,
              printers and accessories from
              trusted brands at Anova Technologies.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Shop Now
              </Link>

              <Link
                to="/shop"
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-800 transition hover:bg-gray-50"
              >
                Explore Products
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <span className="font-bold text-green-600">
                  ✓
                </span>
                Quality products
              </span>

              <span className="flex items-center gap-2">
                <span className="font-bold text-green-600">
                  ✓
                </span>
                Warranty support
              </span>

              <span className="flex items-center gap-2">
                <span className="font-bold text-green-600">
                  ✓
                </span>
                Delivery across Kenya
              </span>
            </div>
          </div>

          {/* HERO VISUAL */}
          <div className="relative">
            <div className="relative flex min-h-[380px] items-center justify-center overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-200">

              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-100" />

              <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-gray-100" />

              <div className="relative text-center">
                <div className="text-8xl sm:text-9xl">
                  💻
                </div>

                <h2 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl">
                  Computing made simple
                </h2>

                <p className="mt-3 text-gray-500">
                  Laptops • Phones • Printers • Accessories
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CATEGORIES
      ====================================================== */}

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">

          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Browse
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Shop by category
              </h2>

              <p className="mt-3 text-gray-600">
                Find the technology you need.
              </p>
            </div>

            <Link
              to="/shop"
              className="hidden font-semibold text-blue-600 hover:text-blue-700 sm:block"
            >
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {categories.map(
              (category) => (
                <Link
                  key={category.slug}
                  to={`/shop?category=${category.slug}`}
                  className="group rounded-2xl border border-gray-200 bg-white p-5 transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-3xl transition group-hover:bg-blue-50">
                    {category.icon}
                  </div>

                  <h3 className="mt-5 font-bold text-gray-900 group-hover:text-blue-600">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-sm leading-5 text-gray-500">
                    {category.description}
                  </p>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          PRODUCTS
      ====================================================== */}

      {loading ? (
        <section className="bg-gray-50 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-6 text-center">

            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

            <p className="mt-4 text-gray-500">
              Loading products...
            </p>

          </div>
        </section>
      ) : (
        <>
          {/* =================================================
              FEATURED PRODUCTS
          ================================================== */}

          <ProductSection
            eyebrow="Our selection"
            title="Featured products"
            description="Popular technology products available at Anova."
            products={featuredProducts}
            addToCart={addToCart}
            background="bg-gray-50"
          />

          {/* =================================================
              FLASH SALE
          ================================================== */}

          <ProductSection
            eyebrow="Limited time"
            title="Flash Sale"
            description="Grab selected products at special prices while stocks last."
            products={saleProducts}
            addToCart={addToCart}
            viewAllLink="/shop?sale=true"
            background="bg-white"
          />

          {/* =================================================
              LAPTOP DEALS
          ================================================== */}

          <ProductSection
            eyebrow="Computers"
            title="Laptop Deals"
            description="Powerful laptops for work, school, business and gaming."
            products={laptopProducts}
            addToCart={addToCart}
            viewAllLink="/shop?category=laptops"
            background="bg-gray-50"
          />

          {/* =================================================
              PHONE DEALS
          ================================================== */}

          <ProductSection
            eyebrow="Mobile technology"
            title="Phone Deals"
            description="Discover smartphones for work, entertainment and everyday life."
            products={phoneProducts}
            addToCart={addToCart}
            viewAllLink="/shop?category=smartphones"
            background="bg-white"
          />

          {/* =================================================
              PRINTER DEALS
          ================================================== */}

          <ProductSection
            eyebrow="Printing"
            title="Printer Deals"
            description="Reliable printers for home, school and business."
            products={printerProducts}
            addToCart={addToCart}
            viewAllLink="/shop?category=printers"
            background="bg-gray-50"
          />

          {/* =================================================
              ACCESSORIES DEALS
          ================================================== */}

          <ProductSection
            eyebrow="Complete your setup"
            title="Accessories Deals"
            description="Keyboards, mice, chargers, storage, cables and more."
            products={accessoryProducts}
            addToCart={addToCart}
            viewAllLink="/shop?category=computer-accessories"
            background="bg-white"
          />
        </>
      )}

      {/* =========================
              CUSTOMER REVIEWS
          ========================= */}
          <section className="bg-gray-50 py-16">
            <div className="mx-auto max-w-7xl px-6">

              {/* Section heading */}
              <div className="mb-10 text-center">
                <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
                  What Our Customers Say
                </p>

                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                  Loved by Customers Across Kenya
                </h2>

                <p className="mx-auto mt-3 max-w-2xl text-gray-600">
                  See what our customers have to say about their shopping
                  experience with Anova Technologies.
                </p>
              </div>


              {/* Reviews */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                {customerReviews.map((review) => (
                  <div
                    key={`${review.name}-${review.location}`}
                    className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >

                    {/* Stars */}
                    <div className="mb-4 flex gap-1">
                      {[...Array(review.rating)].map(
                        (_, index) => (
                          <span
                            key={index}
                            className="text-lg text-yellow-400"
                          >
                            ★
                          </span>
                        )
                      )}
                    </div>


                    {/* Review */}
                    <p className="flex-1 text-sm leading-6 text-gray-600">
                      “{review.review}”
                    </p>


                    {/* Customer */}
                    <div className="mt-6 flex items-center border-t border-gray-100 pt-5">

                      {/* Avatar */}
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
                        {review.name
                          .split(" ")
                          .map((name) => name[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>


                      {/* Customer information */}
                      <div className="ml-3">
                        <h3 className="text-sm font-semibold text-gray-900">
                          {review.name}
                        </h3>

                        <p className="text-xs text-gray-500">
                          {review.location}, Kenya
                        </p>
                      </div>

                    </div>

                  </div>
                ))}

              </div>

            </div>
          </section>

      {/* =====================================================
          WHY CHOOSE ANOVA
      ====================================================== */}

      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Why Anova?
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why choose Anova Technologies?
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              We make it easier to find quality
              technology with reliable support
              and convenient delivery.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(
              (feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-gray-200 bg-white p-7 text-center transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                    {feature.icon}
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-gray-900">
                    {feature.title}
                  </h3>

                  <p className="mt-2 leading-6 text-gray-600">
                    {feature.description}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
