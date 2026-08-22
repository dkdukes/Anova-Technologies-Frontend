import { Link } from "react-router-dom";

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
    name: "Smartphones",
    slug: "smartphones",
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
    slug: "computer-accessories",
    icon: "⌨️",
    description: "Keyboards, mice, storage and more",
  },
  {
    name: "Phone Accessories",
    slug: "phone-accessories",
    icon: "🔌",
    description: "Chargers, cables, cases and more",
  },
];

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
];

export default function Home() {
  return (
    <div className="bg-white">

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="overflow-hidden bg-gray-50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 sm:py-20 lg:grid-cols-2 lg:py-24">

          {/* Hero Content */}
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
              Discover computers, smartphones, printers and
              accessories from trusted brands at Anova Technologies.
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

            {/* Small trust indicators */}
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-gray-500">

              <span className="flex items-center gap-2">
                <span className="font-bold text-green-600">✓</span>
                Quality products
              </span>

              <span className="flex items-center gap-2">
                <span className="font-bold text-green-600">✓</span>
                Warranty support
              </span>

              <span className="flex items-center gap-2">
                <span className="font-bold text-green-600">✓</span>
                Delivery across Kenya
              </span>

            </div>

          </div>

          {/* Hero Visual */}
          <div className="relative">

            <div className="relative flex min-h-[380px] items-center justify-center overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-200">

              {/* Decorative shapes */}
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

            {categories.map((category) => (
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
            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          FEATURED PRODUCTS
      ====================================================== */}
      <section className="bg-gray-50 py-16 sm:py-20">

        <div className="mx-auto max-w-7xl px-6">

          <div className="flex items-end justify-between">

            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Our selection
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Featured products
              </h2>

              <p className="mt-3 text-gray-600">
                Popular technology products available at Anova.
              </p>
            </div>

            <Link
              to="/shop"
              className="hidden font-semibold text-blue-600 hover:text-blue-700 sm:block"
            >
              View all →
            </Link>

          </div>


          {/* Temporary product placeholders */}
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
              >

                <div className="flex h-56 items-center justify-center bg-gray-100 text-6xl">
                  💻
                </div>

                <div className="p-5">

                  <p className="text-sm text-gray-500">
                    Anova Technologies
                  </p>

                  <h3 className="mt-1 font-semibold text-gray-900">
                    Featured technology product
                  </h3>

                  <p className="mt-4 text-xl font-bold text-gray-900">
                    KSh 0
                  </p>

                </div>

              </div>
            ))}

          </div>

          <div className="mt-8 text-center">
            <Link
              to="/shop"
              className="inline-flex rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
            >
              Browse all products
            </Link>
          </div>

        </div>

      </section>


      {/* =====================================================
          WHY ANOVA
      ====================================================== */}
      <section className="bg-white py-16 sm:py-20">

        <div className="mx-auto max-w-7xl px-6">

          <div className="text-center">

            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Why Anova?
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Technology you can trust
            </h2>

          </div>


          <div className="mt-12 grid gap-6 md:grid-cols-3">

            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-gray-200 p-7 text-center transition hover:shadow-md"
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
            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          CALL TO ACTION
      ====================================================== */}
      <section className="bg-blue-600">

        <div className="mx-auto max-w-7xl px-6 py-16 text-center sm:py-20">

          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to upgrade your technology?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Explore our collection of computers, phones,
            printers and accessories.
          </p>

          <Link
            to="/shop"
            className="mt-8 inline-flex rounded-lg bg-white px-7 py-3 font-semibold text-blue-600 shadow-sm transition hover:bg-gray-100"
          >
            Start Shopping
          </Link>

        </div>

      </section>

    </div>
  );
}