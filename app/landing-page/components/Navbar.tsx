"use client";

import { useState } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });

    setMobileMenuOpen(false);
  };

  return (
    <nav
      className="lp-nav"
      role="navigation"
      aria-label="Navigazione principale"
    >
      <a
        href="/landing-page"
        className="lp-nav__logo"
        aria-label="CareLogixAI Home"
      >
        <span className="lp-nav__logo-icon">⚕️</span>
        <span>CareLogixAI</span>
      </a>

      <ul
        className={`lp-nav__links ${
          mobileMenuOpen ? "lp-nav__links--open" : ""
        }`}
      >
        <li>
          <button
            className="lp-nav__link"
            onClick={() => scrollToSection("target")}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            Soluzioni
          </button>
        </li>

        <li>
          <button
            className="lp-nav__link"
            onClick={() => scrollToSection("features")}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            Funzionalità
          </button>
        </li>

        <li>
          <button
            className="lp-nav__cta"
            onClick={() => scrollToSection("hero-form")}
          >
            Accesso Anticipato
          </button>
        </li>
      </ul>

      <button
        className="lp-nav__hamburger"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Menu"
      >
        <span />
        <span />
        <span />
      </button>
    </nav>
  );
}
