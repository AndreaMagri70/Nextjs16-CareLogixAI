export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN, // Assicurati di aggiungere questa env nel file .env.local per Convex
      applicationID: "convex",
    },
  ]
};
