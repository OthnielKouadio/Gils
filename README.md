# Gils English School SaaS
Projet Ylice & OTK - 50/50

Monorepo : `frontend/` (Ylice, Next.js 14) + `backend/` (OTK, Node.js + Prisma).

## Frontend (Ylice) — Next.js 14

```bash
cd frontend
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

**Parcours élève (public, sans connexion) :**
`/inscription` → `/test-de-niveau` → `/resultat` (paiement Wave simulé) → `/mon-compte`

**Espace interne** — `/login` :
- Boss : `boss@gils.com` / `boss123` (accès aux 4 modules)
- Staff : `staff@gils.com` / `staff123` (Bulletin uniquement)

Auth/rôles et données mockées en local pour l'instant. Le parcours élève utilise `sessionStorage`
côté client — pas encore branché sur l'API backend (voir ci-dessous).

## Backend (OTK) — Node.js + Prisma

```bash
cd backend
npm install
npm run prisma:migrate   # crée la base SQLite locale (dev.db) à partir de prisma/schema.prisma
npm run dev               # démarre l'API sur http://localhost:4000
```

Copier `.env.example` en `.env` si besoin (déjà fait pour le dev local).

**Endpoints :**
- `POST /api/students` `{ fullName, whatsapp }` → crée l'élève (status `PENDING_TEST`)
- `GET /api/students/:id` → détail élève + lien de paiement
- `POST /api/students/:id/test-result` `{ grammarScore, topicScore, audioScore }` → calcule le niveau
  (≥13/20 = Intermédiaire), passe l'élève en `PENDING_PAYMENT`, crée/à jour son `PaymentLink`
- `GET /api/payments/:token` → détail du lien de paiement
- `POST /api/payments/:token/pay` → paiement simulé (mock Wave/CinetPay), passe l'élève en `ACTIVE`
- `POST /api/payments/webhook/cinetpay` → stub, à brancher quand les clés marchand CinetPay seront dispo

SQLite en local pour aller vite ; pour passer sur PostgreSQL il suffit de changer `provider` dans
`backend/prisma/schema.prisma` et `DATABASE_URL` dans `.env`.

**Reste à faire côté backend :** vraie intégration CinetPay (webhook + vérification de signature),
auth/rôles Boss/Staff/Élève partagée avec le frontend, endpoints Bulletin/Finance/Dashboard.

**Reste à faire côté frontend :** remplacer le `sessionStorage` du parcours élève par de vrais appels
à cette API une fois les deux équipes d'accord sur le contrat.
