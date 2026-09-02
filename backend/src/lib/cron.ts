import cron from "node-cron";

// Module Déploiement d'OTK : "Cron abonnement".
// Stub volontaire — la règle métier réelle (quel événement déclenche quoi, qui
// est notifié, etc.) n'a pas encore été définie avec l'équipe. Pour l'instant,
// ce job tourne chaque jour à minuit et se contente de logguer un point de
// contrôle ; à remplacer par la vraie logique une fois le modèle d'abonnement
// (Gil's -> Ylice/OTK, 40k/mois chacun) précisé.
export function startSubscriptionCron() {
  cron.schedule("0 0 * * *", () => {
    console.log(`[cron abonnement] check quotidien - ${new Date().toISOString()} (stub, logique métier à définir)`);
  });
}
