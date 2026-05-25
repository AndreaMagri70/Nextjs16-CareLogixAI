import Link from "next/link";
import { HeartPulse } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

import { OperatorNav } from "./_components/operator-nav";

export default function MobileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-md items-center justify-between px-4">
          <Link href="/operatore" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-md bg-teal-600 text-white">
              <HeartPulse className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">CareLogixAI</p>
              <p className="mt-1 text-xs text-slate-500">Area operatore</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block rounded-md bg-slate-100 px-3 py-2 text-right">
              <p className="text-xs font-medium text-slate-500">Turno</p>
              <p className="text-sm font-semibold">Attivo</p>
            </div>
            <UserButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 pb-28 pt-5">{children}</main>
      <OperatorNav />
    </div>
  );
}
