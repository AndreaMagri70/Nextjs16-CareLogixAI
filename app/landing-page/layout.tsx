import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CareLogixAI – Gestione Sanitaria con Intelligenza Artificiale",
  description:
    "Ottimizza la pianificazione dei turni, automatizza la gestione dei pazienti e riduci i costi operativi. Richiedi l'accesso anticipato alla piattaforma sanitaria AI più avanzata.",
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
