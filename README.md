<svg width="314" height="94" viewBox="0 0 314 94" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M96.75 0.375001L91 92.125L62.5 93.375L62.75 45L49.875 84H38.875L29 49.125L28.875 89.625L0 90.5L1.25 4.125L33.375 2.875L46.125 44.25L63.125 0.375001H96.75Z" fill="#FF751F"/>
<path d="M135.125 3.5L128.25 88.625L101.875 90V5.25L135.125 3.5Z" fill="#FF751F"/>
<path d="M216.562 86.125L185.562 90.125L181.812 76H167.562L164.438 90.125L132.562 87L157.438 3.75L192.188 2L216.562 86.125ZM179.562 56.875L174.812 35.125L170.188 56.875H179.562Z" fill="#FF751F"/>
<path d="M313.552 15.125L308.75 91.75L280.25 93L280.5 44.625L267.625 83.625H256.625L246.75 48.75L246.625 89.25L217.75 90.125L219 3.75L251.125 2.5L263.875 43.875L280.875 0H292.938C292.938 0 291.985 4.61321 294.938 6.97507C297.438 8.97507 302.438 8 302.438 8C301.938 15.125 306.938 17.5 313.552 15.125Z" fill="#FF751F"/>
</svg>

MIAM est une application web mobile-first de partage de recettes et de fiches
de temps de cuisson. Elle permet de parcourir et rechercher des recettes,
d'organiser ses favoris et sa liste de courses, de publier ses propres
contenus et de demander des idées ou des recettes à l'assistant de cuisine
Zest.

Application : [miam-recette.vercel.app](https://miam-recette.vercel.app/)

> **Documentation détaillée :** [DOCUMENTATION.md](./DOCUMENTATION.md) décrit
> les parcours, les routes, les contrats de l'API, les modèles de données, les
> services tiers et les limites actuellement connues.

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Architecture et technologies](#architecture-et-technologies)
- [Prérequis](#prérequis)
- [Installation locale](#installation-locale)
- [Configuration](#configuration)
- [Scripts disponibles](#scripts-disponibles)
- [Routes principales](#routes-principales)
- [Assistant Zest](#assistant-zest)
- [Déploiement](#déploiement)

## Fonctionnalités

- Catalogue de recettes et de temps de cuisson, avec recherche et navigation
  par catégories, ingrédients et contributeurs.
- Comptes utilisateurs, profils et contrôle de visibilité des contenus.
- Création et modification de recettes et de fiches de cuisson.
- Favoris, liste de courses et gestion des ingrédients.
- Interface d'administration pour les utilisateurs, les contenus, les rôles,
  les catégories et les ingrédients.
- Partage de fiches et export PDF.
- Assistant de cuisine Zest, réservé aux utilisateurs connectés :
  - suggestions de recettes générées par IA ;
  - conversation avec historique local ;
  - recette proposée sous forme de brouillon réutilisable dans le formulaire
    d'ajout.
- Interface responsive, thème clair/sombre et prise en compte des zones de
  sécurité des appareils mobiles.

## Architecture et technologies

Le dépôt contient deux applications indépendantes. Le frontend et le backend
ont chacun leur propre `package.json`, leurs dépendances et leur configuration
de déploiement.

| Partie           | Technologies principales                                                        |
| ---------------- | ------------------------------------------------------------------------------- |
| Frontend         | React 19, TypeScript, Vite 8, React Router, TanStack Query, Axios, Tailwind CSS |
| Backend          | Node.js, Express 5, Mongoose, MongoDB, JWT                                      |
| Images et médias | Cloudinary, Sharp, Pixabay, Spoonacular                                         |
| Traduction       | DeepL                                                                           |
| Assistant IA     | Gemini                                                                          |

```text
Navigateur
   │ HTTPS / JSON / multipart
   ▼
Frontend React ─────► API Express (/api)
                           ├── MongoDB
                           ├── Cloudinary / DeepL / Pixabay / Spoonacular
                           └── Gemini (assistant Zest)
```

Le frontend appelle l'API via Axios. En développement, Vite transmet les
requêtes `/api` à l'adresse locale du backend. En production, `VITE_API_URL`
doit pointer vers l'API déployée.

## Prérequis

- Node.js et npm, dans des versions compatibles avec les dépendances du projet.
- MongoDB (local ou hébergé).
- Une clé JWT et les identifiants des services externes dont vous activez les
  fonctionnalités. Voir [Configuration](#configuration).

## Installation locale

Clonez le dépôt, puis installez les dépendances séparément dans chaque
application.

Terminal 1 — backend :

```sh
cd backend
npm install
npm run dev
```

Terminal 2 — frontend :

```sh
cd frontend
npm install
npm run dev
```

Vite affiche l'adresse locale du frontend dans le terminal. Par défaut, le
proxy API cible le backend sur le port `5000`.

Créez les fichiers `backend/.env` et `frontend/.env` en vous basant sur les
variables ci-dessous. Ne copiez jamais de vraies clés ou de secrets dans le
dépôt.

## Configuration

### Backend — `backend/.env`

```dotenv
MONGO_URI=
JWT_SECRET=
APP_PORT=5000
CLIENT_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173

# Selon les fonctionnalités que vous utilisez
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
DEEPL_API_KEY=
PIXABAY_API_KEY=
SPOONACULAR_API_KEY=
GEMINI_API_KEY=
CHAT_MONTHLY_TOKEN_LIMIT=100000
```

`MONGO_URI` et `JWT_SECRET` sont nécessaires au fonctionnement normal de
l'API. Les identifiants Cloudinary, DeepL, Pixabay et Spoonacular sont utilisés
par les fonctions d'images et de traduction. `GEMINI_API_KEY` active Zest ;
`CHAT_MONTHLY_TOKEN_LIMIT` règle le quota mensuel global, dont la valeur par
défaut est `100000` tokens.

### Frontend — `frontend/.env`

```dotenv
VITE_API_URL=/api
APP_PORT=5000
```

`APP_PORT` configure la cible du proxy Vite. En production, définissez
`VITE_API_URL` avec l'URL de l'API déployée. Les variables préfixées par
`VITE_` sont intégrées au code envoyé au navigateur : elles ne doivent jamais
contenir de secret.

Les fichiers `.env` doivent rester locaux et ne pas être commités.

## Scripts disponibles

### Frontend

Depuis `frontend/` :

| Commande          | Description                                                      |
| ----------------- | ---------------------------------------------------------------- |
| `npm run dev`     | Démarre Vite en mode développement                               |
| `npm run build`   | Vérifie les types TypeScript puis produit le build de production |
| `npm run lint`    | Exécute ESLint                                                   |
| `npm run preview` | Sert localement le build de production                           |

### Backend

Depuis `backend/` :

| Commande      | Description                                                     |
| ------------- | --------------------------------------------------------------- |
| `npm run dev` | Démarre le serveur avec Nodemon                                 |
| `npm start`   | Démarre le serveur avec Node.js                                 |
| `npm test`    | Aucun test n'est configuré actuellement ; cette commande échoue |

## Routes principales

| Route                                         | Accès          | Description                            |
| --------------------------------------------- | -------------- | -------------------------------------- |
| `/`                                           | Public         | Accueil et catalogue                   |
| `/search`                                     | Public         | Recherche                              |
| `/categories`, `/category/:slug`              | Public         | Catégories                             |
| `/ingredients`                                | Public         | Recherche par ingrédients              |
| `/chefs`, `/chef/:slug`                       | Public         | Contributeurs et profils publics       |
| `/recipe/:slug`                               | Public         | Détail d'une recette                   |
| `/cooking-time/:slug`                         | Public         | Détail d'une fiche de cuisson          |
| `/register`, `/login`, `/reset-password`      | Public         | Authentification et réinitialisation   |
| `/add`, `/chat`, `/profile`, `/shopping-list` | Connecté       | Création, assistant, profil et courses |
| `/admin` et sous-routes                       | Administrateur | Administration de l'application        |

L'API est préfixée par `/api`. L'assistant utilise `POST /api/chat` et exige
un JWT. Les routes et contrats des autres ressources sont détaillés dans
[DOCUMENTATION.md](./DOCUMENTATION.md#46-api-rest).

## Assistant Zest

Zest est un assistant alimenté par Gemini. L'historique de conversation est
conservé côté navigateur, dans `localStorage` ou `sessionStorage` selon la
durée de la session ; il n'est pas persisté par l'API. Les conversations sont
effacées lors de la déconnexion ou via l'action de suppression dans l'écran
de chat.

Les suggestions sont générées par le modèle à l'ouverture d'une conversation
vide. En cas d'échec, l'interface propose trois alternatives : « Tarte aux
pommes », « Gratin dauphinois » et « Crêpes ». Les réponses structurées en
recette peuvent préremplir le formulaire d'ajout ; elles ne sont pas publiées
automatiquement.

Le quota de tokens est partagé entre les utilisateurs et renouvelé au début
du mois selon le calendrier `Europe/Paris`. Une requête envoie au modèle au
maximum les huit derniers messages ; le dernier message utilisateur est limité
à 500 caractères.

## Déploiement

Le frontend et le backend sont déployés séparément sur Vercel :

- le frontend utilise `frontend/vercel.json` pour servir l'application React
  et router les chemins côté client ;
- le backend expose l'application Express via `backend/api/index.js` et
  `backend/vercel.json`.

Configurez les variables d'environnement correspondantes dans chaque projet
Vercel. Les clés des services tiers et les variables backend doivent être
stockées côté serveur. Seule l'URL publique de l'API peut être exposée au
frontend via `VITE_API_URL`.

## Licence

Copyright © 2026 jstm17. Tous droits réservés.
Voir le fichier [LICENSE](./LICENSE) pour plus de détails.
