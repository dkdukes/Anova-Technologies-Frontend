import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "anova-cookie-preference";

/**
 * Frontend preference interface only. This component saves the user's choice,
 * but does not block cookies or third-party scripts. Integrate any actual
 * analytics/advertising scripts with this preference before enabling them.
 */
export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [savedChoice, setSavedChoice] = useState(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedChoice(JSON.parse(stored));
      } else {
        setVisible(true);
      }
    } catch {
      // If storage is unavailable, show the controls for this visit.
      setVisible(true);
    }
  }, []);

  const saveChoice = (choice) => {
    const preference = {
      choice,
      necessary: true,
      nonEssential: choice === "accepted",
      updatedAt: new Date().toISOString(),
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preference));
    } catch {
      // The choice still closes the banner for this page session.
    }

    setSavedChoice(preference);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      role="dialog"
      aria-label="Cookie preferences"
      aria-describedby="anova-cookie-description"
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-gray-200 bg-white shadow-[0_-12px_40px_rgba(0,0,0,0.12)]"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-5 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
        <div className="max-w-3xl">
          <p className="font-semibold text-gray-950">Your cookie preferences</p>
          <p id="anova-cookie-description" className="mt-1 text-sm leading-6 text-gray-600">
            Anova may use cookies to support website functionality. Analytics and advertising tools have not been confirmed. Choose whether to accept or reject non-essential cookies. This frontend preference does not itself block tracking scripts.
            {" "}<Link to="/cookies-policy" className="font-medium text-blue-700 underline underline-offset-2 hover:text-blue-800">Read our Cookies Policy</Link>.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <button type="button" onClick={() => saveChoice("rejected")} className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
            Reject non-essential
          </button>
          <button type="button" onClick={() => saveChoice("accepted")} className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
            Accept all cookies
          </button>
        </div>
      </div>
      {savedChoice && <span className="sr-only" aria-live="polite">Cookie preference saved.</span>}
    </aside>
  );
}
