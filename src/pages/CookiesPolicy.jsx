import { Link } from "react-router-dom";

const sections = [
  { id: "what-are-cookies", title: "1. What are cookies?", body: "Cookies are small text files that a website may store in your browser. Similar technologies can help a website remember settings, maintain a session, understand site usage, or support advertising. The technologies actually used by Anova Technologies may change as the store develops." },
  { id: "types", title: "2. Types of cookies", body: "Strictly necessary cookies may be used where needed for core functions such as security, navigation, or keeping a shopping session working. Preference cookies can remember choices. Analytics cookies can help measure how a site is used, while advertising cookies can support advertising measurement or personalisation. This list describes common categories; it does not confirm that Anova currently uses every category or any particular third-party tool." },
  { id: "current-use", title: "3. What we currently know", body: "Analytics and advertising integrations have not been confirmed for this website. This policy does not claim that a named analytics, advertising, or tracking provider is installed. If such tools are added, this policy and the consent experience should be updated to describe them accurately before they are used." },
  { id: "preferences", title: "4. Managing your preferences", body: "The Anova cookie banner lets you choose to accept or reject non-essential cookies at the preference-interface level. Your selection is saved in this browser so the banner can remember your choice. You can also use your browser settings to view, block, or delete cookies. Blocking cookies may affect some website features." },
  { id: "important-limit", title: "5. Important limitation of the current banner", body: "The current banner is a frontend preference interface only. Saving a choice does not, by itself, block or control cookies, pixels, scripts, or requests from analytics or advertising tools. Any future tracking integrations must be connected to the consent preference so non-essential tools do not run before the appropriate choice, where required. No such blocking integration is claimed by this page." },
  { id: "personal-data", title: "6. Cookies and personal information", body: "Some cookie or similar technology data may be treated as personal data depending on what it contains and how it can be linked to a person. Please also read our Privacy Policy for information about personal information handled through the store. Only collect or share information in ways that are lawful, necessary, and explained to customers." },
  { id: "kenya-law", title: "7. Kenyan privacy considerations", body: "Anova Technologies aims to handle personal information in accordance with applicable Kenyan law, including the Data Protection Act, 2019 and applicable regulations. Depending on the circumstances, individuals may have rights concerning their personal data and may contact Anova to make a privacy request. The appropriate legal basis, notice, consent, and any applicable regulatory requirements depend on the actual technologies and processing in use. This page is general information, not legal advice." },
  { id: "changes", title: "8. Changes to this policy", body: "We may update this policy when our website, technology, or legal obligations change. The updated version will be published on this page with a revised effective date." },
];

export default function CookiesPolicy() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="bg-gray-950 text-white">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Anova Technologies</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Cookies Policy</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">Learn how cookies and similar technologies may support your shopping experience and how to manage your preferences.</p>
          <p className="mt-4 text-sm text-gray-400">Effective date: 23 October 2026</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-14 lg:px-10 lg:py-14">
        <aside className="h-fit rounded-2xl border border-gray-200 bg-gray-50 p-5 lg:sticky lg:top-24">
          <h2 className="font-semibold text-gray-950">On this page</h2>
          <nav className="mt-4 space-y-3 text-sm">
            {sections.map((section) => <a key={section.id} href={`#${section.id}`} className="block leading-5 text-gray-600 transition hover:text-blue-700">{section.title}</a>)}
          </nav>
          <div className="mt-6 border-t border-gray-200 pt-5">
            <p className="text-sm leading-6 text-gray-600">Questions about privacy or cookies?</p>
            <a className="mt-2 inline-block break-all text-sm font-semibold text-blue-700 hover:text-blue-800" href="mailto:anovatechnologies871@gmail.com">anovatechnologies871@gmail.com</a>
          </div>
        </aside>

        <article className="min-w-0 space-y-9">
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-950">A note about cookie controls</h2>
            <p className="mt-2 text-sm leading-6 text-gray-700">The cookie banner is currently a preference interface. Actual blocking of non-essential tracking requires any tracking scripts or services to be integrated with these preferences. We have not confirmed specific tracking tools are installed.</p>
          </div>
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-28">
              <h2 className="text-xl font-bold tracking-tight text-gray-950 sm:text-2xl">{section.title}</h2>
              <p className="mt-3 leading-7 text-gray-600">{section.body}</p>
              {section.id === "personal-data" && <p className="mt-3 leading-7 text-gray-600">Related pages: <Link className="font-medium text-blue-700 hover:underline" to="/privacy-policy">Privacy Policy</Link> and <Link className="font-medium text-blue-700 hover:underline" to="/contact-support">Contact Support</Link>.</p>}
            </section>
          ))}
          <div className="border-t border-gray-200 pt-6 text-sm leading-6 text-gray-500">For privacy questions, contact <a className="font-medium text-blue-700 hover:underline" href="mailto:anovatechnologies871@gmail.com">anovatechnologies871@gmail.com</a>. This policy should be reviewed whenever the website adds or changes cookie-based technologies.</div>
        </article>
      </div>
    </main>
  );
}
