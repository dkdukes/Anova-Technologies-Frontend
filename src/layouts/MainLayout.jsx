import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CookieConsentBanner from "../components/CookieConsentBanner";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Cookie Consent Banner */}
      <CookieConsentBanner />

    </div>
  );
}