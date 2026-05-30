import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

function requireText(value: string, fieldName: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`${fieldName} obbligatorio.`);
  }
  return trimmed;
}

export const listPatients = query({
  args: {
    tenantId: v.optional(v.string()),
    page: v.optional(v.number()),
    pageSize: v.optional(v.number()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Resolve tenantId: prefer arg, else try from authenticated user, else fallback dev tenant
    let tenantId = args.tenantId;
    if (!tenantId) {
      const identity = await ctx.auth.getUserIdentity();
      if (identity) {
        const clerkId = identity.subject;
        const user = await ctx.db
          .query("users")
          .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
          .first();
        if (user) tenantId = user.tenantId;
      }
    }
    if (!tenantId) {
      tenantId = "tenant_mock_123";
    }

    const page = Math.max(1, args.page ?? 1);
    const pageSize = Math.min(100, args.pageSize ?? 25);

    const all = await ctx.db
      .query("patients")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();

    // Optional simple search (contains in firstName or lastName)
    let filtered = all;
    if (args.search) {
      const s = args.search.toLowerCase();
      filtered = all.filter((p) => {
        return (
          (p.firstName && p.firstName.toLowerCase().includes(s)) ||
          (p.lastName && p.lastName.toLowerCase().includes(s))
        );
      });
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const pageItems = filtered.slice(start, start + pageSize);

    return {
      total,
      page,
      pageSize,
      patients: pageItems.map((p) => ({
        _id: p._id,
        firstName: p.firstName,
        lastName: p.lastName,
        name: `${p.firstName} ${p.lastName}`,
        address: p.address,
        pathologies: p.pathologies,
        emergencyNotes: p.emergencyNotes,
      })),
    };
  },
});

export const createPatient = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    address: v.string(),
    pathologies: v.array(v.string()),
    emergencyNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const firstName = requireText(args.firstName, "Nome");
    const lastName = requireText(args.lastName, "Cognome");
    const address = requireText(args.address, "Indirizzo");
    const pathologies = args.pathologies.map((item) => item.trim()).filter(Boolean);
    const emergencyNotes = args.emergencyNotes?.trim();

    let tenantId = "tenant_mock_123";
    const identity = await ctx.auth.getUserIdentity();
    if (identity) {
      const clerkId = identity.subject;
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
        .first();
      if (user) tenantId = user.tenantId;
    }

    return await ctx.db.insert("patients", {
      tenantId,
      firstName,
      lastName,
      address,
      pathologies,
      emergencyNotes: emergencyNotes || undefined,
    });
  },
});
