import { NewPatientDialog } from "./new-patient-dialog";
import { SearchPatients } from "./search-patients";

export default function PatientsPage() {
  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal text-slate-950">
            Pazienti
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Schede sintetiche per indirizzi, patologie e note di emergenza.
          </p>
        </div>

        <NewPatientDialog />
      </div>

      <SearchPatients />
    </div>
  );
}
