import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const joinWaitlist = mutation({
  args: {
    email: v.string(),
    companyName: v.optional(v.string()),
    sector: v.union(
      v.literal("clinica"),
      v.literal("medico"),
      v.literal("rsa"),
      v.literal("agenzia")
    ),
  },
  handler: async (ctx, args) => {
    // Controlla se l'email è già presente
    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      return { success: false, message: "Email già registrata nella whitelist." };
    }

    await ctx.db.insert("waitlist", {
      email: args.email,
      companyName: args.companyName,
      sector: args.sector,
      createdAt: Date.now(),
    });

    return { success: true, message: "Iscrizione completata con successo!" };
  },
});
