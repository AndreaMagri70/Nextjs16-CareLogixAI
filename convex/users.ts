import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

async function resolveTenantId(ctx: any) {
  let tenantId = "tenant_mock_123";
  const identity = await ctx.auth.getUserIdentity();
  if (identity) {
    const clerkId = identity.subject;
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q: any) => q.eq("clerkId", clerkId))
      .first();
    if (user) tenantId = user.tenantId;
  }
  return tenantId;
}

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    // 1. Recupera l'identità passata dal token di Clerk
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    // Clerk inserisce l'ID dell'utente nel campo subject ("sub" nel JWT)
    const clerkId = identity.subject;

    // 2. Cerca nel database Convex l'utente corrispondente
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q: any) => q.eq("clerkId", clerkId))
      .first();
    return user;
  },
});

export const listStaff = query({
  args: {},
  handler: async (ctx) => {
    const tenantId = await resolveTenantId(ctx);

    // 2. Recupero di tutti gli utenti del tenant
    const users = await ctx.db
      .query("users")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();

    // 3. Per ciascun utente, troviamo il prossimo turno in programma (maggiore o uguale a ora)
    const now = Date.now();
    const staffWithNextShift = await Promise.all(
      users.map(async (user) => {
        const nextShifts = await ctx.db
          .query("shifts")
          .withIndex("by_operator", (q: any) => q.eq("operatorId", user._id))
          .filter((q: any) =>
            q.and(
              q.eq(q.field("tenantId"), tenantId),
              q.gte(q.field("date"), now),
              q.eq(q.field("status"), "programmato")
            )
          )
          .collect();

        // Ordina per data crescente per trovare il più imminente
        nextShifts.sort((a, b) => a.date - b.date);
        const nextShift = nextShifts[0];

        return {
          _id: user._id,
          name: user.name,
          role: user.role,
          email: user.email,
          status: user.status,
          nextShiftDate: nextShift ? nextShift.date : null,
          nextShiftService: nextShift ? nextShift.serviceType : null,
        };
      })
    );

    return staffWithNextShift;
  },
});

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    clerkId: v.optional(v.string()),
    status: v.union(v.literal("attivo"), v.literal("ferie"), v.literal("inattivo")),
    role: v.union(v.literal("admin"), v.literal("operator")),
  },
  handler: async (ctx, { name, email, clerkId, status, role }) => {
    const tenantId = await resolveTenantId(ctx);
    return await ctx.db.insert("users", {
      tenantId,
      clerkId: clerkId ?? "",
      role,
      name,
      email,
      status,
    });
  },
});

export const _insertUserWithClerkId = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    status: v.union(v.literal("attivo"), v.literal("ferie"), v.literal("inattivo")),
    role: v.union(v.literal("admin"), v.literal("operator")),
  },
  handler: async (ctx, { name, email, clerkId, status, role }) => {
    const tenantId = await resolveTenantId(ctx);
    return await ctx.db.insert("users", {
      tenantId,
      clerkId,
      role,
      name,
      email,
      status,
    });
  },
});

export const createUserWithClerk = action({
  args: {
    name: v.string(),
    email: v.string(),
    status: v.union(v.literal("attivo"), v.literal("ferie"), v.literal("inattivo")),
    role: v.union(v.literal("admin"), v.literal("operator")),
  },
  handler: async (ctx: any, { name, email, status, role }: any): Promise<any> => {
    const clerkSecretKey = process.env.CLERK_SECRET_KEY;
    if (!clerkSecretKey) {
      throw new Error("CLERK_SECRET_KEY not configured");
    }

    // Genera una password temporanea robusta in modo casuale per soddisfare i requisiti di Clerk
    const temporaryPassword = Math.random().toString(36).slice(-10) + "A1!" + Math.random().toString(36).slice(-4);

    // 1. Crea l'utente in Clerk
    const clerkResponse = await fetch("https://api.clerk.com/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${clerkSecretKey}`,
      },
      body: JSON.stringify({
        // Corretto il formato di email_address e aggiunta la password obbligatoria
        email_address: [email], 
        password: temporaryPassword,
        first_name: name.split(" ")[0] || name,
        last_name: name.split(" ").slice(1).join(" ") || " ",
        skip_password_requirement: false, // Forza l'inserimento della password appena generata
      }),
    });

    if (!clerkResponse.ok) {
      const error = await clerkResponse.text();
      throw new Error(`Clerk API error: ${error}`);
    }

    const clerkUser = await clerkResponse.json() as { id: string };
    const clerkId = clerkUser.id;

    // 2. Salva in Convex con il clerkId tramite mutation
    return await ctx.runMutation(api.users._insertUserWithClerkId, {
      name,
      email,
      clerkId,
      status,
      role,
    });
  },
});