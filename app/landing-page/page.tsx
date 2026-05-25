import {
  Building2,
  Stethoscope,
  Home,
  Users,
  CalendarClock,
  ShieldCheck,
  Smartphone,
  Lock,
  Zap,
  AlertCircle,
} from "lucide-react";

import "./landing.css";

import Navbar from "./components/Navbar";
import WaitlistForm from "./components/WaitlistForm";
import ScrollAnimations from "./components/ScrollAnimations";
import ScrollToTop from "./components/ScrollToTop";

type Sector = "clinica" | "medico" | "rsa" | "agenzia";

const TARGET_DATA = [
  {
    id: "clinica" as Sector,
    icon: Building2,
    title: "Cliniche Private",
    emoji: "🏥",
    problem: "Coordinare medici, specialisti e segreteria senza sovrapposizioni",
    description:
      "Sincronizza le agende dei medici in tempo reale. Ottimizza l'occupazione delle sale e offri ai tuoi pazienti un'esperienza di prenotazione fluida, riducendo i tempi di attesa e i no-show.",
    iconClass: "lp-target-card__icon--clinica",
  },
  {
    id: "medico" as Sector,
    icon: Stethoscope,
    title: "Singoli Medici / Studi Associati",
    emoji: "🩺",
    problem: "Troppa burocrazia e cartelle cliniche disorganizzate",
    description:
      "Meno scartoffie, più tempo per i pazienti. Accedi alle cartelle cliniche digitali protette da qualsiasi dispositivo, compila i report clinici velocemente e gestisci i tuoi appuntamenti senza stress.",
    iconClass: "lp-target-card__icon--medico",
  },
  {
    id: "rsa" as Sector,
    icon: Home,
    title: "Case di Riposo / RSA",
    emoji: "🏡",
    problem: "Turni H24 complessi e passaggi di consegne critici",
    description:
      "Garantisci una continuità assistenziale impeccabile. Monitora i turni coperti H24, gestisci i piani terapeutici degli ospiti e organizza i passaggi di consegne tra il personale in modo digitale e sicuro.",
    iconClass: "lp-target-card__icon--rsa",
  },
  {
    id: "agenzia" as Sector,
    icon: Users,
    title: "Agenzie di Staffing",
    emoji: "🤝",
    problem: "Allocare il personale giusto nelle strutture giuste all'ultimo minuto",
    description:
      "Pianifica e assegna il personale in pochi clic. Verifica all'istante le disponibilità di infermieri e OSS, gestisci i contratti di somministrazione e rispondi alle richieste di emergenza in tempo reale.",
    iconClass: "lp-target-card__icon--agenzia",
  },
];

const FEATURES_DATA = [
  {
    icon: CalendarClock,
    title: "Calendario Intelligente",
    description:
      "Algoritmi che suggeriscono la copertura ottimale dei turni, evitando i conflitti di orario e riducendo gli straordinari dello staff.",
  },
  {
    icon: ShieldCheck,
    title: "Anagrafica GDPR-Compliant",
    description:
      "Dati sensibili criptati e accessi tracciati per essere sempre in regola con le severissime normative sulla privacy sanitaria.",
  },
  {
    icon: Smartphone,
    title: "Interfaccia Mobile per Operatori",
    description:
      "Infermieri e OSS possono vedere i loro turni direttamente dallo smartphone, segnalare la presenza o richiedere ferie in un tocco.",
  },
];

export default function LandingPage() {
  return (
    <div className="landing-root">
      <ScrollAnimations />

      <div className="lp-orb lp-orb--1" />
      <div className="lp-orb lp-orb--2" />
      <div className="lp-orb lp-orb--3" />

      <div className="lp-container">
        <Navbar />
      </div>

      <section className="lp-hero">
        <div className="lp-container">
          <div className="lp-hero__badge">
            <span className="lp-hero__badge-dot" />
            Accesso Anticipato Aperto
          </div>

          <h1 className="lp-hero__title">
            La gestione della tua struttura sanitaria,{" "}
            <span className="lp-hero__title-accent">
              semplificata dall&apos;Intelligenza Artificiale.
            </span>
          </h1>

          <p className="lp-hero__subtitle">
            CareLogixAI ottimizza la pianificazione dei turni, automatizza la
            gestione dei pazienti e riduce i costi operativi.
          </p>

          <WaitlistForm />

          <div className="lp-hero__trust">
            <div className="lp-hero__trust-item">
              <Lock size={16} className="lp-hero__trust-icon" />
              GDPR Compliant
            </div>

            <div className="lp-hero__trust-item">
              <ShieldCheck size={16} className="lp-hero__trust-icon" />
              Crittografia End-to-End
            </div>

            <div className="lp-hero__trust-item">
              <Zap size={16} className="lp-hero__trust-icon" />
              Setup iniziale veloce e assistenza dedicata
            </div>
          </div>
        </div>
      </section>

      <section className="lp-section" id="target">
        <div className="lp-container">
          <div className="lp-section__header lp-animate">
            <span className="lp-section__tag">Soluzioni</span>

            <h2 className="lp-section__title">
              Fatto su misura per il tuo settore
            </h2>

            <p className="lp-section__desc">
              Ogni realtà sanitaria ha esigenze specifiche.
            </p>
          </div>

          <div className="lp-targets">
            {TARGET_DATA.map((target, i) => (
              <div
                key={target.id}
                className="lp-target-card lp-animate"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className={`lp-target-card__icon ${target.iconClass}`}>
                  <target.icon size={28} />
                </div>

                <h3 className="lp-target-card__title">
                  {target.emoji} {target.title}
                </h3>

                <p className="lp-target-card__problem">
                  <AlertCircle size={14} />
                  {target.problem}
                </p>

                <p className="lp-target-card__desc">
                  {target.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section" id="features">
        <div className="lp-container">
          <div className="lp-section__header lp-animate">
            <span className="lp-section__tag">Funzionalità</span>

            <h2 className="lp-section__title">
              Tecnologia che lavora per te
            </h2>

            <p className="lp-section__desc">
              Risultati concreti che trasformano il tuo lavoro.
            </p>
          </div>

          <div className="lp-features">
            {FEATURES_DATA.map((feature, i) => (
              <div
                key={feature.title}
                className="lp-feature lp-animate"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="lp-feature__icon">
                  <feature.icon size={24} />
                </div>

                <div>
                  <h3 className="lp-feature__title">
                    {feature.title}
                  </h3>

                  <p className="lp-feature__desc">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-cta-section" id="cta">
        <div className="lp-container">
          <div className="lp-cta-box lp-animate">
            <h2 className="lp-cta-box__title">
              Pronto a trasformare la tua gestione sanitaria?
            </h2>

            <p className="lp-cta-box__desc">
              Unisciti alle strutture che hanno già richiesto l&apos;accesso.
            </p>

            <a href="#hero-form" className="lp-hero-form__btn">
              Richiedi l&apos;Accesso Ora →
            </a>
          </div>
        </div>
      </section>
      {/* Aggiungi il componente qui sotto */}
      <ScrollToTop />

      <footer className="lp-footer">
        <div className="lp-container">
          <p>
            © {new Date().getFullYear()} CareLogixAI
          </p>
        </div>
      </footer>
    </div>
  );
}
