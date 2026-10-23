import { Link } from "react-router-dom";

const returnSteps = [
  {
    number: "01",
    title: "Contact our support team",
    description:
      "Email us within 7 days of receiving your order. Include your order number and the reason you are requesting a return.",
  },
  {
    number: "02",
    title: "Share the product details",
    description:
      "Describe the issue and, where helpful, include clear photos of any damage, fault, or incorrect item received.",
  },
  {
    number: "03",
    title: "Wait for return instructions",
    description:
      "Our team will review your request and explain the next steps. Please wait for instructions before sending an item back.",
  },
  {
    number: "04",
    title: "Product review and outcome",
    description:
      "If a return is approved, we will advise you how to proceed. Any refund will be reviewed and handled in line with the agreed outcome, applicable warranty terms, and statutory consumer rights.",
  },
];

const faqs = [
  {
    question: "How long do I have to request a return?",
    answer:
      "Please contact Anova Technologies within 7 days of receiving your order. This request window does not remove or limit any statutory consumer rights or applicable warranty protections.",
  },
  {
    question: "Can I return an item because I changed my mind?",
    answer:
      "Change-of-mind requests are reviewed individually. Contact our support team with your order number and product details so we can assess your request.",
  },
  {
    question: "Who pays for return delivery?",
    answer:
      "Under our standard policy, the customer pays return delivery costs. This policy is subject to applicable statutory consumer rights and any relevant warranty obligations.",
  },
  {
    question: "How will I receive my refund?",
    answer:
      "Where a refund is approved, we aim to return the funds through the original payment method where possible. The available method may depend on the payment used and the circumstances of the order.",
  },
  {
    question: "When will my refund arrive?",
    answer:
      "We do not promise a fixed processing time. Once your request has been reviewed, our team will explain the next steps and any relevant information about the refund method.",
  },
  {
    question: "What if my product is faulty or arrives damaged?",
    answer:
      "Contact us as soon as possible with your order number and a description of the problem. Keep the product, packaging, and included accessories while we review your request and any applicable warranty terms.",
  },
];

function Icon({ name, className = "h-6 w-6" }) {
  const common = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };

  if (name === "package") {
    return (
      <svg {...common}>
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
        <path d="m4.3 7.7 7.7 4.4 7.7-4.4M12 21v-8.9M8 5.3l8 4.6" />
      </svg>
    );
  }
  if (name === "mail") {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  }
  if (name === "wallet") {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="15" rx="2" />
        <path d="M3 9h18M16 14h2" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9a2.5 2.5 0 1 1 4.4 1.6c-1.1 1-2 1.3-2 3M12 17h.01" />
    </svg>
  );
}

function ReturnsRefunds() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-200">
              <Icon name="package" className="h-4 w-4" />
              Customer care at Anova Technologies
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Returns <span className="text-blue-400">&amp; Refunds</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
              We want you to feel confident shopping with us. Read how to request a return, what happens next, and how approved refunds are handled.
            </p>
            <p className="mt-5 text-sm leading-6 text-gray-400">
              Return requests should be submitted within 7 days of receiving your order. Statutory consumer rights and applicable warranty terms still apply.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="mailto:anovatechnologies871@gmail.com"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-gray-950"
              >
                <Icon name="mail" className="h-5 w-5" />
                Contact support
              </a>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center rounded-lg border border-gray-600 px-5 py-3 font-semibold text-white transition hover:border-gray-400 hover:bg-white/5"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key policy points */}
      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Icon name="package" />
            </div>
            <h2 className="mt-5 text-lg font-semibold">7-day request window</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Contact us within 7 days after receiving your order to request a return review.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Icon name="wallet" />
            </div>
            <h2 className="mt-5 text-lg font-semibold">Refunds to original payment</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Approved refunds are returned through the original payment method where possible.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Icon name="help" />
            </div>
            <h2 className="mt-5 text-lg font-semibold">Requests reviewed individually</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Change-of-mind requests are assessed individually. Contact support before returning an item.
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-10 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">The process</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
              How to request a return
            </h2>
            <p className="mt-4 leading-7 text-gray-600">
              Follow these steps so our team can identify your order and review your request.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {returnSteps.map((step) => (
              <article key={step.number} className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-6 sm:p-7">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-950">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{step.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Return guidance */}
      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-14 sm:px-8 lg:grid-cols-2 lg:px-10 lg:py-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">Before sending an item</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950">Help us review your request</h2>
          <ul className="mt-6 space-y-4 text-sm leading-6 text-gray-600">
            <li className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" /><span>Have your order number and the email or phone number used when ordering ready.</span></li>
            <li className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" /><span>Explain whether the item is faulty, damaged, incorrect, or being returned for another reason.</span></li>
            <li className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" /><span>Keep the product, packaging, accessories, and any documents supplied with it while your request is reviewed.</span></li>
            <li className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" /><span>Wait for return instructions from our team before dispatching the item back.</span></li>
          </ul>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-7 sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm">
            <Icon name="mail" />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-gray-950">Need help with a return?</h2>
          <p className="mt-3 text-sm leading-6 text-gray-700">
            Email our support team with your order number, a brief explanation, and any useful photos. We will review your request and get back to you with the next steps.
          </p>
          <a
            href="mailto:anovatechnologies871@gmail.com"
            className="mt-5 inline-flex break-all font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4 hover:text-blue-900"
          >
            anovatechnologies871@gmail.com
          </a>
          <p className="mt-4 text-xs leading-5 text-gray-600">
            Return delivery costs are normally paid by the customer under this policy, subject to statutory consumer rights and applicable warranty obligations.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-14 sm:px-8 lg:py-20">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">Need clarification?</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">Returns &amp; refunds FAQs</h2>
          </div>
          <div className="mt-10 divide-y divide-gray-200 border-y border-gray-200">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-gray-900 marker:hidden">
                  <span>{faq.question}</span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition group-open:rotate-45 group-open:border-blue-600 group-open:text-blue-700" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 pr-10 text-sm leading-6 text-gray-600">{faq.answer}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 rounded-xl bg-gray-50 p-4 text-xs leading-5 text-gray-600">
            This page describes Anova Technologies' general returns and refunds process. It does not limit statutory consumer rights or applicable product warranty terms. Where a legal right or warranty obligation applies, it takes precedence over any inconsistent part of this general policy.
          </p>
        </div>
      </section>
    </main>
  );
}

export default ReturnsRefunds;
