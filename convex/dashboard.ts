import { query } from "./_generated/server";
import { v } from "convex/values";

export const getDashboardData = query({
  args: {},
  handler: async (ctx) => {
    // 1. Recuperiamo tutti i turni
    const shifts = await ctx.db.query("shifts").collect();
    
    // 2. Per ogni turno "agganciamo" il nome del paziente e dell'operatore reale
    const populatedShifts = await Promise.all(
      shifts.map(async (shift) => {
        const patient = await ctx.db.get(shift.patientId);
        const operator = await ctx.db.get(shift.operatorId);
        
        return {
          ...shift,
          patientName: patient ? `${patient.firstName} ${patient.lastName}` : "Sconosciuto",
          operatorName: operator ? operator.name : "Sconosciuto",
        };
      })
    );

    // Ordiniamo in ordine cronologico
    populatedShifts.sort((a, b) => a.date - b.date);

    // 3. Calcoliamo un po' di statistiche (es. operatori attivi)
    const activeOperators = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("status"), "attivo"))
      .collect();

    return {
      shifts: populatedShifts,
      stats: {
        totalShifts: shifts.length,
        unassignedShifts: shifts.filter(s => s.status === "programmato").length,
        activeOperators: activeOperators.length,
      }
    };
  },
});

export const getCalendarData = query({
  args: {
    rangeStart: v.number(),
    rangeEnd: v.number(),
  },
  handler: async (ctx, args) => {
    let tenantId = "tenant_mock_123";
    const identity = await ctx.auth.getUserIdentity();

    if (identity) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
        .first();

      if (user) {
        tenantId = user.tenantId;
      }
    }

    const shifts = await ctx.db
      .query("shifts")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .filter((q) =>
        q.and(
          q.gte(q.field("date"), args.rangeStart),
          q.lt(q.field("date"), args.rangeEnd)
        )
      )
      .collect();

    const populatedShifts = await Promise.all(
      shifts.map(async (shift) => {
        const patient = await ctx.db.get(shift.patientId);
        const operator = await ctx.db.get(shift.operatorId);

        return {
          ...shift,
          patientName: patient
            ? `${patient.firstName} ${patient.lastName}`
            : "Sconosciuto",
          operatorName: operator ? operator.name : "Sconosciuto",
        };
      })
    );

    populatedShifts.sort((a, b) => a.date - b.date);

    return {
      shifts: populatedShifts,
    };
  },
});
