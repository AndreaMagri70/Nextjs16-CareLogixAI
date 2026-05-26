import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock3, MapPin, ShieldAlert } from "lucide-react";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

async function startVisit(shiftId: Id<"shifts">) {
  "use server";

  const { getToken, userId } = await auth();

  if (!userId) {
    throw new Error("Accesso richiesto.");
  }

  const token = await getToken({ template: "convex" });

  if (!token) {
    throw new Error("Accesso richiesto.");
  }

  await fetchMutation(api.shifts.startOperatorShift, { shiftId }, { token });

  revalidatePath(`/operatore/visite/${shiftId}`);
  revalidatePath("/operatore");
  revalidatePath("/operatore/turni");
}

function formatVisitDateTime(date: number) {
  return new Date(date).toLocaleString("it-IT", {
    weekday: "long",
    day: "2-digit",
    month: "long",
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

function getStatusBadgeVariant(status: string) {
  if (status === "completato") {
    return "success";
  }

  if (status === "cancellato") {
    return "muted";
  }

  return "warning";
}

export default async function VisitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { getToken, redirectToSignIn, userId } = await auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const token = await getToken({ template: "convex" });

  if (!token) {
    return redirectToSignIn();
  }

  const visit = await fetchQuery(
    api.shifts.getOperatorShiftById,
    { shiftId: id as Id<"shifts"> },
    { token }
  );

  if (!visit) {
    notFound();
  }

  return (
    <div className="grid gap-5">
      <Button asChild variant="ghost" className="h-10 w-fit px-0 text-slate-600">
        <Link href="/operatore/turni">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Turni
        </Link>
      </Button>

      <section className="grid gap-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Dettaglio visita</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal">
              {visit.patient}
            </h1>
          </div>
          <Badge variant={getStatusBadgeVariant(visit.status)}>
            {getStatusLabel(visit.status)}
          </Badge>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>{visit.service}</CardTitle>
          <CardDescription>{formatVisitDateTime(visit.date)}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-3 text-sm text-slate-700">
            <div className="flex items-center gap-3">
              <Clock3 className="size-4 text-teal-700" aria-hidden="true" />
              <span>{formatVisitDateTime(visit.date)}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="size-4 text-teal-700" aria-hidden="true" />
              <span>{visit.address}</span>
            </div>
          </div>

          {visit.notes ? (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
              <div className="flex gap-3 text-sm text-amber-800">
                <ShieldAlert className="mt-0.5 size-4" aria-hidden="true" />
                <p>{visit.notes}</p>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Compiti previsti</CardTitle>
          <CardDescription>
            Lista informativa, la checklist interattiva arriva nello step
            dedicato.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-3">
            {visit.tasks.map((task) => (
              <li
                key={task.description}
                className="rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-700"
              >
                {task.description}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <form action={startVisit.bind(null, visit.id)}>
          <Button
            type="submit"
            className="h-12 w-full"
            disabled={visit.status !== "programmato"}
          >
            {visit.status === "programmato"
              ? "Inizia visita"
              : visit.status === "in corso"
                ? "Visita in corso"
                : "Visita non avviabile"}
          </Button>
        </form>
        <Button variant="secondary" className="h-12">
          Chiama
        </Button>
      </div>
    </div>
  );
}
