import { Link } from "react-router-dom";

const SUPPORT_EMAIL = "anovatechnologies871@gmail.com";

const sections = [
  {
    id: "website-use",
    number: "01",
    title: "Using the website",
    paragraphs: [
      "These Terms & Conditions apply to your use of the Anova Technologies online store and to orders placed through it. By using the website, you agree to use it lawfully and not to interfere with its operation or attempt unauthorised access.",
      "If you create an account, you are responsible for providing accurate information and taking reasonable care of your login credentials. Contact us if you believe your account has been used without your permission.",
      "If you do not agree with these terms, please do not use the store. Nothing in these terms limits any rights that cannot lawfully be limited under applicable law.",
    ],
  },
  {
    id: "products-prices",
    number: "02",
    title: "Products, prices, and availability",
    paragraphs: [
      "We aim to present product descriptions, specifications, images, prices, and availability as accurately as possible. Product images and screen settings may cause minor visual differences, and specifications should be checked before placing an order where a detail is important to you.",
      "Products are subject to availability. Adding an item to a cart does not by itself guarantee that the item is reserved or that an order has been accepted.",
      "Prices and promotions may change. If we identify an apparent listing or pricing error, we will take reasonable steps to clarify it with you before proceeding. Where an order cannot be fulfilled as placed, we will contact you to discuss appropriate next steps, including cancellation and any refund due under applicable law.",
    ],
  },
  {
    id: "orders",
    number: "03",
    title: "Orders and order confirmation",
    paragraphs: [
      "When placing an order, please check the products, quantities, contact details, delivery address, and payment method before submitting it. We may contact you to clarify order information or delivery arrangements.",
      "An order acknowledgement or payment notification may confirm that we received your request or payment; it does not necessarily mean that every item is available or that dispatch has occurred. If we cannot fulfil an order, we will communicate the issue and handle any payment or refund in accordance with applicable law and the circumstances of the order.",
      "Please contact support promptly if you notice an error in your order details. Changes may not be possible once an order has been processed or dispatched.",
    ],
  },
  {
    id: "payments",
    number: "04",
    title: "Payments",
    paragraphs: [
      "The store may offer M-Pesa, card payment, and cash on delivery, depending on the options shown at checkout and their availability for the order. The payment method selected at checkout and any instructions shown there apply to that transaction.",
      "Electronic payments may be processed by third-party payment providers and may also be subject to their terms and security procedures. Do not send card security codes, passwords, PINs, or other payment credentials to Anova by email or through a support message.",
      "Anova does not promise that every payment method will be available for every product, order, or delivery location. If a payment fails or appears to have been charged incorrectly, contact support with your order details and do not include confidential payment credentials.",
    ],
  },
  {
    id: "delivery",
    number: "05",
    title: "Delivery",
    paragraphs: [
      "The store's stated delivery fees are KSh 300 for Nairobi County and KSh 500 for other counties in Kenya, subject to the delivery fee displayed or confirmed for your order at checkout. If the checkout amount differs from this general information, please contact us before completing the order.",
      "Current estimated delivery times are 1–2 business days within Nairobi County and 1–3 business days for other counties. These are estimates, not guaranteed delivery dates. Timing may be affected by order processing, stock availability, location, courier operations, weather, public holidays, or other circumstances outside our reasonable control.",
      "Please provide a complete delivery address and a reachable contact number. Someone may need to be available to receive the order. For full details, see our <deliveryLink>Delivery Information</deliveryLink> page.",
    ],
  },
  {
    id: "returns",
    number: "06",
    title: "Returns, refunds, and warranties",
    paragraphs: [
      "Return requests should be submitted within 7 days after receipt of the order. Change-of-mind requests are reviewed individually; approval is not automatic. Customers generally pay return delivery costs under the store's stated policy, subject to applicable law and the circumstances of the return.",
      "Where a refund is approved, we aim to return it through the original payment method where possible. The time required for a refund to appear may depend on the payment provider or financial institution, so we do not promise a fixed processing period in these terms.",
      "Product warranties, if any, depend on the applicable manufacturer or seller warranty terms. These terms do not remove statutory consumer rights or remedies that apply under Kenyan law. Read the full <returnsLink>Returns & Refunds</returnsLink> policy or contact support if you need help.",
    ],
  },
  {
    id: "accounts-content",
    number: "07",
    title: "Accounts and acceptable use",
    paragraphs: [
      "You must not use the store for unlawful activity, submit information you know to be misleading, attempt to disrupt the website, introduce malicious code, or access accounts or systems without permission.",
      "We may take reasonable steps to protect the store and customers where we suspect misuse, fraud, security risks, or a breach of these terms. Any account restriction or order action will be subject to applicable law and any rights you have under it.",
    ],
  },
  {
    id: "intellectual-property",
    number: "08",
    title: "Website content and intellectual property",
    paragraphs: [
      "Website text, layout, graphics, logos, and other content may be protected by intellectual property laws and belong to Anova Technologies or the relevant rights holders. Product names, brands, and logos remain the property of their respective owners.",
      "You may use the website for personal shopping and lawful informational purposes. You must not reproduce or commercially exploit website content in a way that infringes the rights of Anova Technologies or another rights holder without permission, except where applicable law allows it.",
    ],
  },
  {
    id: "liability",
    number: "09",
    title: "Liability and service availability",
    paragraphs: [
      "We aim to keep the store available and its information useful, but we do not guarantee uninterrupted or error-free operation. Website features may be updated, suspended, or changed for maintenance, security, or operational reasons.",
      "To the extent permitted by applicable law, Anova Technologies is not responsible for losses caused by circumstances beyond its reasonable control or by a customer's misuse of the website. Nothing in these terms excludes or limits liability, consumer rights, warranties, or remedies where doing so would be unlawful.",
    ],
  },
  {
    id: "privacy",
    number: "10",
    title: "Privacy and personal information",
    paragraphs: [
      "Personal information is handled as described in our <privacyLink>Privacy Policy</privacyLink>. By using the store, you should review that policy to understand the information that may be collected and how it may be used or shared in connection with accounts, orders, payments, delivery, support, and configured website tools.",
    ],
  },
  {
    id: "law-changes-contact",
    number: "11",
    title: "Applicable law, updates, and contact",
    paragraphs: [
      "These terms are intended to be read consistently with the laws of Kenya, including applicable consumer protection and data protection requirements. Any dispute is subject to applicable law and the jurisdiction of the appropriate courts or dispute-resolution bodies. This section does not remove rights or remedies available to consumers under mandatory law.",
      "We may update these terms when the store, its services, or applicable requirements change. The updated version will be published on this page with a revised effective date. Changes will not override rights that have already accrued or rights that cannot lawfully be varied.",
      "For questions about these terms, an order, delivery, or a return, email <supportEmail>anovatechnologies871@gmail.com</supportEmail>. You can also use our <contactLink>Contact Support</contactLink> page.",
    ],
  },
];

function renderParagraph(paragraph, index) {
  const parts = paragraph.split(/(<deliveryLink>.*?<\/deliveryLink>|<returnsLink>.*?<\/returnsLink>|<privacyLink>.*?<\/privacyLink>|<contactLink>.*?<\/contactLink>|<supportEmail>.*?<\/supportEmail>)/g);

  return (
    <p key={index} className="mt-3 text-sm leading-7 text-gray-600 sm:text-base">
      {parts.map((part, partIndex) => {
        if (part.startsWith("<deliveryLink>")) {
          return <Link key={partIndex} to="/delivery-information" className="font-semibold text-blue-700 underline decoration-blue-200 underline-offset-4 hover:text-blue-900">Delivery Information</Link>;
        }
        if (part.startsWith("<returnsLink>")) {
          return <Link key={partIndex} to="/returns-refunds" className="font-semibold text-blue-700 underline decoration-blue-200 underline-offset-4 hover:text-blue-900">Returns &amp; Refunds</Link>;
        }
        if (part.startsWith("<privacyLink>")) {
          return <Link key={partIndex} to="/privacy-policy" className="font-semibold text-blue-700 underline decoration-blue-200 underline-offset-4 hover:text-blue-900">Privacy Policy</Link>;
        }
        if (part.startsWith("<contactLink>")) {
          return <Link key={partIndex} to="/contact-support" className="font-semibold text-blue-700 underline decoration-blue-200 underline-offset-4 hover:text-blue-900">Contact Support</Link>;
        }
        if (part.startsWith("<supportEmail>")) {
          return <a key={partIndex} href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-blue-700 underline decoration-blue-200 underline-offset-4 hover:text-blue-900">{SUPPORT_EMAIL}</a>;
        }
        return part;
      })}
    </p>
  );
}

function TermsAndConditions() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-gray-950 to-gray-950" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-200">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v5h5M9 13h6M9 17h6" />
              </svg>
              Store terms and customer information
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">Terms &amp; Conditions</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">
              Please read these terms before using the Anova Technologies store or placing an order. They explain how shopping, payments, delivery, and returns work.
            </p>
            <p className="mt-5 text-sm text-gray-400">Effective date: 23 October 2026</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:px-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-10 lg:py-16">
        <aside className="h-fit rounded-2xl border border-gray-200 bg-gray-50 p-5 lg:sticky lg:top-28">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">On this page</h2>
          <nav aria-label="Terms and Conditions sections" className="mt-4 space-y-1">
            {sections.map((section) => (
              <a key={section.id} href={`#${section.id}`} className="flex gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition hover:bg-blue-50 hover:text-blue-800">
                <span className="font-semibold text-blue-700">{section.number}</span>
                <span>{section.title}</span>
              </a>
            ))}
          </nav>
        </aside>

        <div className="min-w-0">
          <div className="mb-8 rounded-2xl border border-blue-100 bg-blue-50/70 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-white">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M10.3 3.8 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3l-7.5-13.2a2 2 0 0 0-3.4 0Z" />
                </svg>
              </span>
              <div>
                <h2 className="font-semibold text-gray-900">Your statutory rights still apply</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">These terms are general store conditions. They do not replace applicable Kenyan consumer protection law, statutory rights, or valid product warranty terms. If a term conflicts with a right that cannot lawfully be limited, that right continues to apply.</p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white px-5 sm:px-8">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-28 py-7 sm:py-8">
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-800">{section.number}</span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">{section.title}</h2>
                    {section.paragraphs.map((paragraph, index) => renderParagraph(paragraph, index))}
                  </div>
                </div>
              </section>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-gray-950 p-6 text-white sm:p-8">
            <h2 className="text-xl font-bold">Need help with an order?</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-300">If you have questions about these terms, a payment, delivery, or a return, our support page is the best place to start.</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link to="/contact-support" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500">Contact Support <span aria-hidden="true" className="ml-2">→</span></Link>
              <a href={`mailto:${SUPPORT_EMAIL}`} className="inline-flex items-center justify-center rounded-lg border border-gray-700 px-5 py-3 text-sm font-semibold text-gray-100 transition hover:border-gray-500 hover:bg-gray-900">Email Anova</a>
            </div>
          </div>
          <p className="mt-6 text-xs leading-5 text-gray-500">This page is general information about store terms, not legal advice. Review it against your actual operations and obtain professional legal review before publication.</p>
        </div>
      </section>
    </main>
  );
}

export default TermsAndConditions;
