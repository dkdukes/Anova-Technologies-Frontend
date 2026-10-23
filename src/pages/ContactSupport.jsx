import { useState } from "react";
import { Link } from "react-router-dom";

const SUPPORT_EMAIL = "anovatechnologies871@gmail.com";

const inquiryOptions = [
  "Order status",
  "Delivery issue",
  "Returns and refunds",
  "Payment issue",
  "Product question",
  "Warranty or faulty item",
  "Other inquiry",
];

function ContactSupport() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "",
    orderNumber: "",
    subject: "",
    message: "",
  });
  const [feedback, setFeedback] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (feedback) setFeedback("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();
    const subject = form.subject.trim();
    const message = form.message.trim();

    if (!name || !email || !form.category || !subject || !message) {
      setFeedback("Please complete all required fields before continuing.");
      return;
    }

    const emailSubject = `[Anova Support] ${subject}`;
    const emailBody = [
      `Name: ${name}`,
      `Customer email: ${email}`,
      `Inquiry category: ${form.category}`,
      `Order number: ${form.orderNumber.trim() || "Not provided"}`,
      "",
      "Message:",
      message,
    ].join("\n");

    const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    setFeedback(
      "Your email app should open with your message prepared. Please review it and press Send in your email app. Anova has not received your message until you send it."
    );
    window.location.href = mailtoUrl;
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-gray-950 to-gray-950" />
        <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-200">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            Anova Technologies customer care
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            How can we <span className="text-blue-400">help you?</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">
            Have a question about a product, order, delivery, or return? Send our team a message and include your order number if your inquiry is order-related.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-gray-300">
            <span className="rounded-full border border-gray-700 px-4 py-2">Orders & delivery</span>
            <span className="rounded-full border border-gray-700 px-4 py-2">Returns & refunds</span>
            <span className="rounded-full border border-gray-700 px-4 py-2">Product support</span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-10">
        <aside>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Contact Anova</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">We're here to help.</h2>
          <p className="mt-4 leading-7 text-gray-600">
            Choose the inquiry type that best fits your question and provide as much relevant detail as you can. This helps us understand what you need.
          </p>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
            </div>
            <h3 className="mt-4 font-semibold">Email support</h3>
            <p className="mt-1 text-sm leading-6 text-gray-600">For questions and support requests, contact us by email.</p>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="mt-3 inline-block break-all font-semibold text-blue-700 hover:text-blue-900">
              {SUPPORT_EMAIL}
            </a>
          </div>

          <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:p-6">
            <h3 className="font-semibold text-gray-900">Need help with an existing order?</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Add your order number to the form. Please do not include passwords, full payment-card details, or other sensitive account information.
            </p>
            <Link to="/shop" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900">
              Continue shopping <span aria-hidden="true">→</span>
            </Link>
          </div>
        </aside>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-7">
            <h2 className="text-2xl font-bold">Send us a message</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">Fields marked with * are required. Your email app will be used to send the message.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="support-name" className="mb-2 block text-sm font-medium text-gray-800">Full name <span className="text-blue-700">*</span></label>
                <input id="support-name" name="name" value={form.name} onChange={handleChange} autoComplete="name" required className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100" placeholder="Your full name" />
              </div>
              <div>
                <label htmlFor="support-email" className="mb-2 block text-sm font-medium text-gray-800">Email address <span className="text-blue-700">*</span></label>
                <input id="support-email" name="email" type="email" value={form.email} onChange={handleChange} autoComplete="email" required className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100" placeholder="you@example.com" />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="support-category" className="mb-2 block text-sm font-medium text-gray-800">Inquiry category <span className="text-blue-700">*</span></label>
                <select id="support-category" name="category" value={form.category} onChange={handleChange} required className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100">
                  <option value="">Select a category</option>
                  {inquiryOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="support-order" className="mb-2 block text-sm font-medium text-gray-800">Order number <span className="font-normal text-gray-400">(optional)</span></label>
                <input id="support-order" name="orderNumber" value={form.orderNumber} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100" placeholder="e.g. ANV-000123" />
              </div>
            </div>

            <div>
              <label htmlFor="support-subject" className="mb-2 block text-sm font-medium text-gray-800">Subject <span className="text-blue-700">*</span></label>
              <input id="support-subject" name="subject" value={form.subject} onChange={handleChange} required maxLength={120} className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100" placeholder="Briefly describe how we can help" />
            </div>

            <div>
              <label htmlFor="support-message" className="mb-2 block text-sm font-medium text-gray-800">Message <span className="text-blue-700">*</span></label>
              <textarea id="support-message" name="message" value={form.message} onChange={handleChange} required rows={6} maxLength={5000} className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100" placeholder="Tell us a little more about your question or issue..." />
              <p className="mt-1 text-right text-xs text-gray-400">{form.message.length}/5000 characters</p>
            </div>

            {feedback && (
              <div role="status" aria-live="polite" className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
                {feedback}
              </div>
            )}

            <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto">
              Prepare email <span aria-hidden="true">→</span>
            </button>
            <p className="text-xs leading-5 text-gray-500">Selecting “Prepare email” opens your default email app if one is configured. You must send the prepared email yourself; this form does not submit messages directly to Anova.</p>
          </form>
        </div>
      </section>
    </main>
  );
}

export default ContactSupport;
