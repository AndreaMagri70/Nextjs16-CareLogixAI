"use client";

import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import {
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type Sector = "clinica" | "medico" | "rsa" | "agenzia";

const validEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormState {
  email: string;
  companyName: string;
  sector: Sector | "";
}

export default function WaitlistForm() {
  const joinWaitlist = useMutation(api.waitlist.joinWaitlist);

  const [form, setForm] = useState<FormState>({
    email: "",
    companyName: "",
    sector: "",
  });

  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const email = form.email.trim();
      const companyName = form.companyName.trim();

      if (!email || !form.sector) {
        setStatus({
          type: "error",
          message: "Inserisci email e seleziona il tuo settore.",
        });

        return;
      }

      if (!validEmailPattern.test(email)) {
        setStatus({
          type: "error",
          message: "Inserisci un indirizzo email valido.",
        });

        return;
      }

      setLoading(true);
      setStatus({ type: null, message: "" });

      try {
        const result = await joinWaitlist({
          email,
          companyName: companyName || undefined,
          sector: form.sector as Sector,
        });

        if (result.success) {
          setStatus({
            type: "success",
            message: result.message,
          });

          setForm({
            email: "",
            companyName: "",
            sector: "",
          });
        } else {
          setStatus({
            type: "error",
            message: result.message,
          });
        }
      } catch {
        setStatus({
          type: "error",
          message: "Errore di connessione. Riprova tra qualche istante.",
        });
      } finally {
        setLoading(false);
      }
    },
    [form, joinWaitlist]
  );

  return (
    <div className="lp-hero-form-wrapper">
      <span className="lp-hero-form-wrapper__label">
        🚀 Entra nella Waitlist
      </span>

      <form
        id="hero-form"
        className="lp-hero-form"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="lp-hero-form__row">
          <input
            id="waitlist-email"
            type="email"
            className="lp-hero-form__input"
            placeholder="La tua email professionale"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
            required
          />

          <select
            id="waitlist-sector"
            className="lp-hero-form__select"
            value={form.sector}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                sector: e.target.value as Sector | "",
              }))
            }
            required
          >
            <option value="" disabled>
              Il tuo settore
            </option>

            <option value="clinica">
              🏥 Clinica Privata
            </option>

            <option value="medico">
              🩺 Medico / Studio
            </option>

            <option value="rsa">
              🏡 RSA / Casa di Riposo
            </option>

            <option value="agenzia">
              🤝 Agenzia Staffing
            </option>
          </select>
        </div>

        <div className="lp-hero-form__row">
          <input
            id="waitlist-company"
            type="text"
            className="lp-hero-form__input"
            placeholder="Nome struttura / azienda (opzionale)"
            value={form.companyName}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                companyName: e.target.value,
              }))
            }
          />

          <button
            id="waitlist-submit"
            type="submit"
            className={`lp-hero-form__btn ${
              loading ? "lp-hero-form__btn--loading" : ""
            }`}
            disabled={loading}
          >
            Richiedi l&apos;Accesso Anticipato →
          </button>
        </div>

        {status.type && (
          <div
            className={`lp-hero-form__msg lp-hero-form__msg--${status.type}`}
            role="alert"
          >
            {status.type === "success" ? (
              <CheckCircle2
                size={16}
                style={{
                  display: "inline",
                  verticalAlign: "middle",
                  marginRight: 6,
                }}
              />
            ) : (
              <AlertCircle
                size={16}
                style={{
                  display: "inline",
                  verticalAlign: "middle",
                  marginRight: 6,
                }}
              />
            )}

            {status.message}
          </div>
        )}
      </form>
    </div>
  );
}
