import { auth } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import Link from "next/link";

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
import { AssignShiftDialog } from "../turni/assign-shift-dialog";

type CalendarPageProps = {
  searchParams: Promise<{
    week?: string | string[];
  }>;
};

function getDayKey(timestamp: number) {
  return formatDateKey(new Date(timestamp));
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);

  return nextDate;
}

function getMonday(date: Date) {
  const monday = new Date(date);
  monday.setHours(0, 0, 0, 0);

  const day = monday.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  monday.setDate(monday.getDate() + diff);

  return monday;
}

function getWeekStart(week: string | string[] | undefined) {
  const weekValue = Array.isArray(week) ? week[0] : week;

  if (!weekValue || !/^\d{4}-\d{2}-\d{2}$/.test(weekValue)) {
    return getMonday(new Date());
  }

  const [year, month, day] = weekValue.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (Number.isNaN(date.getTime())) {
    return getMonday(new Date());
  }

  return getMonday(date);
}

function formatDay(timestamp: number) {
  return new Intl.DateTimeFormat("it-IT", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(timestamp));
}

function formatWeekRange(weekStart: Date) {
  const weekEnd = addDays(weekStart, 6);

  return `${weekStart.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
  })} - ${weekEnd.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })}`;
}

function formatTime(timestamp: number) {
  return new Intl.DateTimeFormat("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
  const { getToken, redirectToSignIn, userId } = await auth();
  const { week } = await searchParams;
  const weekStart = getWeekStart(week);
  const weekEnd = addDays(weekStart, 7);
  const previousWeek = formatDateKey(addDays(weekStart, -7));
  const nextWeek = formatDateKey(addDays(weekStart, 7));
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(weekStart, index);

    return {
      key: formatDateKey(date),
      label: formatDay(date.getTime()),
    };
  });

  if (!userId) {
    return redirectToSignIn();
  }

  const token = await getToken({ template: "convex" });

  if (!token) {
    return redirectToSignIn();
  }

  const data = await fetchQuery(
    api.dashboard.getCalendarData,
    {
      rangeStart: weekStart.getTime(),
      rangeEnd: weekEnd.getTime(),
    },
    { token }
  );

  const times = Array.from(
    new Set(data.shifts.map((shift) => formatTime(shift.date))),
  ).sort();

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal text-slate-950">
            Calendario turni
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Vista settimanale alimentata dai turni salvati in Convex.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Button variant="secondary" asChild>
              <Link href={`/dashboard/calendario?week=${previousWeek}`}>
                Settimana precedente
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/dashboard/calendario">Oggi</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href={`/dashboard/calendario?week=${nextWeek}`}>
                Settimana successiva
              </Link>
            </Button>
          </div>
          <AssignShiftDialog />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vista turni: {formatWeekRange(weekStart)}</CardTitle>
          <CardDescription>
            Ogni nodo mostra operatore, paziente, orario e servizio dal database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-280 rounded-lg border border-slate-200">
              <div
                className="grid border-b border-slate-200 bg-slate-100"
                style={{
                  gridTemplateColumns: `88px repeat(${days.length}, minmax(150px, 1fr))`,
                }}
              >
                <div className="px-3 py-3 text-xs font-medium uppercase text-slate-500">
                  Ora
                </div>
                {days.map((day) => (
                  <div
                    key={day.key}
                    className="border-l border-slate-200 px-3 py-3 text-sm font-semibold capitalize text-slate-800"
                  >
                    {day.label}
                  </div>
                ))}
              </div>

              {times.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-500">
                  Nessun turno trovato per questa settimana.
                </div>
              ) : (
                times.map((time) => (
                  <div
                    key={time}
                    className="grid min-h-32 border-b border-slate-200 last:border-b-0"
                    style={{
                      gridTemplateColumns: `88px repeat(${days.length}, minmax(150px, 1fr))`,
                    }}
                  >
                    <div className="px-3 py-4 text-sm font-medium text-slate-500">
                      {time}
                    </div>
                    {days.map((day) => {
                      const shifts = data.shifts.filter(
                        (shift) =>
                          getDayKey(shift.date) === day.key &&
                          formatTime(shift.date) === time,
                      );

                      return (
                        <div
                          key={`${day.key}-${time}`}
                          className="grid gap-2 border-l border-slate-200 bg-white p-2"
                        >
                          {shifts.map((shift) => (
                            <article
                              key={shift._id}
                              className="grid gap-2 rounded-md border border-slate-200 bg-slate-50 p-3"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-semibold text-slate-950">
                                  {shift.patientName}
                                </p>
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
                              </div>
                              <div className="text-sm text-slate-600">
                                <p>{shift.operatorName}</p>
                                <p>{shift.serviceType}</p>
                              </div>
                            </article>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
