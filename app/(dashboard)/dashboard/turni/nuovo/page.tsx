import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AssignShiftDialog } from "../assign-shift-dialog";

export default function NewShiftPage() {
  return (
    <div className="grid max-w-4xl gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal text-slate-950">
          Assegna turno
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Seleziona operatore, paziente, data e ora del servizio.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nuovo turno</CardTitle>
          <CardDescription>
            La Server Action valida il form e aggiorna il riepilogo dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-end">
          <AssignShiftDialog />
        </CardContent>
      </Card>
    </div>
  );
}
