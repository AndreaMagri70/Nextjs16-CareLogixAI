"use client";

import { useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";
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

export function SearchPatients() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [cachedResult, setCachedResult] = useState<{
    patients: any[];
    total: number;
  } | null>(null);
  const pageSize = 25;

  const result = useQuery(api.patients.listPatients, {
    page,
    pageSize,
    search,
  });

  useEffect(() => {
    if (result !== undefined) {
      setCachedResult(result);
    }
  }, [result]);

  const displayResult = result ?? cachedResult;
  if (!displayResult) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="size-8 animate-spin text-teal-600" />
      </div>
    );
  }

  const patients = displayResult.patients ?? [];
  const total = displayResult.total ?? 0;

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-3">
        <Search className="size-4 text-slate-500" />
        <input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Cerca per nome..."
          className="rounded-md border px-2 py-1 text-sm"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Elenco pazienti</CardTitle>
          <CardDescription>
            {`Mostrati ${patients.length} di ${total} pazienti`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Indirizzo</TableHead>
                <TableHead>Patologie</TableHead>
                <TableHead>Note emergenza</TableHead>
                <TableHead>Priorita</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient: any) => (
                <TableRow key={patient._id}>
                  <TableCell className="font-medium text-slate-950">
                    {patient.name}
                  </TableCell>
                  <TableCell>{patient.address}</TableCell>
                  <TableCell>{(patient.pathologies || []).join(", ")}</TableCell>
                  <TableCell className="max-w-70">
                    {patient.emergencyNotes ?? ""}
                  </TableCell>
                  <TableCell>
                    <Badge variant="muted">-</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-slate-500">Pagina {page}</div>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                Precedente
              </button>
              <button
                type="button"
                className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={patients.length < pageSize}
                onClick={() => setPage((current) => current + 1)}
              >
                Successiva
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
