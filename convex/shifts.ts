import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const tenantId = "tenant_mock_123";

export const getOperatorShiftsInRange = query({
  args: {
    rangeStart: v.number(),
    rangeEnd: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const operator = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!operator || operator.role !== "operator") {
      return null;
    }

    const shifts = await ctx.db
      .query("shifts")
      .withIndex("by_operator", (q) => q.eq("operatorId", operator._id))
      .filter((q) =>
        q.and(
          q.gte(q.field("date"), args.rangeStart),
          q.lt(q.field("date"), args.rangeEnd),
          q.eq(q.field("tenantId"), operator.tenantId)
        )
      )
      .collect();

    const visits = await Promise.all(
      shifts.map(async (shift) => {
        const patient = await ctx.db.get(shift.patientId);

        return {
          id: shift._id,
          date: shift.date,
          patient: patient
            ? `${patient.firstName} ${patient.lastName}`
            : "Paziente sconosciuto",
          address: patient?.address ?? "Indirizzo non disponibile",
          service: shift.serviceType,
          status: shift.status,
        };
      })
    );

    visits.sort((a, b) => a.date - b.date);

    return {
      operator: {
        name: operator.name,
      },
      visits,
    };
  },
});

export const getOperatorShiftById = query({
  args: {
    shiftId: v.id("shifts"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const operator = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!operator || operator.role !== "operator") {
      return null;
    }

    const shift = await ctx.db.get(args.shiftId);

    if (
      !shift ||
      shift.operatorId !== operator._id ||
      shift.tenantId !== operator.tenantId
    ) {
      return null;
    }

    const patient = await ctx.db.get(shift.patientId);

    return {
      id: shift._id,
      date: shift.date,
      patient: patient
        ? `${patient.firstName} ${patient.lastName}`
        : "Paziente sconosciuto",
      address: patient?.address ?? "Indirizzo non disponibile",
      service: shift.serviceType,
      status: shift.status,
      notes: patient?.emergencyNotes ?? null,
      tasks: shift.tasks,
    };
  },
});

export const getShiftFormOptions = query({
  args: {},
  handler: async (ctx) => {
    const operators = await ctx.db
      .query("users")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .filter((q) => q.eq(q.field("role"), "operator"))
      .collect();

    const patients = await ctx.db
      .query("patients")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();

    return {
      operators: operators.map((operator) => ({
        _id: operator._id,
        name: operator.name,
        status: operator.status,
      })),
      patients: patients.map((patient) => ({
        _id: patient._id,
        name: `${patient.firstName} ${patient.lastName}`,
        address: patient.address,
      })),
    };
  },
});

export const createShift = mutation({
  args: {
    operatorId: v.id("users"),
    patientId: v.id("patients"),
    date: v.number(),
    serviceType: v.string(),
    tasks: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("shifts", {
      tenantId,
      operatorId: args.operatorId,
      patientId: args.patientId,
      date: args.date,
      serviceType: args.serviceType,
      status: "programmato",
      tasks: args.tasks.map((description) => ({
        description,
        isCompleted: false,
      })),
    });
  },
});
