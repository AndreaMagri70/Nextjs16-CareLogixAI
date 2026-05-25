# Integrazione di Convex, Clerk e Zod

L'obiettivo è installare e configurare i pacchetti richiesti per l'autenticazione (Clerk), il database/backend (Convex) e la validazione dei dati (Zod), aggiornando i layout principali e guidandoti passo passo nell'inserimento delle credenziali.

## User Review Required

> [!IMPORTANT]  
> Poiché mi hai chiesto di procedere passo passo chiedendoti cosa serve per collegare i tuoi account, questo piano è strutturato a fasi. Non andrò avanti con la configurazione di Convex e Clerk senza prima aver ricevuto da te le chiavi necessarie o il via libera.

## Open Questions

> [!IMPORTANT]  
> 1. **Clerk:** Hai già creato un'applicazione sulla dashboard di Clerk (https://dashboard.clerk.com)? Avremo bisogno del tuo `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` e del `CLERK_SECRET_KEY`.
> 2. **Convex:** Hai già un progetto Convex pronto o preferisci che lanciamo insieme il comando `npx convex dev` per crearne uno nuovo e loggarti automaticamente?

## Proposed Changes

L'integrazione sarà suddivisa in tre fasi principali:

### Fase 1: Installazione dei pacchetti
Eseguiremo l'installazione delle dipendenze necessarie.
- `npm install @clerk/nextjs convex zod`

### Fase 2: Configurazione Iniziale di Clerk
- Verrà creato o aggiornato il file `.env.local` per ospitare le chiavi di Clerk e Convex.
- Verrà creato il file middleware per proteggere le rotte se necessario.

#### [NEW] middleware.ts
Aggiungeremo il middleware di base di Clerk per gestire l'autenticazione delle rotte.

### Fase 3: Integrazione Providers e Convex
Creeremo il provider client-side che combinerà sia Convex che Clerk (`ConvexProviderWithClerk`).

#### [NEW] components/Providers.tsx (oppure lib/ConvexClientProvider.tsx)
Creazione di un componente 'use client' per avvolgere l'applicazione con `<ClerkProvider>` e `<ConvexProviderWithClerk>`.

#### [MODIFY] app/layout.tsx
Aggiorneremo il root layout per includere il nuovo componente Provider.

#### [NEW] convex/schema.ts
Inizializzazione della cartella di Convex con uno schema base vuoto per permetterti di avviare il progetto.

#### [NEW] convex/auth.config.ts
Configurazione di Convex per accettare l'autenticazione tramite Clerk, inserendo l'URL del tuo Issuer Clerk.

## Verification Plan

### Manual Verification
1. Chiederemo all'utente di fornire le chiavi Clerk e le inseriremo in `.env.local`.
2. Eseguiremo l'accesso con un utente di test tramite Clerk nell'app (es. usando `<SignInButton />`).
3. Avvieremo Convex (`npx convex dev`) per garantire che lo schema sia sincronizzato correttamente e la connessione sia attiva.
