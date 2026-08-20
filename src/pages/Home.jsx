import React from 'react'
import { Link } from 'react-router-dom'


const categories = [
  {
    name: "Laptops",
    icon: "💻",
    description: "Work, study and gaming laptops",
  },
  {
    name: "Desktops",
    icon: "🖥️",
    description: "Powerful desktop computers",
  },
  {
    name: "Smartphones",
    icon: "📱",
    description: "Latest smartphones",
  },
  {
    name: "Printers",
    icon: "🖨️",
    description: "Printers and printing solutions",
  },
  {
    name: "Computer Accessories",
    icon: "⌨️",
    description: "Keyboards, mice and more",
  },
  {
    name: "Phone Accessories",
    icon: "🔌",
    description: "Chargers, cables and cases",
  },
];


export default function Home() {
  return (
    <div>

      {/* Hero */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">

          <div>

            <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
              Computing & Technology
            </span>

            <h1 className="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Technology that works
              <span className="text-blue-600">
                {" "}for you.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Discover computers, smartphones, printers and accessories
              from trusted brands at Anova Technologies.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <Link
                to="/shop"
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
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

          </div>

          {/* Hero visual */}
          <div className="relative">

            <div className="flex min-h-[380px] items-center justify-center rounded-3xl bg-gray-100 p-10">

              <div className="text-center">

                <div className="text-8xl">
                  💻
                </div>

                <h2 className="mt-6 text-2xl font-bold text-gray-900">
                  Computing made simple
                </h2>

                <p className="mt-2 text-gray-600">
                  Laptops • Phones • Printers • Accessories
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-16">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Browse
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Shop by category
            </h2>

            <p className="mt-2 text-gray-600">
              Find the technology you need.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">

            {categories.map((category) => (
              <Link
                key={category.name}
                to="/shop"
                className="group rounded-2xl border border-gray-200 bg-white p-5 transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >

                <div className="text-4xl">
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

      {/* Trust section */}
      <section className="bg-white py-16">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-8 md:grid-cols-3">

            <div>
              <div className="text-3xl">✓</div>

              <h3 className="mt-4 text-lg font-bold">
                Quality Products
              </h3>

              <p className="mt-2 text-gray-600">
                Carefully selected technology products from trusted brands.
              </p>
            </div>

            <div>
              <div className="text-3xl">🛡️</div>

              <h3 className="mt-4 text-lg font-bold">
                Reliable Support
              </h3>

              <p className="mt-2 text-gray-600">
                Get support before and after your purchase.
              </p>
            </div>

            <div>
              <div className="text-3xl">🚚</div>

              <h3 className="mt-4 text-lg font-bold">
                Convenient Delivery
              </h3>

              <p className="mt-2 text-gray-600">
                Get your technology delivered conveniently.
              </p>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}
