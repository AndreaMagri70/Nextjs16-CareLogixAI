"use client";

import { useUser, SignIn } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();
  // Passiamo 'skip' se non loggato per evitare query a vuoto
  const user = useQuery(api.users.getCurrentUser, isSignedIn ? undefined : "skip");
  const router = useRouter();

  useEffect(() => {
    // Se Convex ha trovato l'utente nel database, redirigiamo al suo ruolo
    if (user) {
      if (user.role === "admin") {
        router.replace("/dashboard");
      } else if (user.role === "operator") {
        router.replace("/operatore");
      }
    }
  }, [user, router]);

  // Fase 1: Caricamento stato di Clerk
  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  // Fase 2: Utente NON loggato -> Mostra Login di Clerk
  if (!isSignedIn) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <SignIn routing="hash" />
      </div>
    );
  }

  // Fase 3: Utente loggato ma in attesa della risposta di Convex sul ruolo
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-sm text-gray-500">Verifica dei permessi in corso...</p>
      </div>
    </div>
  );
}
