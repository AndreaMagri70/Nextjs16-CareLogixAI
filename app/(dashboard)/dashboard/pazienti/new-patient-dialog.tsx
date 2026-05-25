"use client";

import { FormEvent, useState } from "react";
import { FilePlus2, Loader2, X } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Button } from "@/components/ui/button";

const fieldClassName =
  "h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition-colors focus:border-[#009689] focus:ring-2 focus:ring-[#009689]/20";

export function NewPatientDialog() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const createPatient = useMutation(api.patients.createPatient);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setMessage("");
    setIsSaving(true);

    const formData = new FormData(form);
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const address = String(formData.get("address") ?? "").trim();
    const pathologies = String(formData.get("pathologies") ?? "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
    const emergencyNotes = String(formData.get("emergencyNotes") ?? "").trim();

    if (!firstName || !lastName || !address) {
      setMessage("Compila nome, cognome e indirizzo.");
      setIsSaving(false);
      return;
    }

    try {
      await createPatient({
        firstName,
        lastName,
        address,
        pathologies,
        emergencyNotes: emergencyNotes || undefined,
      });
      form.reset();
      setOpen(false);
    } catch {
      setMessage("Non sono riuscito ad aggiungere il paziente. Riprovare.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
        <FilePlus2 className="size-4" aria-hidden="true" />
        Nuovo paziente
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Nuovo paziente
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Aggiungi un nuovo paziente al database Convex.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Chiudi popup"
                onClick={() => setOpen(false)}
              >
                <X className="size-4" aria-hidden="true" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5 p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Nome
                  <input
                    name="firstName"
                    required
                    className={fieldClassName}
                    disabled={isSaving}
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Cognome
                  <input
                    name="lastName"
                    required
                    className={fieldClassName}
                    disabled={isSaving}
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                  Indirizzo
                  <input
                    name="address"
                    required
                    className={fieldClassName}
                    disabled={isSaving}
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                  Patologie
                  <textarea
                    name="pathologies"
                    rows={4}
                    placeholder="Una patologia per riga"
                    className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition-colors focus:border-[#009689] focus:ring-2 focus:ring-[#009689]/20"
                    disabled={isSaving}
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                  Note emergenza
                  <textarea
                    name="emergencyNotes"
                    rows={3}
                    placeholder="Note utili per l'intervento"
                    className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition-colors focus:border-[#009689] focus:ring-2 focus:ring-[#009689]/20"
                    disabled={isSaving}
                  />
                </label>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p aria-live="polite" className="text-sm text-slate-600">
                  {message}
                </p>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                      Salvataggio...
                    </>
                  ) : (
                    "Salva paziente"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
