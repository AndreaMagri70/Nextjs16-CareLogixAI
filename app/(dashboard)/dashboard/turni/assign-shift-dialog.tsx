"use client";

import { FormEvent, useState } from "react";
import { CalendarPlus, Loader2, X } from "lucide-react";
import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";

const fieldClassName =
  "h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition-colors focus:border-[#009689] focus:ring-2 focus:ring-[#009689]/20";

type AssignShiftDialogProps = {
  variant?: "default" | "secondary";
};

export function AssignShiftDialog({ variant = "default" }: AssignShiftDialogProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const options = useQuery(api.shifts.getShiftFormOptions);
  const createShift = useMutation(api.shifts.createShift);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setMessage("");
    setIsSaving(true);

    const formData = new FormData(form);
    const operatorId = String(formData.get("operatorId") ?? "");
    const patientId = String(formData.get("patientId") ?? "");
    const date = String(formData.get("date") ?? "");
    const time = String(formData.get("time") ?? "");
    const serviceType = String(formData.get("serviceType") ?? "");
    const rawTasks = String(formData.get("tasks") ?? "");
    const timestamp = new Date(`${date}T${time}`).getTime();

    if (!operatorId || !patientId || !date || !time || !serviceType) {
      setMessage("Compila tutti i campi obbligatori.");
      setIsSaving(false);
      return;
    }

    if (Number.isNaN(timestamp)) {
      setMessage("Data o ora non valida.");
      setIsSaving(false);
      return;
    }

    try {
      await createShift({
        operatorId: operatorId as Id<"users">,
        patientId: patientId as Id<"patients">,
        date: timestamp,
        serviceType,
        tasks: rawTasks
          .split("\n")
          .map((task) => task.trim())
          .filter(Boolean),
      });
      form.reset();
      setOpen(false);
    } catch {
      setMessage("Non sono riuscito ad aggiungere il turno. Riprova.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <Button type="button" variant={variant} onClick={() => setOpen(true)}>
        <CalendarPlus className="size-4" aria-hidden="true" />
        Assegna turno
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Assegna turno
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Aggiungi un nuovo servizio al database Convex.
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
                  Operatore
                  <select
                    name="operatorId"
                    required
                    className={fieldClassName}
                    disabled={!options || isSaving}
                  >
                    <option value="">Seleziona operatore</option>
                    {options?.operators.map((operator) => (
                      <option key={operator._id} value={operator._id}>
                        {operator.name} ({operator.status})
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Paziente
                  <select
                    name="patientId"
                    required
                    className={fieldClassName}
                    disabled={!options || isSaving}
                  >
                    <option value="">Seleziona paziente</option>
                    {options?.patients.map((patient) => (
                      <option key={patient._id} value={patient._id}>
                        {patient.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Data
                  <input
                    name="date"
                    type="date"
                    required
                    className={fieldClassName}
                    disabled={isSaving}
                  />
                </label>

                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Ora
                  <input
                    name="time"
                    type="time"
                    required
                    className={fieldClassName}
                    disabled={isSaving}
                  />
                </label>

                <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                  Servizio
                  <input
                    name="serviceType"
                    required
                    placeholder="Es. Igiene personale"
                    className={fieldClassName}
                    disabled={isSaving}
                  />
                </label>

                <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                  Compiti
                  <textarea
                    name="tasks"
                    rows={4}
                    placeholder="Un compito per riga"
                    className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition-colors focus:border-[#009689] focus:ring-2 focus:ring-[#009689]/20"
                    disabled={isSaving}
                  />
                </label>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p aria-live="polite" className="text-sm text-slate-600">
                  {message}
                </p>
                <Button type="submit" disabled={!options || isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                      Salvataggio...
                    </>
                  ) : (
                    "Aggiungi"
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
