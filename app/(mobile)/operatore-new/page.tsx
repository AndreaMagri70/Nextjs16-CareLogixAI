import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { ArrowRight, Clock3, MapPin, Phone, ShieldCheck } from "lucide-react";

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

function getStatusLabel(status: string, isNextVisit = false) {
  if (status === "in corso") {
    return "In corso";
  }

  if (status === "completato") {
    return "Completata";
  }

  if (status === "cancellato") {
    return "Cancellata";
  }

  return isNextVisit ? "Prossima" : "Pianificata";
}

export default async function OperatorNewPage() {
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
          <p className="text-sm text-slate-500">Area operatore</p>
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
  const nextVisit =
    visits.find(
      (visit) =>
        visit.status !== "completato" && visit.status !== "cancellato"
    ) ?? visits.find((visit) => visit.status === "in corso");

  return (
    <div className="grid gap-5">
      <section className="grid gap-2">
        <p className="text-sm text-slate-500">
          Buongiorno, {data.operator.name.split(" ")[0]}
        </p>
        <h1 className="text-2xl font-semibold tracking-normal">
          I tuoi servizi dei prossimi 6 giorni
        </h1>
      </section>

      {nextVisit ? (
        <Card className="border-teal-200 bg-teal-50">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardDescription className="text-teal-700">
                  Prossima visita
                </CardDescription>
                <CardTitle className="mt-2 text-xl">
                  {nextVisit.patient}
                </CardTitle>
              </div>
              <Badge variant="success">
                {getStatusLabel(nextVisit.status, true)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-3 text-sm text-slate-700">
              <div className="flex items-center gap-3">
                <Clock3 className="size-4 text-teal-700" aria-hidden="true" />
                <span>{formatVisitDateTime(nextVisit.date)}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="size-4 text-teal-700" aria-hidden="true" />
                <span>{nextVisit.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck
                  className="size-4 text-teal-700"
                  aria-hidden="true"
                />
                <span>{nextVisit.service}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button asChild className="h-12">
                <Link href={`/operatore/visite/${nextVisit.id}`}>
                  Apri visita
                </Link>
              </Button>
              <Button variant="secondary" className="h-12">
                <Phone className="size-4" aria-hidden="true" />
                Contatta
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4 text-sm text-slate-600">
            Non hai visite assegnate nei prossimi 6 giorni.
          </CardContent>
        </Card>
      )}

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
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Agenda</h2>
          <span className="text-sm text-slate-500">{visits.length} visite</span>
        </div>

        {visits.length === 0 ? (
          <Card>
            <CardContent className="p-4 text-sm text-slate-600">
              Non hai turni assegnati nei prossimi 6 giorni.
            </CardContent>
          </Card>
        ) : null}

        {visits.map((visit) => {
          const isNextVisit = visit.id === nextVisit?.id;

          return (
            <Card key={visit.id}>
              <CardContent className="grid gap-4 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/operatore/visite/${visit.id}`}
                      className="text-sm font-semibold text-slate-950"
                    >
                      {visit.patient}
                    </Link>
                    <p className="mt-1 text-sm text-slate-500">
                      {visit.service}
                    </p>
                  </div>
                  <Badge variant={isNextVisit ? "success" : "muted"}>
                    {getStatusLabel(visit.status, isNextVisit)}
                  </Badge>
                </div>

                <div className="grid gap-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock3
                      className="size-4 text-teal-700"
                      aria-hidden="true"
                    />
                    <span>{formatVisitDateTime(visit.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin
                      className="size-4 text-teal-700"
                      aria-hidden="true"
                    />
                    <span>{visit.address}</span>
                  </div>
                </div>

                <Button
                  asChild
                  variant="secondary"
                  className="h-11 justify-between"
                >
                  <Link href={`/operatore/visite/${visit.id}`}>
                    Dettaglio visita
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
