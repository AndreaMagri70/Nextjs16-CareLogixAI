import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tenantId: v.string(),
    clerkId: v.string(),
    role: v.union(v.literal("admin"), v.literal("operator")),
    name: v.string(),
    email: v.string(),
    status: v.union(v.literal("attivo"), v.literal("ferie"), v.literal("inattivo")),
  }).index("by_tenant", ["tenantId"])
    .index("by_clerkId", ["clerkId"]),

  patients: defineTable({
    tenantId: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    address: v.string(),
    pathologies: v.array(v.string()),
    emergencyNotes: v.optional(v.string()),
  }).index("by_tenant", ["tenantId"]).index("by_lastName", ["lastName"]),

  shifts: defineTable({
    tenantId: v.string(),
    patientId: v.id("patients"),
    operatorId: v.id("users"),
    date: v.number(), // Timestamp
    serviceType: v.string(),
    status: v.union(
      v.literal("programmato"),
      v.literal("in corso"),
      v.literal("completato"),
      v.literal("cancellato")
    ),
    tasks: v.array(
      v.object({
        description: v.string(),
        isCompleted: v.boolean(),
      })
    ),
    clockIn: v.optional(v.number()), // Timestamp inserito manualmente
    clockOut: v.optional(v.number()), // Timestamp inserito manualmente
  })
    .index("by_tenant", ["tenantId"])
    .index("by_operator", ["operatorId"])
    .index("by_patient", ["patientId"]),

  waitlist: defineTable({
    email: v.string(),
    companyName: v.optional(v.string()),
    sector: v.union(
      v.literal("clinica"),
      v.literal("medico"),
      v.literal("rsa"),
      v.literal("agenzia")
    ),
    createdAt: v.number(),
  }).index("by_email", ["email"]),
});
