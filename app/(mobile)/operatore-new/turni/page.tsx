import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { ArrowRight, Clock3, MapPin } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function getNextSixDaysRange() {
  const rangeStart = new Date();
  rangeStart.setHours(0, 0, 0, 0);

  const rangeEnd = new Date(rangeStart);
  rangeEnd.setDate(rangeEnd.getDate() + 6);

  return {
    rangeStart: rangeStart.getTime(),
    rangeEnd: rangeEnd.getTime(),
  };
}

function formatVisitDateTime(date: number) {
  return new Date(date).toLocaleString("it-IT", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusLabel(status: string) {
  if (status === "in corso") {
    return "In corso";
  }

  if (status === "completato") {
    return "Completata";
  }

  if (status === "cancellato") {
    return "Cancellata";
  }

  return "Pianificata";
}

export default async function OperatorShiftsPage() {
  const { getToken, redirectToSignIn, userId } = await auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const token = await getToken({ template: "convex" });

  if (!token) {
    return redirectToSignIn();
  }

  const data = await fetchQuery(
    api.shifts.getOperatorShiftsInRange,
    getNextSixDaysRange(),
    { token }
  );

  if (!data) {
    return (
      <div className="grid gap-5">
        <section className="grid gap-2">
          <p className="text-sm text-slate-500">Agenda personale</p>
          <h1 className="text-2xl font-semibold tracking-normal">
            Profilo non trovato
          </h1>
        </section>
        <Card>
          <CardContent className="p-4 text-sm text-slate-600">
            Non risulta un profilo operatore collegato a questo account.
          </CardContent>
        </Card>
      </div>
    );
  }

  const visits = data.visits;
  const plannedVisits = visits.filter((visit) => visit.status === "programmato");
  const completedVisits = visits.filter((visit) => visit.status === "completato");

  return (
    <div className="grid gap-5">
      <section className="grid gap-2">
        <p className="text-sm text-slate-500">Agenda personale</p>
        <h1 className="text-2xl font-semibold tracking-normal">
          Turni assegnati nei prossimi 6 giorni
        </h1>
      </section>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-md bg-white p-3 text-center shadow-sm">
          <p className="text-xl font-semibold">{visits.length}</p>
          <p className="text-xs text-slate-500">Totali</p>
        </div>
        <div className="rounded-md bg-white p-3 text-center shadow-sm">
          <p className="text-xl font-semibold">{plannedVisits.length}</p>
          <p className="text-xs text-slate-500">Pianificati</p>
        </div>
        <div className="rounded-md bg-white p-3 text-center shadow-sm">
          <p className="text-xl font-semibold">{completedVisits.length}</p>
          <p className="text-xs text-slate-500">Completati</p>
        </div>
      </div>

      <section className="grid gap-3">
        {visits.length === 0 ? (
          <Card>
            <CardContent className="p-4 text-sm text-slate-600">
              Non hai turni assegnati nei prossimi 6 giorni.
            </CardContent>
          </Card>
        ) : null}

        {visits.map((visit) => (
          <Card key={visit.id}>
            <CardContent className="grid gap-4 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-950">
                    {visit.patient}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{visit.service}</p>
                </div>
                <Badge
                  variant={visit.status === "programmato" ? "success" : "muted"}
                >
                  {getStatusLabel(visit.status)}
                </Badge>
              </div>

              <div className="grid gap-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock3 className="size-4 text-teal-700" aria-hidden="true" />
                  <span>{formatVisitDateTime(visit.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-teal-700" aria-hidden="true" />
                  <span>{visit.address}</span>
                </div>
              </div>

              <Button asChild variant="secondary" className="h-11 justify-between">
                <Link href={`/operatore/visite/${visit.id}`}>
                  Dettaglio visita
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
