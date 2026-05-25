"use client";

import { Clock3, Route, UserCheck, Loader2 } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Badge } from "@/components/ui/badge";
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
import { AssignShiftDialog } from "./turni/assign-shift-dialog";

export default function DashboardPage() {
  const data = useQuery(api.dashboard.getDashboardData);

  // Stato di caricamento (Skeleton o Loader) in attesa dei dati real-time
  if (data === undefined) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="size-8 animate-spin text-teal-600" />
      </div>
    );
  }

  const summaryCards = [
    {
      label: "Turni Totali",
      value: data.stats.totalShifts.toString(),
      detail: `${data.stats.unassignedShifts} ancora da effettuare / in corso`,
      icon: Clock3,
    },
    {
      label: "Operatori attivi",
      value: data.stats.activeOperators.toString(),
      detail: "Disponibili per il lavoro",
      icon: UserCheck,
    },
    {
      label: "Visite in DB",
      value: data.shifts.length.toString(),
      detail: "Tutti i turni memorizzati",
      icon: Route,
    },
  ];

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal text-slate-950">
            Piano operativo
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Vista iniziale per coordinare operatori, pazienti e turni.
          </p>
        </div>
        <AssignShiftDialog />
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {summaryCards.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.label}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <CardDescription>{item.label}</CardDescription>
                  <CardTitle className="mt-2 text-3xl">{item.value}</CardTitle>
                </div>
                <div className="rounded-md bg-cyan-50 p-2 text-cyan-700">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500">{item.detail}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Turni in programma</CardTitle>
          <CardDescription>
            Lista dei turni estratti dal database in real-time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data e Ora</TableHead>
                <TableHead>Operatore</TableHead>
                <TableHead>Paziente</TableHead>
                <TableHead>Servizio</TableHead>
                <TableHead>Stato</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.shifts.map((shift) => {
                const shiftDate = new Date(shift.date);
                return (
                  <TableRow key={shift._id}>
                    <TableCell className="font-medium text-slate-950">
                      {shiftDate.toLocaleDateString("it-IT")} {shiftDate.toLocaleTimeString("it-IT", { hour: '2-digit', minute: '2-digit' })}
                    </TableCell>
                    <TableCell>{shift.operatorName}</TableCell>
                    <TableCell>{shift.patientName}</TableCell>
                    <TableCell>{shift.serviceType}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          shift.status === "completato"
                            ? "success"
                            : shift.status === "programmato"
                            ? "warning"
                            : shift.status === "in corso"
                              ? "default"
                              : "muted"
                        }
                      >
                        {shift.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
              
              {data.shifts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-500 py-4">
                    Nessun turno trovato nel database.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
