import { Link } from "react-router-dom";

const SUPPORT_EMAIL = "anovatechnologies871@gmail.com";

const sections = [
  {
    number: "01",
    title: "Information we collect",
    paragraphs: [
      "When you create an account, place an order, contact support, or otherwise use the store, information you provide may include your name, email address, phone number, account details, delivery address, order details, and messages sent to us.",
      "Depending on the features enabled on the website, technical information such as browser or device details, pages visited, and cookie or similar identifiers may also be collected through website operations and configured analytics or advertising tools.",
      "Please provide information that is accurate and avoid sending sensitive personal information unless it is necessary for your request.",
    ],
  },
  {
    number: "02",
    title: "How we use information",
    paragraphs: [
      "Personal information may be used to create and manage customer accounts, process and fulfil orders, arrange delivery, confirm payments, respond to support requests, handle returns and refunds, maintain records, and communicate important information about transactions or the service.",
      "Where analytics or advertising tools are enabled, relevant information may be used to understand website usage, measure performance, or support advertising activities, subject to applicable law and any consent or choices required.",
    ],
  },
  {
    number: "03",
    title: "Payments and order information",
    paragraphs: [
      "The store offers M-Pesa, card payment, and cash on delivery as payment options, subject to availability at checkout. Electronic payments may be handled by the relevant payment provider and are also subject to that provider's terms and privacy information.",
      "The exact payment information handled or retained by Anova depends on the payment integration and checkout configuration in use. This policy does not promise that particular card details are never stored by the store; customers should not send card security codes or payment credentials to support by email.",
      "Order and payment records may be retained where needed to manage transactions, customer service, accounting, disputes, fraud prevention, or legal obligations.",
    ],
  },
  {
    number: "04",
    title: "When information may be shared",
    paragraphs: [
      "Information may be shared when necessary with service providers involved in operating the store, processing payments, hosting or maintaining the website, providing analytics or advertising services, or delivering orders. Only information relevant to the service should be shared for that purpose.",
      "Information may also be disclosed where required by law or a lawful request, or where reasonably necessary to establish, exercise, or defend legal claims. The particular providers and data flows depend on the services configured for the store.",
    ],
  },
  {
    number: "05",
    title: "Marketing messages",
    paragraphs: [
      "Anova promotional emails are intended for customers who have opted in to receive them. You can ask us to stop sending promotional emails by contacting the support address below or using an unsubscribe option where one is provided.",
      "Messages necessary to complete or manage an order, respond to a support request, or communicate an important service matter are different from promotional messages and may still be sent when relevant.",
    ],
  },
  {
    number: "06",
    title: "Cookies and analytics",
    paragraphs: [
      "Cookies and similar technologies may be used to support essential website functions, remember preferences, understand website use, or support advertising where relevant tools are enabled. The cookies and identifiers used depend on the website configuration and third-party tools active at the time.",
      "You can review cookie controls in your browser and may be able to block or delete cookies there. Blocking certain cookies may affect how parts of the store work. If a consent banner or preference tool is available, use it to manage the choices it offers.",
    ],
  },
  {
    number: "07",
    title: "Keeping and protecting information",
    paragraphs: [
      "Personal information should be kept only for as long as reasonably necessary for the purpose it was collected, including order administration, customer support, recordkeeping, dispute handling, and applicable legal requirements.",
      "Anova aims to handle personal information responsibly. No website or method of electronic storage or transmission can be represented as completely secure, and this policy does not guarantee that unauthorised access or loss can never occur.",
    ],
  },
  {
    number: "08",
    title: "Your privacy rights in Kenya",
    paragraphs: [
      "The handling of personal data is subject to applicable Kenyan law, including the Data Protection Act, 2019 and relevant regulations. Depending on the circumstances and applicable law, you may have rights to be informed about how your personal data is used, access personal data, object to certain processing, request correction of false or misleading data, and request deletion of false or misleading data.",
      "To make a privacy request, contact us at the email address below and describe your request. We may need to verify your identity and may need to retain or process some information where the law permits or requires it. This summary is general information, not legal advice, and does not replace the Act or other applicable law.",
    ],
  },
  {
    number: "09",
    title: "Third-party websites and services",
    paragraphs: [
      "The store may link to or use third-party payment, delivery, analytics, advertising, or other services. Those providers may process information under their own terms and privacy notices. Review their notices when using their services; Anova does not control every aspect of third-party practices.",
    ],
  },
  {
    number: "10",
    title: "Changes to this policy",
    paragraphs: [
      "This policy may be updated when the store, its features, or applicable requirements change. The updated version will be published on this page with a revised effective date. Review it periodically to understand the current information-handling practices described here.",
    ],
  },
];

function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-gray-950 to-gray-950" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-200">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 5 6v5c0 4.5 2.9 7.8 7 10 4.1-2.2 7-5.5 7-10V6l-7-3Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
              </svg>
              Your privacy matters
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">Privacy Policy</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">
              This page explains how Anova Technologies may collect, use, and share information when you use our online store, create an account, place an order, or contact us.
            </p>
            <p className="mt-4 text-sm text-gray-400">Effective date: 23 October 2026</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-14 lg:px-10 lg:py-16">
        <div className="min-w-0">
          <div className="mb-10 rounded-2xl border border-blue-100 bg-blue-50/70 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-950">A note about this policy</h2>
            <p className="mt-2 text-sm leading-6 text-gray-700">
              This policy describes the store's stated purposes and possible data flows. Some details, including the specific analytics providers, cookie controls, payment-provider data flows, and retention periods, depend on the tools and settings actually enabled. This page should be reviewed against the live website configuration before publication as a final legal policy.
            </p>
          </div>

          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.number} id={`privacy-section-${section.number}`} className="scroll-mt-24">
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-700">
                    {section.number}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-bold tracking-tight text-gray-950 sm:text-2xl">{section.title}</h2>
                    <div className="mt-3 space-y-4 text-sm leading-7 text-gray-600 sm:text-base">
                      {section.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-gray-950 p-6 text-white sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">Questions about your personal data?</h2>
                <p className="mt-2 text-sm leading-6 text-gray-300">Contact us to ask a privacy question or make a request concerning your personal information.</p>
                <a className="mt-4 inline-flex break-all font-semibold text-blue-300 underline decoration-blue-500/60 underline-offset-4 transition hover:text-white" href={`mailto:${SUPPORT_EMAIL}`}>
                  {SUPPORT_EMAIL}
                </a>
                <div className="mt-5">
                  <Link to="/contact-support" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-gray-950">
                    Contact Support
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" /></svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-gray-200 bg-gray-50 p-5 lg:sticky lg:top-24">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">On this page</h2>
          <nav className="mt-4 space-y-1">
            {sections.map((section) => (
              <a key={section.number} href={`#privacy-section-${section.number}`} className="block rounded-lg px-3 py-2 text-sm text-gray-600 transition hover:bg-white hover:text-blue-700">
                {section.title}
              </a>
            ))}
          </nav>
          <div className="mt-5 border-t border-gray-200 pt-4 text-xs leading-5 text-gray-500">
            This information is a general summary and is not a substitute for the applicable law or legal advice.
          </div>
        </aside>
      </section>
    </main>
  );
}

export default PrivacyPolicy;
