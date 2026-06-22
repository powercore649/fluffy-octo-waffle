# Bumpify Dashboard

Dashboard web pour gérer Bumpify, déployable indépendamment du bot Discord (compatible Vercel).
Le bot (`src/`) reste un processus longue durée à part — ce dashboard ne fait que se connecter à la
même base MongoDB et appeler l'API Discord (avec le token du bot) côté serveur.

## 1. Créer l'application OAuth2 Discord

1. Allez sur https://discord.com/developers/applications et sélectionnez votre application (celle du bot).
2. Dans l'onglet **OAuth2**, notez le **Client ID** et générez/copiez le **Client Secret**.
3. Toujours dans **OAuth2 → General**, ajoutez une **Redirect URI** :
   - En local : `http://localhost:3000/api/auth/callback/discord`
   - En production (Vercel) : `https://<votre-projet>.vercel.app/api/auth/callback/discord`
4. Les scopes utilisés par le dashboard sont `identify` et `guilds` (gérés automatiquement par NextAuth).

## 2. Variables d'environnement

Copiez `.env.example` vers `.env.local` et remplissez :

| Variable | Description |
|---|---|
| `MONGODB_URI` | Même base MongoDB que le bot (le dashboard lit/écrit les mêmes documents). |
| `BOT_TOKEN` | Token du bot Discord, utilisé uniquement côté serveur pour lister salons/rôles via l'API Discord. Jamais exposé au client. |
| `DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET` | Identifiants de l'application OAuth2 Discord (étape 1). |
| `NEXTAUTH_SECRET` | Secret de signature des sessions NextAuth. Générez une valeur aléatoire, ex. `openssl rand -base64 32`. |
| `NEXTAUTH_URL` | URL publique du dashboard (`http://localhost:3000` en local, l'URL Vercel en prod). |

## 3. Développement local

```bash
cd dashboard
npm install
npm run dev
```

Le dashboard démarre sur http://localhost:3000. Connectez-vous avec Discord, choisissez un serveur
mutuel (où le bot est présent et où vous avez la permission **Gérer le serveur**), puis configurez.

## 4. Déploiement sur Vercel

1. Créez un nouveau projet Vercel à partir de ce dépôt.
2. **Root Directory** : réglez-le sur `dashboard` (le dashboard est un sous-projet indépendant du bot).
3. Vercel détecte automatiquement Next.js (`vercel.json` précise déjà `framework: nextjs`).
4. Dans **Project Settings → Environment Variables**, ajoutez les mêmes variables que `.env.example` :
   `MONGODB_URI`, `BOT_TOKEN`, `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
   (avec `NEXTAUTH_URL` = l'URL Vercel finale du projet).
5. Ajoutez l'URL Vercel comme Redirect URI dans l'application Discord (étape 1, point 3).
6. Déployez. Le bot Discord (`src/index.js`) continue de tourner ailleurs (VPS, etc.) — Vercel
   n'exécute que ce dashboard, qui partage simplement la base MongoDB et appelle l'API Discord pour
   les besoins ponctuels (liste des salons/rôles).

## Notes

- Toutes les routes API (`app/api/...`) re-vérifient côté serveur que l'utilisateur a la permission
  **Gérer le serveur** sur le `guildId` demandé (nouvel appel à l'API Discord avec son token OAuth2,
  jamais une confiance aveugle envers le client).
- Les modèles mongoose ne sont pas dupliqués : `lib/models.js` importe directement les fichiers de
  `../src/models/`, qui restent la source unique de vérité partagée avec le bot.
- La page **Commandes** persiste une liste de commandes désactivées par serveur (nouveau modèle
  `src/models/GuildCommands.js`), mais le bot ne lit pas encore ce champ pour bloquer l'exécution —
  l'enforcement côté bot reste à implémenter séparément.
