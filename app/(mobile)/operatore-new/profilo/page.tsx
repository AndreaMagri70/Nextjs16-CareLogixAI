import { Mail, MapPin, Phone, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { operatorProfile } from "../../_data/operator-schedule";

const profileRows = [
  {
    label: "Telefono",
    value: operatorProfile.phone,
    icon: Phone,
  },
  {
    label: "Email",
    value: operatorProfile.email,
    icon: Mail,
  },
  {
    label: "Area",
    value: operatorProfile.area,
    icon: MapPin,
  },
];

export default function OperatorProfilePage() {
  return (
    <div className="grid gap-5">
      <section className="grid gap-2">
        <p className="text-sm text-slate-500">Profilo personale</p>
        <h1 className="text-2xl font-semibold tracking-normal">
          Dati operatore
        </h1>
      </section>

      <Card className="border-teal-200 bg-teal-50">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex size-16 items-center justify-center rounded-md bg-teal-600 text-white">
            <UserRound className="size-8" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-semibold text-slate-950">
              {operatorProfile.name}
            </p>
            <p className="mt-1 text-sm text-slate-600">{operatorProfile.role}</p>
            <div className="mt-2">
              <Badge variant="success">Attivo</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contatti</CardTitle>
          <CardDescription>
            Dati mockati in attesa di Clerk e profilo autenticato.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {profileRows.map((row) => {
            const Icon = row.icon;

            return (
              <div
                key={row.label}
                className="flex items-center gap-3 rounded-md border border-slate-200 p-3"
              >
                <div className="flex size-10 items-center justify-center rounded-md bg-slate-100 text-slate-600">
                  <Icon className="size-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase text-slate-500">
                    {row.label}
                  </p>
                  <p className="truncate text-sm text-slate-800">{row.value}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Operativita</CardTitle>
          <CardDescription>
            Informazioni base per il coordinamento giornaliero.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <div className="rounded-md bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Dal</p>
            <p className="mt-1 text-lg font-semibold">
              {operatorProfile.activeSince}
            </p>
          </div>
          <div className="rounded-md bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Stato</p>
            <p className="mt-1 text-lg font-semibold">Disponibile</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
