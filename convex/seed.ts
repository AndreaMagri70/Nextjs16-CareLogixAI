import { mutation } from "./_generated/server";

export const populate = mutation({
  args: {},
  handler: async (ctx) => {
    const tenantId = "tenant_mock_123";

    // Inseriamo 3 utenti (Operatori/Admin)
    const op1Id = await ctx.db.insert("users", {
      tenantId,
      clerkId: "clerk_mock_1",
      role: "admin",
      name: "Anna Coordinatrice",
      email: "anna@carelogix.it",
      status: "attivo"
    });
    const op2Id = await ctx.db.insert("users", {
      tenantId,
      clerkId: "clerk_mock_2",
      role: "operator",
      name: "Marco Rossi",
      email: "marco@carelogix.it",
      status: "attivo"
    });
    const op3Id = await ctx.db.insert("users", {
      tenantId,
      clerkId: "clerk_mock_3",
      role: "operator",
      name: "Giulia Bianchi",
      email: "giulia@carelogix.it",
      status: "ferie"
    });

    // Inseriamo 3 pazienti
    const pat1Id = await ctx.db.insert("patients", {
      tenantId,
      firstName: "Mario",
      lastName: "Rossini",
      address: "Via Roma 1, Milano",
      pathologies: ["Ipertensione", "Diabete tipo 2"],
      emergencyNotes: "Contattare il figlio Luca al 333-1234567"
    });
    const pat2Id = await ctx.db.insert("patients", {
      tenantId,
      firstName: "Luisa",
      lastName: "Verdi",
      address: "Corso Venezia 15, Milano",
      pathologies: ["Artrosi"],
      emergencyNotes: "Allergica alla penicillina."
    });
    const pat3Id = await ctx.db.insert("patients", {
      tenantId,
      firstName: "Giacomo",
      lastName: "Poretti",
      address: "Piazza Duomo 3, Milano",
      pathologies: ["Cardiopatia ischemica"]
    });

    // Inseriamo 3 turni
    const now = Date.now();
    await ctx.db.insert("shifts", {
      tenantId,
      operatorId: op2Id,
      patientId: pat1Id,
      date: now + 86400000, // domani
      serviceType: "Igiene Personale",
      status: "programmato",
      tasks: [
        { description: "Doccia", isCompleted: false },
        { description: "Cambio medicazione", isCompleted: false }
      ]
    });

    await ctx.db.insert("shifts", {
      tenantId,
      operatorId: op2Id,
      patientId: pat2Id,
      date: now - 86400000, // ieri
      serviceType: "Somministrazione Farmaci",
      status: "completato",
      tasks: [
        { description: "Insulina", isCompleted: true },
        { description: "Controllo pressione", isCompleted: true }
      ],
      clockIn: now - 86400000,
      clockOut: now - 86400000 + 3600000 // un'ora dopo
    });

    await ctx.db.insert("shifts", {
      tenantId,
      operatorId: op3Id,
      patientId: pat3Id,
      date: now + 172800000, // dopodomani
      serviceType: "Fisioterapia base",
      status: "programmato",
      tasks: [
        { description: "Esercizi di mobilizzazione gambe", isCompleted: false }
      ]
    });

    return "Mock data inseriti con successo!";
  }
});
