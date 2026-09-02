# Gils English School SaaS
Projet Ylice & OTK - 50/50

Monorepo : `frontend/` (Ylice, Next.js 14) + `backend/` (OTK, Node.js + Prisma).

## Frontend (Ylice) — Next.js 14

```bash
cd frontend
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000). Le backend doit tourner (voir ci-dessous) :
la connexion `/login` et le parcours élève appellent tous les deux la vraie API.

**Parcours élève (public, sans connexion) :**
`/inscription` → `/test-de-niveau` → `/resultat` (paiement Wave simulé, vraie API) → `/mon-compte`

**Espace interne** — `/login` (identifiants vérifiés par le backend) :
- Boss : `boss@gils.com` / `boss123` → Bulletin, Finance Cachée, Dashboard Boss
- Staff : `staff@gils.com` / `staff123` → Bulletin uniquement

## Backend (OTK) — Node.js + Prisma

```bash
cd backend
npm install
npm run prisma:migrate   # crée la base SQLite locale (dev.db) + tables
npm run prisma:seed      # crée les comptes boss@gils.com / staff@gils.com
npm run dev               # démarre l'API sur http://localhost:4000
```

Copier `.env.example` en `.env` si besoin (déjà fait pour le dev local).

**Auth (module Auth d'OTK) :**
- `POST /api/auth/login` `{ email, password }` → `{ token, user }` (JWT, 12h)
- `GET /api/auth/me` (Bearer token) → utilisateur courant

**Élèves / EleveController CRUD :**
- `POST /api/students` `{ fullName, whatsapp }` → public, crée l'élève (`PENDING_TEST`)
- `GET /api/students` → Boss/Staff, liste complète
- `GET /api/students/:id` → public, détail élève + lien de paiement
- `PUT /api/students/:id` → Boss/Staff, mise à jour (nom, whatsapp, niveau, statut)
- `DELETE /api/students/:id` → Boss/Staff
- `POST /api/students/:id/test-result` `{ grammarScore, topicScore, audioScore }` → public, calcule
  le niveau (≥13/20 = Intermédiaire), passe l'élève en `PENDING_PAYMENT`, crée/met à jour son `PaymentLink`

**Paiement :**
- `GET /api/payments/:token` → détail du lien de paiement
- `POST /api/payments/:token/pay` → paiement simulé (mock Wave/CinetPay), passe l'élève en `ACTIVE`
- `POST /api/payments/webhook/cinetpay` → stub 501, à brancher avec les vraies clés marchand

**Certificat (module Certificat d'OTK) :**
- `POST /api/certificates/students/:id` → Boss/Staff, génère un certificat `GILS-2026-XXXX` pour un
  élève `ACTIVE`
- `GET /api/certificates` → Boss/Staff, liste
- `GET /api/certificates/:number/download` → PDF (public, pensé pour vérification/partage)

**Piste Audit (module Audit d'OTK) :**
- `GET /api/audit` → Boss uniquement, 200 dernières actions (connexions, créations, paiements,
  certificats émis...)

SQLite en local pour aller vite ; pour passer sur MySQL/PostgreSQL il suffit de changer `provider`
dans `backend/prisma/schema.prisma` et `DATABASE_URL`.

## Déploiement Docker

```bash
cp .env.example .env   # renseigner NEXTAUTH_SECRET et JWT_SECRET
docker compose up --build
```

Lance `backend` (port 4000, SQLite persistée dans un volume) et `frontend` (port 3000, `next start`
en mode standalone). Reste à faire pour un vrai déploiement VPS : reverse proxy (nginx/Caddy) devant
les deux conteneurs avec un nom de domaine, HTTPS, et migration vers MySQL/PostgreSQL managé — pas
fait ici faute d'informations sur le VPS cible (accès SSH, domaine).

## Reste à faire

- Vraie intégration CinetPay (webhook + vérification de signature) — clés marchand à obtenir
- "Cron abonnement" (`backend/src/lib/cron.ts`) : stub volontaire, la règle métier n'est pas définie
- Déploiement réel sur un VPS (domaine, HTTPS, base managée) — nécessite les accès du VPS cible
- Correction automatique du test vocal/dictée (aujourd'hui : scores de démo fixes envoyés à l'API)
