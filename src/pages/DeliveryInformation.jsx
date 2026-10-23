import { Link } from "react-router-dom";

const deliveryOptions = [
  {
    title: "Nairobi County",
    fee: "KSh 300",
    time: "1–2 business days",
    description:
      "Orders delivered within Nairobi County are charged the Nairobi delivery fee.",
  },
  {
    title: "Other counties in Kenya",
    fee: "KSh 500",
    time: "1–3 business days",
    description:
      "We deliver to customers in other counties across Kenya at the standard upcountry fee.",
  },
];

const deliverySteps = [
  {
    number: "01",
    title: "Place your order",
    description:
      "Choose your products and provide a valid phone number and complete delivery address at checkout.",
  },
  {
    number: "02",
    title: "Order confirmation",
    description:
      "We process your order and may contact you using the details supplied to confirm delivery information.",
  },
  {
    number: "03",
    title: "Dispatch and delivery",
    description:
      "Your order is prepared for dispatch and delivered within the estimated timeframe for your location.",
  },
  {
    number: "04",
    title: "Receive your items",
    description:
      "Make sure someone is available at the delivery address to receive the order.",
  },
];

const faqs = [
  {
    question: "Do you deliver outside Nairobi?",
    answer:
      "Yes. Anova Technologies delivers across all counties in Kenya. The standard delivery fee for counties outside Nairobi is KSh 500.",
  },
  {
    question: "How much does delivery cost?",
    answer:
      "The current standard fee is KSh 300 for Nairobi County and KSh 500 for other counties in Kenya. The fee is based on the delivery location provided at checkout.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Estimated delivery is 1–2 business days within Nairobi County and 1–3 business days for other counties. These are estimates and may vary due to public holidays, access to the delivery location, or other delays.",
  },
  {
    question: "What if my delivery details are incorrect?",
    answer:
      "Please ensure your phone number, county, town, and delivery address are accurate before submitting your order. If you notice an error, contact us promptly at info@anovatechnologies.co.ke.",
  },
];

function DeliveryInformation() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <nav aria-label="Breadcrumb" className="mb-7 text-sm text-gray-400">
            <Link to="/" className="transition hover:text-white">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-200">Delivery Information</span>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-200">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h11v11H3zM14 11h4l3 3v4h-7z" />
                <circle cx="7.5" cy="18" r="1.5" />
                <circle cx="17.5" cy="18" r="1.5" />
              </svg>
              Delivery across Kenya
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Your tech, <span className="text-blue-400">delivered.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
              Get laptops, smartphones, printers and accessories delivered to your doorstep. Here is what you need to know about our delivery areas, fees and estimated delivery times.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-gray-950"
              >
                Shop products
                <svg className="ml-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" /></svg>
              </Link>
              <a
                href="mailto:anovatechnologies871@gmail.com"
                className="inline-flex items-center justify-center rounded-lg border border-gray-700 px-6 py-3 font-semibold text-gray-100 transition hover:border-gray-500 hover:bg-white/5"
              >
                Ask a delivery question
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick facts */}
      <section className="mx-auto grid max-w-7xl gap-4 px-6 py-10 sm:grid-cols-3 sm:px-8 lg:px-10">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2.2"/></svg>
          </div>
          <h2 className="mt-4 font-semibold">Nationwide coverage</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">Delivery available across all counties in Kenya.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2"/></svg>
          </div>
          <h2 className="mt-4 font-semibold">Clear delivery estimates</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">1–2 business days in Nairobi and 1–3 in other counties.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <h2 className="mt-4 font-semibold">Straightforward fees</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">KSh 300 for Nairobi County and KSh 500 for other counties.</p>
        </div>
      </section>

      {/* Fees and timelines */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 sm:py-16 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">Delivery rates</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Delivery fees & timelines</h2>
            <p className="mt-4 leading-7 text-gray-600">Your delivery fee is determined by the county selected for your delivery address.</p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {deliveryOptions.map((option) => (
              <article key={option.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{option.title}</h3>
                    <p className="mt-2 max-w-md text-sm leading-6 text-gray-600">{option.description}</p>
                  </div>
                  <span className="inline-flex w-fit shrink-0 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">Standard delivery</span>
                </div>
                <div className="mt-7 grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                  <div>
                    <p className="text-sm text-gray-500">Delivery fee</p>
                    <p className="mt-1 text-2xl font-bold tracking-tight">{option.fee}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Estimated time</p>
                    <p className="mt-1 text-lg font-semibold sm:text-xl">{option.time}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-5 text-center text-xs leading-5 text-gray-500">Delivery times are estimates in business days and may be affected by public holidays, order confirmation, or conditions outside our control.</p>
        </div>
      </section>

      {/* Process */}
      <section className="mx-auto max-w-7xl px-6 py-14 sm:px-8 sm:py-16 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">How it works</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">From checkout to your doorstep</h2>
          <p className="mt-4 leading-7 text-gray-600">A simple process designed to help your order reach the right place.</p>
        </div>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {deliverySteps.map((step) => (
            <article key={step.number} className="rounded-2xl border border-gray-200 p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md">
              <span className="text-sm font-bold tracking-widest text-blue-700">{step.number}</span>
              <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Helpful notes */}
      <section className="border-y border-gray-200 bg-blue-50/60">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 sm:px-8 lg:grid-cols-2 lg:px-10">
          <div>
            <h2 className="text-xl font-bold">Before you place your order</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-700">
              <li className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600"/><span>Enter your correct phone number, county, town and delivery address at checkout.</span></li>
              <li className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600"/><span>Check your contact details so we can reach you if delivery information needs clarification.</span></li>
              <li className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600"/><span>Plan for someone to be available to receive the order at the delivery address.</span></li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold">Need help with delivery?</h2>
            <p className="mt-3 text-sm leading-6 text-gray-700">For questions about delivery details or a correction to your order information, email our team. Include your order number if you have already placed an order.</p>
            <a href="mailto:info@anovatechnologies.co.ke" className="mt-5 inline-flex items-center gap-2 font-semibold text-blue-700 transition hover:text-blue-900">
              anovatechnologies871@gmail.com
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M7 7h10v10"/></svg>
            </a>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="mx-auto max-w-4xl px-6 py-14 sm:px-8 sm:py-16">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">Good to know</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Delivery FAQs</h2>
        </div>
        <div className="mt-8 divide-y divide-gray-200 border-y border-gray-200">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-gray-900 marker:content-none">
                {faq.question}
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition group-open:rotate-45 group-open:border-blue-600 group-open:text-blue-700" aria-hidden="true">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M12 5v14M5 12h14"/></svg>
                </span>
              </summary>
              <p className="mt-3 pr-10 text-sm leading-7 text-gray-600">{faq.answer}</p>
            </details>
          ))}
        </div>
        <div className="mt-10 rounded-2xl bg-gray-950 p-6 text-white sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8">
          <div>
            <h2 className="text-xl font-bold">Ready to find your next tech upgrade?</h2>
            <p className="mt-2 text-sm leading-6 text-gray-300">Browse our products and have your order delivered across Kenya.</p>
          </div>
          <Link to="/shop" className="mt-5 inline-flex shrink-0 items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 sm:mt-0">Explore the shop</Link>
        </div>
      </section>
    </main>
  );
}

export default DeliveryInformation;
