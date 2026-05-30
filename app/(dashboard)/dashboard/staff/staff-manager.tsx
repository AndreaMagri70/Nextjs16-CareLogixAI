"use client";

import { FormEvent, useState } from "react";
import { UserPlus, Loader2, X } from "lucide-react";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function formatShift(date: number | null, service: string | null) {
  if (!date) return "Nessun turno";
  const formatted = new Intl.DateTimeFormat("it-IT", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
  return service ? `${formatted} — ${service}` : formatted;
}

const fieldClassName =
  "h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition-colors focus:border-[#009689] focus:ring-2 focus:ring-[#009689]/20";

const statusVariantMap: Record<string, "success" | "warning" | "muted"> = {
  attivo: "success",
  ferie: "warning",
  inattivo: "muted",
};

const statusLabelMap: Record<string, string> = {
  attivo: "Attivo",
  ferie: "In ferie",
  inattivo: "Inattivo",
};

const validEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getStatusVariant(status: string) {
  return statusVariantMap[status] ?? "muted";
}

function getStatusLabel(status: string) {
  return statusLabelMap[status] ?? status;
}

export function StaffManager() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const staff = useQuery(api.users.listStaff);
  const createUserWithClerk = useAction(api.users.createUserWithClerk);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setMessage("");
    setIsSaving(true);

    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const role = String(formData.get("role") ?? "operator") as "admin" | "operator";
    const status = String(formData.get("status") ?? "attivo") as "attivo" | "ferie" | "inattivo";

    if (!name || !email) {
      setMessage("Compila nome e email.");
      setIsSaving(false);
      return;
    }

    if (!validEmailPattern.test(email)) {
      setMessage("Inserisci un indirizzo email valido.");
      setIsSaving(false);
      return;
    }

    try {
      await createUserWithClerk({ name, email, role, status });
      form.reset();
      setOpen(false);
    } catch {
      setMessage("Non sono riuscito ad aggiungere l'operatore. Riprovare.");
    } finally {
      setIsSaving(false);
    }
  }

  if (staff === undefined) {
    return (
      <div className="grid gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-normal text-slate-950">
              Staff operativo
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Stato degli operatori disponibili per la pianificazione dei turni.
            </p>
          </div>
          <Button variant="secondary" disabled>
            <UserPlus className="size-4" aria-hidden="true" />
            Nuovo operatore
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Operatori</CardTitle>
            <CardDescription>
              Caricamento in corso dei dati dello staff operativo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-slate-600">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Caricamento staff operativo...</span>
            </div>
            <div className="mt-4 space-y-3">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="h-16 rounded-xl bg-slate-100 p-4 shadow-inner animate-pulse"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal text-slate-950">
            Staff operativo
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Stato degli operatori disponibili per la pianificazione dei turni.
          </p>
        </div>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          <UserPlus className="size-4" aria-hidden="true" />
          Nuovo operatore
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Operatori</CardTitle>
          <CardDescription>
            Dati reali dello staff operativo estratti dal database Convex.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Ruolo</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Prossimo turno</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((operator: any) => (
                <TableRow key={operator._id}>
                  <TableCell className="font-medium text-slate-950">
                    {operator.name}
                  </TableCell>
                  <TableCell>{operator.role}</TableCell>
                  <TableCell>{operator.email}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(operator.status)}>
                      {getStatusLabel(operator.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatShift(operator.nextShiftDate, operator.nextShiftService)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Nuovo operatore
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Aggiungi un nuovo operatore al database Convex.
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
                  Nome completo
                  <input
                    name="name"
                    required
                    className={fieldClassName}
                    disabled={isSaving}
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Email
                  <input
                    name="email"
                    type="email"
                    required
                    className={fieldClassName}
                    disabled={isSaving}
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Ruolo
                  <select
                    name="role"
                    defaultValue="operator"
                    className={fieldClassName}
                    disabled={isSaving}
                  >
                    <option value="operator">Operatore</option>
                    <option value="admin">Admin</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                  Stato
                  <select
                    name="status"
                    defaultValue="attivo"
                    className={fieldClassName}
                    disabled={isSaving}
                  >
                    <option value="attivo">Attivo</option>
                    <option value="ferie">In ferie</option>
                    <option value="inattivo">Inattivo</option>
                  </select>
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
                    "Salva operatore"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
