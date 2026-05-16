/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ShareCardPage from "./pages/ShareCardPage";
import ExplainerPage from "./pages/ExplainerPage";
import LibraryPage from "./pages/LibraryPage";
import AboutPage from "./pages/AboutPage";
import { cn } from "./lib/utils";
import { CountdownBlock } from "./components/CountdownBlock";

function Nav() {
  const location = useLocation();
  const links = [
    { name: "the fork explainer", path: "/explainer" },
    { name: "trade library", path: "/library" },
    { name: "about", path: "/about" },
  ];

  return (
    <header className="flex justify-between items-center px-6 md:px-12 py-8 z-10 w-full mx-auto">
      <div className="flex items-baseline gap-8">
        <Link to="/" className="text-[24px] font-bold tracking-tighter text-brand-primary">toccata.</Link>
        <div className="hidden md:flex gap-6">
          {links.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className={cn(
                "text-[11px] uppercase tracking-widest transition-colors",
                location.pathname === l.path ? "text-brand-primary" : "text-brand-text/40 hover:text-brand-primary"
              )}
            >
              {l.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-6">
        <CountdownBlock />
      </div>
    </header>
  );
}

function GlobalBackground() {
  return (
    <>
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0" style={{ backgroundImage: "radial-gradient(var(--color-brand-primary) 0.5px, transparent 0.5px)", backgroundSize: "24px 24px" }} />
      <div className="absolute top-[0%] left-[50%] -translate-x-[50%] w-[600px] h-[400px] bg-brand-primary opacity-10 blur-[120px] rounded-full pointer-events-none z-0" />
    </>
  );
}

function Footer() {
  return (
    <footer className="px-6 md:px-12 py-6 border-t border-brand-primary/10 flex justify-between items-center bg-brand-bg z-10 w-full mt-auto">
      <div className="flex flex-wrap gap-4 md:gap-8">
        <Link to="/explainer" className="text-[11px] uppercase tracking-widest text-brand-text/40 hover:text-brand-primary transition-colors">the fork explainer</Link>
        <Link to="/library" className="text-[11px] uppercase tracking-widest text-brand-text/40 hover:text-brand-primary transition-colors">trade library</Link>
        <Link to="/about" className="text-[11px] uppercase tracking-widest text-brand-text/40 hover:text-brand-primary transition-colors">about</Link>
      </div>
      <div className="hidden sm:flex items-center gap-4">
        <span className="text-[11px] text-brand-text/30">share this metaphor</span>
        <button className="w-10 h-10 rounded-full border border-brand-primary/40 flex items-center justify-center hover:bg-brand-primary/10 transition-colors">
          <svg className="w-4 h-4 fill-brand-primary" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
        </button>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col relative selection:bg-brand-primary/30">
        <GlobalBackground />
        <Nav />
        <main className="flex-1 flex flex-col z-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/share/:slug" element={<ShareCardPage />} />
            <Route path="/explainer" element={<ExplainerPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
