# MIAM — documentation technique et fonctionnelle

Documentation rédigée à partir du code du dépôt. Les comportements décrits
correspondent à l'implémentation observée. Les limites listées en fin de
document sont des écarts réels du code, pas des fonctionnalités garanties.

## 1. Présentation

MIAM est une application web mobile-first de partage de recettes et de fiches
de temps de cuisson. Un visiteur consulte le catalogue, les catégories, les
contributeurs et les ingrédients. Un compte permet de publier, de garder des
favoris et de constituer une liste de courses. Un administrateur gère les
comptes, les contenus et les rôles.

Le dépôt contient deux applications indépendantes, déployées séparément sur
Vercel :

| Partie            | Rôle                                                                                                                 |
| ----------------- | -------------------------------------------------------------------------------------------------------------------- |
| `frontend/`       | Interface React, navigation, formulaires, cache client                                                               |
| `backend/`        | API REST Express, authentification, persistance MongoDB                                                              |
| Services externes | Cloudinary (images), DeepL (traduction), Pixabay et Spoonacular (images automatiques), Gemini (assistant de cuisine) |

L'adresse publique du frontend est `https://miam-recette.vercel.app/`.

## 2. Acteurs

| Acteur               | Ce qu'il peut faire                                                                                                                                                                                                           |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Visiteur             | Consulter les contenus publics, rechercher, ouvrir une fiche, s'inscrire et se connecter                                                                                                                                      |
| Utilisateur connecté | Tout ce que fait le visiteur, plus créer et modifier ses contenus, gérer la visibilité, les favoris, la liste de courses et son profil                                                                                        |
| Administrateur       | Tout ce que fait l'utilisateur, plus le tableau de bord, la suppression groupée, la gestion des images de catégories et d'ingrédients, l'attribution des rôles et la génération d'un lien de réinitialisation de mot de passe |

Le rôle est stocké sur l'utilisateur : `user` (valeur par défaut) ou `admin`.

## 3. Documentation fonctionnelle

### 3.1 Accueil

L'accueil (`/`) présente deux onglets, mémorisés dans l'URL :

- recettes (`/` ) ;
- temps de cuisson (`/?tab=cooking-time`).

Chaque onglet liste les contenus visibles, du plus récent au plus ancien.
L'utilisateur connecté voit aussi ses propres contenus privés. Des filtres
côté navigateur permettent de restreindre par catégorie, par auteur, et de
trier du plus récent au plus ancien ou l'inverse. Une liste vide propose
d'ajouter un contenu.

### 3.2 Recherche

La recherche (`/search`) est entièrement côté navigateur. Elle interroge les
listes déjà chargées et compare les noms après normalisation (casse et
accents). Elle couvre :

- les recettes ;
- les temps de cuisson ;
- les catégories ;
- les utilisateurs.

La saisie est synchronisée avec le paramètre `q`. Sans saisie, l'écran propose
des carrousels : catégories, contributeurs, et une section ingrédients pour
l'onglet recettes. Jusqu'à cinq recherches récentes sont conservées dans
`localStorage` sous la clé `recentSearches`.

L'onglet temps de cuisson utilise `?tab=cooking-time`.

### 3.3 Recettes

Une recette contient :

- un nom ;
- une ou plusieurs catégories ;
- des ingrédients, chacun avec une quantité et le libellé tel que saisi ;
- des étapes ;
- un temps de préparation et un temps de cuisson, en minutes ;
- un nombre de personnes ;
- une image ;
- un indicateur de visibilité ;
- l'auteur et les dates de création et de modification.

**Consultation** (`/recipe/:slug`). La fiche affiche l'image, les métadonnées,
les ingrédients et les étapes. Une recette privée n'est affichée qu'à son
auteur ; les autres voient un écran « recette privée ». L'image défile avec un
léger effet de parallaxe.

**Actions sur la fiche**, selon le visiteur :

| Action                                                  | Qui                  |
| ------------------------------------------------------- | -------------------- |
| Enregistrer ou retirer des favoris                      | Utilisateur connecté |
| Ajouter ou retirer un ingrédient de la liste de courses | Utilisateur connecté |
| Partager (copier le lien, WhatsApp, PDF)                | Tout le monde        |
| Rendre publique ou privée                               | Auteur               |
| Modifier                                                | Auteur               |
| Supprimer                                               | Auteur               |

**Création et modification** (`/add` et `/recipe-edit/:slug`). Le formulaire
exige un nom, au moins une catégorie et un choix de visibilité. Image,
ingrédients, étapes, temps et nombre de personnes sont facultatifs côté
formulaire. Les ingrédients et les étapes se réordonnent par glisser-déposer.
Sur mobile, une ligne d'ingrédient se supprime par balayage. Un collage depuis
le presse-papiers découpe une liste d'ingrédients (quantité, unité, nom) ou
une liste d'étapes.

Sans image fournie, le serveur en cherche une automatiquement.

**Page ingrédients** (`/ingredients`). L'utilisateur sélectionne un ou
plusieurs ingrédients. Les recettes visibles qui les contiennent tous sont
affichées. La sélection est reflétée dans l'URL (`?ingredients=`).

### 3.4 Temps de cuisson

Une fiche de temps de cuisson est un contenu distinct d'une recette. Elle
contient :

- un nom ;
- une ou plusieurs catégories ;
- un appareil (`device`), libre ;
- une température (`degreeCook`) ;
- une durée (`timeCook`) ;
- un mode de cuisson (`methodCook`), libre ;
- des notes ;
- une image ;
- la visibilité et l'auteur.

**Consultation** (`/cooking-time/:slug`). Même logique de visibilité que les
recettes : une fiche privée n'est lisible que par son auteur.

**Création.** Le même écran `/add` propose un second onglet, « temps de
cuisson ». Il n'existe pas d'URL dédiée. La modification passe par
`/cooking-time-edit/:slug`.

Les actions de favori, de partage (lien, WhatsApp, PDF), de visibilité, de
modification et de suppression suivent le même principe que les recettes. Une
fiche de cuisson n'alimente pas la liste de courses.

### 3.5 Catégories

Les catégories ne sont pas un référentiel saisi à l'avance par
l'administrateur. Elles sont créées au moment de la publication d'une recette
ou d'une fiche, à partir du nom tapé dans le formulaire.

Une catégorie a un nom unique, un slug, un nom anglais (pour la recherche
d'image) et une image.

- `/categories` liste les catégories qui ont au moins un contenu visible, avec
  le nombre de recettes ou de fiches selon l'onglet.
- `/category/:slug` affiche l'en-tête de la catégorie puis les recettes et,
  via `?tab=cooking-time`, les temps de cuisson.
- Les carrousels d'accueil et de recherche mettent en avant les catégories les
  plus utilisées (top).

L'administrateur peut renommer une catégorie, remplacer son image, régénérer
l'image automatique, ou la supprimer.

### 3.6 Ingrédients

Les ingrédients sont eux aussi créés à la volée. Le nom saisi est normalisé
(minuscules, ligatures, singulier approximatif, parenthèses retirées) pour
éviter les doublons du type « œufs » et « oeuf ». Le libellé d'origine est
conservé sur la recette pour l'affichage.

L'image d'un nouvel ingrédient est récupérée en arrière-plan après la création
de la recette.

La page publique `/ingredients` sert à filtrer les recettes. L'administration
permet de renommer, de changer ou de régénérer l'image, et de supprimer.

### 3.7 Contributeurs

- `/chefs` liste les auteurs qui ont publié au moins un contenu visible.
- `/chef/:slug` est le profil public : avatar, nom, recettes visibles et
  temps de cuisson visibles (onglet `?tab=cooking-time`).
- Les classements « top » retiennent les dix auteurs ayant le plus de contenus
  publics.

Le profil public ne montre pas les favoris, la liste de courses ni les
contenus privés. Le filtrage privé/public du profil est fait dans le
navigateur après réception de la liste (voir les limites).

### 3.8 Favoris

Un utilisateur connecté enregistre des recettes et des temps de cuisson. Chaque
enregistrement porte une date `savedAt`.

Le profil (`/profile`) a trois onglets :

| Onglet               | URL                             | Contenu                                                           |
| -------------------- | ------------------------------- | ----------------------------------------------------------------- |
| Mes recettes         | `/profile`                      | Recettes créées par l'utilisateur, privées comprises              |
| Mes temps de cuisson | `/profile?tab=my-cooking-times` | Fiches créées par l'utilisateur                                   |
| Favoris              | `/profile?tab=saved`            | Recettes et fiches enregistrées, triées par date d'enregistrement |

Des filtres permettent de restreindre les favoris par type, catégorie et
visibilité.

### 3.9 Liste de courses

La liste (`/shopping-list`) est personnelle et réservée aux comptes connectés.
Elle mélange deux types d'éléments.

**Ingrédients issus d'une recette.** Depuis la fiche recette, chaque
ingrédient s'ajoute ou se retire. L'élément reste lié à la recette d'origine,
ce qui permet d'afficher le nom de la recette à côté de l'ingrédient. Le même
ingrédient peut figurer plusieurs fois s'il vient de recettes différentes.

**Produits libres.** L'utilisateur saisit un nom. Un produit peut être coché,
renommé, réordonné par glisser-déposer ou supprimé. Deux produits du même nom
(sans tenir compte de la casse) ne peuvent pas coexister.

La liste entière (ingrédients et produits) peut être vidée. Une liste vide
renvoie vers l'accueil.

### 3.10 Compte

**Inscription** (`/register`). Nom et mot de passe. Le nom doit commencer par
une lettre. Deux comptes ne peuvent pas partager le même nom ni le même slug.
L'inscription ne connecte pas automatiquement.

**Connexion** (`/login`). Nom et mot de passe. L'option « se souvenir de moi »
choisit la durée de conservation du jeton dans le navigateur (voir la section
authentification). Un jeton JWT est renvoyé ; il n'y a pas de cookie de
session.

**Profil** (`/profile-edit`). Modification du nom et de l'avatar, changement
du mot de passe (mot de passe actuel requis), suppression du compte.

La suppression du compte efface aussi les recettes et les temps de cuisson de
l'utilisateur, les ingrédients et catégories qui ne sont plus utilisés, les
images Cloudinary associées, puis nettoie les favoris et les listes de courses
des autres comptes qui pointaient vers ces contenus.

**Mot de passe oublié.** Il n'y a pas de demande autonome par e-mail. Un
administrateur génère un lien valable une heure. L'utilisateur ouvre
`/reset-password?token=...` et choisit un nouveau mot de passe. Le jeton est
à usage unique.

### 3.11 Partage et export PDF

Depuis une fiche, le partage propose :

- copier le lien de la page ;
- ouvrir WhatsApp avec ce lien ;
- générer un PDF dans le navigateur (`html2canvas` et `jsPDF`).

Le PDF est construit dans une iframe isolée pour éviter les conflits de
couleurs CSS, puis téléchargé. Il reprend le titre, les métadonnées (temps,
personnes ou température, appareil, mode) et, pour une recette, les
ingrédients et les étapes.

### 3.12 Administration

Les écrans `/admin*` exigent un compte dont le rôle est `admin`. Sinon,
l'application renvoie vers l'accueil. Une barre de navigation admin s'ajoute
au-dessus de la barre principale.

| URL                    | Fonction                                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `/admin`               | Compteurs (utilisateurs, recettes, temps de cuisson, catégories, ingrédients) et attribution des administrateurs par nom |
| `/admin/users`         | Liste des comptes, suppression, génération d'un lien de réinitialisation                                                 |
| `/admin/recipes`       | Liste complète, suppression unitaire et groupée                                                                          |
| `/admin/cooking-times` | Liste complète, suppression unitaire et groupée                                                                          |
| `/admin/categories`    | Renommage, remplacement d'image, régénération d'image, suppression                                                       |
| `/admin/ingredients`   | Renommage, remplacement d'URL d'image, régénération, suppression                                                         |

L'attribution des administrateurs remplace l'ensemble des rôles : les noms
sélectionnés deviennent `admin`, tous les autres redeviennent `user`.

### 3.13 Règles de visibilité

`visible` vaut `true` ou `false` sur chaque recette et chaque temps de
cuisson.

| Contexte                                                       | Ce qui est montré                                                          |
| -------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Visiteur non connecté                                          | Uniquement `visible: true`                                                 |
| Utilisateur connecté, listes « visibles » (accueil, recherche) | Les contenus publics des autres, plus tous les siens, y compris les privés |
| Fiche détail                                                   | Le propriétaire voit sa fiche privée ; les autres obtiennent l'écran privé |
| Profil public d'un chef                                        | Le frontend ne garde que les contenus `visible: true`                      |
| Profil personnel                                               | Tous les contenus de l'auteur                                              |
| Administration                                                 | Toutes les fiches, sans filtre de visibilité                               |

Les catégories et les auteurs « visibles » sont ceux qui apparaissent dans au
moins un contenu correspondant à ces règles.

### 3.14 Navigation

Barre fixe en bas de l'écran, largeur maximale calée sur un téléphone
(`max-w-lg`) :

| Icône     | URL              | Accès                                                     |
| --------- | ---------------- | --------------------------------------------------------- |
| Accueil   | `/`              | Public                                                    |
| Recherche | `/search`        | Public                                                    |
| Ajouter   | `/add`           | Connecté, sinon redirection vers `/login`                 |
| Courses   | `/shopping-list` | Connecté                                                  |
| Profil    | `/profile`       | Connecté ; l'icône affiche l'avatar si une session existe |

Le thème suit le réglage du système (clair ou sombre). L'interface tient
compte des encoches (`safe-area-inset`) et détecte un affichage en mode
application autonome.

Routes déclarées dans `frontend/src/Router.tsx` :

| URL                        | Écran                                | Accès                            |
| -------------------------- | ------------------------------------ | -------------------------------- |
| `/`                        | Accueil                              | Public                           |
| `/register`                | Inscription                          | Public                           |
| `/login`                   | Connexion                            | Public                           |
| `/reset-password`          | Nouveau mot de passe via jeton       | Public                           |
| `/search`                  | Recherche                            | Public                           |
| `/categories`              | Liste des catégories                 | Public                           |
| `/category/:slug`          | Détail d'une catégorie               | Public                           |
| `/ingredients`             | Filtre par ingrédients               | Public                           |
| `/chefs`                   | Liste des contributeurs              | Public                           |
| `/chef/:slug`              | Profil public                        | Public                           |
| `/recipe/:slug`            | Détail d'une recette                 | Public, avec garde de visibilité |
| `/cooking-time/:slug`      | Détail d'un temps de cuisson         | Public, avec garde de visibilité |
| `/profile`                 | Profil                               | Connecté                         |
| `/profile-edit`            | Édition du profil                    | Connecté                         |
| `/add`                     | Création recette ou temps de cuisson | Connecté                         |
| `/chat`                    | Assistant de cuisine Zest            | Connecté                         |
| `/recipe-edit/:slug`       | Édition d'une recette                | Connecté                         |
| `/cooking-time-edit/:slug` | Édition d'un temps de cuisson        | Connecté                         |
| `/shopping-list`           | Liste de courses                     | Connecté                         |
| `/admin` et sous-routes    | Administration                       | Administrateur                   |
| toute autre URL            | Page introuvable                     | Public                           |

### 3.15 Assistant de cuisine

L'écran `/chat` est réservé aux utilisateurs connectés. Il est accessible
depuis l'accueil et la recherche. L'utilisateur peut demander des recettes ou
des conseils à Zest ; les réponses sont affichées dans la conversation. Quand
une réponse contient une recette structurée, le bouton « Ajouter cette
recette » ouvre le formulaire `/add` avec les champs préremplis. La recette
n'est enregistrée qu'après validation du formulaire.

Lorsqu'une conversation vide est ouverte, Zest propose trois idées de recettes
aléatoires sous forme de boutons. Si la génération échoue ou ne renvoie pas
exactement trois noms distincts, l'interface affiche « Tarte aux pommes »,
« Gratin dauphinois » et « Crêpes ». Cliquer sur une suggestion envoie son nom
comme demande dans la conversation.

L'historique est conservé dans le stockage du navigateur : `localStorage` si
l'utilisateur a choisi de rester connecté, sinon `sessionStorage`. Le bouton
de suppression demande une confirmation (dialogue sur ordinateur, tiroir sur
mobile), puis vide la conversation et son historique local. La connexion et
la déconnexion réinitialisent également cet historique. Sur mobile, la zone
des messages défile indépendamment et le champ de saisie reste accessible
lorsque le clavier est ouvert.

## 4. Documentation technique

### 4.1 Architecture

```text
Navigateur (React, Vite)
        |  HTTPS, JSON ou multipart, en-tête Authorization: Bearer
        v
API Express  (/api/...)
        |                \
        v                 v
   MongoDB               Cloudinary, DeepL, Pixabay, Spoonacular, Gemini
```

Le frontend et le backend n'ont pas de monorepo outillé : chacun a son
`package.json`, son script de démarrage et sa configuration Vercel.

En développement, Vite proxifie `/api` vers `http://localhost:${APP_PORT}`
(`APP_PORT` par défaut `5000`). En production, `VITE_API_URL` pointe vers
l'API déployée.

Format de réponse habituel :

```json
{ "error": false, "message": "…", "data": {} }
```

Les erreurs métier renvoient `error: true`, un `message` en français et un
code HTTP 400, 401, 403, 404, 409 ou 500.

### 4.2 Pile technique

**Frontend**

| Outil                          | Usage                                                 |
| ------------------------------ | ----------------------------------------------------- |
| React 19, TypeScript, Vite 8   | Application et build                                  |
| React Router 7                 | Routes                                                |
| TanStack Query 5               | Cache serveur, 5 minutes de fraîcheur, 1 nouvel essai |
| Axios                          | Client HTTP                                           |
| Zod, @hookform/resolvers       | Validation des formulaires                            |
| Tailwind CSS 4, shadcn / Radix | Interface                                             |
| dnd-kit                        | Réordonnancement                                      |
| Framer Motion                  | Parallaxe des fiches                                  |
| html2canvas, jsPDF             | Export PDF                                            |
| browser-image-compression      | Compression côté client avant envoi                   |
| next-themes                    | Thème système                                         |
| sonner                         | Notifications                                         |

**Backend**

| Outil              | Usage                                      |
| ------------------ | ------------------------------------------ |
| Node.js, Express 5 | Serveur HTTP                               |
| Mongoose 9         | MongoDB                                    |
| jsonwebtoken       | JWT, expiration 7 jours                    |
| bcrypt             | Hachage, 10 tours de sel                   |
| multer             | Réception du fichier image en mémoire      |
| sharp              | Redimensionnement 1024 px, WebP qualité 80 |
| cloudinary         | Stockage des images                        |
| deepl-node         | Traduction français vers anglais           |
| axios              | Pixabay et Spoonacular                     |

Le backend ne déclare aucune suite de tests : `npm test` échoue volontairement.

### 4.3 Arborescence

```text
frontend/src/
  Router.tsx, AdminRoute.tsx, main.tsx
  context/          session (AuthContext)
  pages/            un écran par route
  components/       UI par domaine (recipe, cooking-time, profile, admin, chat, …)
  hooks/            requêtes et mutations TanStack Query (dont hooks/chat)
  services/         appels Axios
  schemas/          schémas Zod
  types/            contrats TypeScript
  lib/axiosInstance.ts
  utils/            PDF, collage, formatage, normalisation, historique et suggestions du chat
backend/
  server.js         démarrage local
  api/index.js      point d'entrée Vercel
  app.js            CORS, parseurs, montage des routeurs
  config/           MongoDB, Cloudinary
  models/           User, Recipe, CookingTime, Category, Ingredient, ChatQuota
  routes/           déclaration des URL
  controllers/      logique métier
  middlewares/      auth, authOptional, isAdmin
  utils/            JWT, mots de passe, images, slugs, traduction, nettoyage, quota du chat
.github/workflows/mongo-backup.yml
```

Convention frontend : un écran appelle un hook, le hook appelle un service, le
service appelle Axios. Les composants d'interface ne construisent pas les URL
d'API.

### 4.4 Modèle de données

Toutes les collections ont `createdAt` et `updatedAt`.

**User**

| Champ                             | Détail                                                 |
| --------------------------------- | ------------------------------------------------------ |
| `name`                            | Obligatoire, unique en pratique via le contrôleur      |
| `slug`                            | Dérivé du nom, indexé                                  |
| `password`                        | Hash bcrypt, retiré des réponses `GetMe` et des listes |
| `avatar`                          | URL Cloudinary                                         |
| `role`                            | `user` ou `admin`                                      |
| `savedRecipes[]`                  | `{ recipe, savedAt }`                                  |
| `savedCookingTimes[]`             | `{ cookingTime, savedAt }`                             |
| `savedIngredients[]`              | `{ ingredient, recipe, addedAt }`                      |
| `savedProducts[]`                 | `{ name, checked, addedAt }`                           |
| `resetToken`, `resetTokenExpires` | Réinitialisation, 1 heure                              |

Index : `slug`, `name`.

**Recipe**

| Champ                                   | Détail                                              |
| --------------------------------------- | --------------------------------------------------- |
| `name`, `slug`                          | Slug unique `{nom}_{4 derniers caractères de l'id}` |
| `ingredients[]`                         | `{ ingredient (ref), quantity, label }`             |
| `instructions[]`                        | `{ content }`                                       |
| `timePrep`, `timeCook`, `personsNumber` | Nombres, obligatoires au schéma                     |
| `categories[]`                          | Références Category                                 |
| `addedBy`                               | Référence User, obligatoire                         |
| `image`                                 | URL                                                 |
| `visible`                               | Booléen obligatoire                                 |

Index : `addedBy`, `categories`, `createdAt` descendant.

**CookingTime**

Mêmes principes d'identité (`name`, `slug`, `categories`, `addedBy`, `image`,
`visible`). Champs métier : `device` (texte), `degreeCook` (nombre),
`timeCook` (nombre), `methodCook` (texte), `notes` (texte).

**Category** : `name` unique, `slug` unique, `englishName`, `image`.

**Ingredient** : `name` unique, `normalizedName`, `englishName`, `url` (image).

Les favoris et la liste de courses vivent sur le document utilisateur, pas
dans des collections séparées.

**ChatQuota**

| Champ        | Détail                                        |
| ------------ | --------------------------------------------- |
| `period`     | Mois comptabilisé au format `AAAA-MM`, unique |
| `tokensUsed` | Tokens consommés pendant cette période        |

Cette collection suit l'utilisation mensuelle globale de l'assistant, et non
une consommation par utilisateur.

### 4.5 Authentification et autorisations

1. `POST /api/users/login` vérifie le nom et le mot de passe, puis signe
   `{ id, name, role }` avec `JWT_SECRET` pour 7 jours.
2. Le frontend stocke le jeton dans `localStorage` si « se souvenir de moi »
   est coché, sinon dans `sessionStorage`.
3. L'intercepteur Axios ajoute `Authorization: Bearer <token>` lorsqu'un
   jeton est présent.
4. `AuthContext` charge `GET /api/users/me` tant qu'un jeton existe. La
   déconnexion efface le jeton et le cache `me`.
5. `ProtectedRoute` redirige vers `/login`. `AdminRoute` redirige vers `/`
   si le rôle n'est pas `admin`.
6. `/chat` et `POST /api/chat` sont protégés par le middleware `auth`.

Deux middlewares backend :

- `auth` : jeton obligatoire, 401 s'il manque ou s'il est invalide ;
- `authOptional` : sans jeton, ou avec un jeton invalide, la requête continue
  en invité (`req.user` absent).

`isAdmin` s'applique après `auth` et répond 403 si `role !== "admin"`.

Contrôles d'écriture observés :

| Opération                                     | Règle réelle                                         |
| --------------------------------------------- | ---------------------------------------------------- |
| Modifier une recette ou une fiche             | Auteur ou administrateur                             |
| Supprimer une recette ou une fiche (unitaire) | Auteur uniquement, même un administrateur est refusé |
| Supprimer en lot (`DELETE /` avec `{ ids }`)  | Tout utilisateur authentifié, sans contrôle d'auteur |
| Afficher ou masquer                           | Tout utilisateur authentifié, sans contrôle d'auteur |
| Supprimer un compte par id                    | Tout utilisateur authentifié                         |
| Routes `/api/admins/*`                        | Administrateur                                       |

Ces écarts sont repris dans les limites.

### 4.6 API REST

Préfixe `/api`. « JWT » = middleware `auth`. « Optionnel » = `authOptional`.
Les créations et mises à jour avec image utilisent `multipart/form-data`,
champ fichier `image`. Les tableaux (`categories`, `ingredients`,
`instructions`) sont envoyés en JSON stringifié dans le formulaire.

#### Utilisateurs — `/api/users`

| Méthode | Chemin                                       | Accès     | Rôle                                                          |
| ------- | -------------------------------------------- | --------- | ------------------------------------------------------------- |
| POST    | `/register`                                  | Public    | Créer un compte. 409 si le nom ou le slug existe              |
| POST    | `/login`                                     | Public    | Renvoyer `{ data: { token } }`                                |
| GET     | `/top`                                       | Public    | 10 auteurs, triés par nombre de recettes publiques            |
| GET     | `/cooking-times-top`                         | Public    | 10 auteurs, triés par nombre de fiches publiques              |
| GET     | `/all`                                       | Public    | Tous les utilisateurs, avec `recipesCount`, sans mot de passe |
| GET     | `/visible`                                   | Optionnel | Auteurs de recettes visibles (ou des siennes si connecté)     |
| GET     | `/cooking-time-visible`                      | Optionnel | Même logique pour les temps de cuisson                        |
| GET     | `/me`                                        | JWT       | Compte courant, favoris et liste peuplés                      |
| GET     | `/:slug`                                     | Public    | Utilisateur par slug                                          |
| POST    | `/saved-recipes/:recipeId`                   | JWT       | Ajouter un favori                                             |
| DELETE  | `/saved-recipes/:recipeId`                   | JWT       | Retirer un favori                                             |
| POST    | `/saved-cooking-times/:cookingTimeId`        | JWT       | Ajouter un favori fiche                                       |
| DELETE  | `/saved-cooking-times/:cookingTimeId`        | JWT       | Retirer un favori fiche                                       |
| POST    | `/saved-ingredients/:recipeId`               | JWT       | Corps `{ ingredientId }`                                      |
| DELETE  | `/saved-ingredients/:recipeId/:ingredientId` | JWT       | Retirer l'ingrédient de cette recette                         |
| DELETE  | `/saved-ingredients`                         | JWT       | Vider ingrédients et produits                                 |
| PUT     | `/update`                                    | JWT       | Nom et avatar. Multipart                                      |
| PUT     | `/update-password`                           | JWT       | Corps `{ currentPassword, newPassword }`                      |
| POST    | `/reset-password`                            | Public    | Corps `{ token, newPassword }`                                |
| POST    | `/product`                                   | JWT       | Corps `{ name }`                                              |
| PUT     | `/product`                                   | JWT       | Renommer et/ou cocher                                         |
| DELETE  | `/product`                                   | JWT       | Retirer un produit                                            |
| PATCH   | `/product/reorder`                           | JWT       | Corps `{ orderedNames: string[] }`                            |
| DELETE  | `/:id`                                       | JWT       | Supprimer le compte ciblé et ses contenus                     |
| DELETE  | `/`                                          | JWT       | Supprimer le compte courant et ses contenus                   |

L'ordre des routes Express place `/me`, `/all`, `/visible` et les chemins
littéraux avant `/:slug` et `/:id`.

#### Assistant — `/api/chat`

| Méthode | Chemin | Accès | Rôle                                                                                        |
| ------- | ------ | ----- | ------------------------------------------------------------------------------------------- |
| POST    | `/`    | JWT   | Envoyer `{ messages: [{ role, content }] }` à Zest et recevoir `{ data: { text, recipe } }` |

`role` vaut `user` ou `assistant`. Le backend ne conserve pas le contenu des
conversations : l'historique est envoyé par le frontend à chaque requête. Seuls
les huit derniers messages sont transmis au modèle ; le dernier message
utilisateur est limité à 500 caractères. La réponse `recipe` est un brouillon
structuré ou `null`.

Le backend appelle Gemini avec `GEMINI_API_KEY`, essaie d'abord
`gemini-3.5-flash-lite`, puis `gemini-3.6-flash` en cas d'indisponibilité,
d'expiration ou de surcharge. Il suit les tokens consommés dans `ChatQuota`.
Le quota est partagé par tous les utilisateurs, renouvelé au début du mois
selon le calendrier `Europe/Paris`, et vaut par défaut 100 000 tokens. En cas
de quota dépassé, l'API renvoie HTTP 429 ; les erreurs de modèle renvoient une
réponse d'erreur 502 ou 503.

#### Administration — `/api/admins`

JWT et rôle `admin`.

| Méthode | Chemin                      | Rôle                                                                                                                              |
| ------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| GET     | `/all`                      | Comptes dont le rôle est `admin`                                                                                                  |
| PUT     | `/update`                   | Corps `{ admins: string[] }` de noms. Écrase les rôles de tous les comptes                                                        |
| POST    | `/users/:id/reset-password` | Crée un jeton 1 h et renvoie `{ data: { resetLink } }`. Aucun e-mail n'est envoyé ; le lien est aussi écrit dans les logs serveur |

#### Recettes — `/api/recipes`

| Méthode | Chemin            | Accès     | Rôle                                                                  |
| ------- | ----------------- | --------- | --------------------------------------------------------------------- |
| GET     | `/all`            | Public    | Toutes les recettes, y compris privées                                |
| GET     | `/`               | JWT       | Recettes de l'utilisateur connecté                                    |
| GET     | `/visibles`       | Optionnel | Publiques des autres + toutes les siennes si connecté                 |
| GET     | `/user/:id`       | Public    | Recettes d'un auteur, privées comprises                               |
| GET     | `/slug/:slug`     | Optionnel | Détail. Le filtre privé est ensuite appliqué par le frontend          |
| GET     | `/category/:slug` | Optionnel | Recettes de la catégorie. Voir la note ci-dessous                     |
| GET     | `/:id`            | Public    | Détail par identifiant                                                |
| POST    | `/`               | JWT       | Création. Multipart                                                   |
| PUT     | `/:slug`          | JWT       | Mise à jour. Auteur ou admin. Multipart                               |
| DELETE  | `/`               | JWT       | Corps `{ ids: string[] }`. Suppression groupée sans contrôle d'auteur |
| DELETE  | `/:id`            | JWT       | Suppression unitaire, auteur seulement                                |
| PATCH   | `/:id/show`       | JWT       | `visible: true`                                                       |
| PATCH   | `/:id/hide`       | JWT       | `visible: false`                                                      |

Le routeur déclare deux fois `GET /category/:slug`. Express conserve le
premier handler, `GetAllRecipesVisiblesByCategory` (publics, plus les siens
si connecté). Le handler `GetAllRecipesByCategory`, qui liste tout, n'est
jamais atteint.

Corps de création, champs formulaire :

- `name`, `timePrep`, `timeCook`, `personsNumber`, `visible` ;
- `categories` : JSON, tableau de noms ;
- `ingredients` : JSON, tableau `{ ingredient, quantity }` ;
- `instructions` : JSON, tableau `{ content }` ;
- `image` : fichier facultatif.

Le slug est calculé après le premier enregistrement, à partir du nom et des
quatre derniers caractères de l'identifiant MongoDB. Un changement de nom le
recalcule.

#### Temps de cuisson — `/api/cooking-times`

Miroir des recettes : `/all`, `/`, `/visibles`, `/user/:id`, `/slug/:slug`,
`/category/:slug` (doublon identique, le handler « visibles » gagne), `/:id`,
`POST /`, `PUT /:slug`, `DELETE /`, `DELETE /:id`, `PATCH /:id/show`,
`PATCH /:id/hide`.

Champs formulaire supplémentaires : `device`, `degreeCook`, `timeCook`,
`methodCook`, `notes`.

#### Catégories — `/api/categories`

| Méthode | Chemin                    | Accès     | Rôle                                                                             |
| ------- | ------------------------- | --------- | -------------------------------------------------------------------------------- |
| GET     | `/`                       | Public    | Toutes les catégories                                                            |
| GET     | `/visibles`               | Optionnel | Catégories présentes sur des recettes visibles, avec `recipesCount`              |
| GET     | `/cooking-times-visibles` | Optionnel | Même agrégat sur les temps de cuisson, avec `cookingTimesCount`                  |
| GET     | `/top`                    | Optionnel | Catégories de recettes les plus utilisées                                        |
| GET     | `/cooking-times-top`      | Optionnel | Catégories de fiches les plus utilisées                                          |
| GET     | `/slug/:slug`             | Public    | Une catégorie                                                                    |
| POST    | `/`                       | JWT       | Création explicite. La création habituelle passe par la publication d'un contenu |
| PATCH   | `/:id/name`               | JWT       | Renommer                                                                         |
| PATCH   | `/:id/url`                | JWT       | Remplacer l'URL d'image                                                          |
| PATCH   | `/:id/reset-url`          | JWT       | Régénérer l'image automatique                                                    |
| PATCH   | `/reset-url`              | JWT       | Régénérer une sélection                                                          |
| DELETE  | `/:id`                    | JWT       | Supprimer                                                                        |
| DELETE  | `/`                       | JWT       | Supprimer une sélection                                                          |

« URL » désigne ici l'image, pas le slug. Le slug est dérivé du nom.

#### Ingrédients — `/api/ingredients`

| Méthode | Chemin           | Accès     | Rôle                                                    |
| ------- | ---------------- | --------- | ------------------------------------------------------- |
| GET     | `/`              | Public    | Tous les ingrédients                                    |
| GET     | `/visibles`      | Optionnel | Ingrédients utilisés par des recettes visibles          |
| POST    | `/`              | JWT       | Créer si le nom n'existe pas, sinon renvoyer l'existant |
| PATCH   | `/:id/name`      | JWT       | Renommer                                                |
| PATCH   | `/:id/url`       | JWT       | Remplacer l'URL d'image                                 |
| PATCH   | `/:id/reset-url` | JWT       | Régénérer l'image                                       |
| PATCH   | `/reset-url`     | JWT       | Régénérer une sélection                                 |
| DELETE  | `/:id`           | JWT       | Supprimer                                               |
| DELETE  | `/`              | JWT       | Supprimer une sélection                                 |

#### Upload de test — `/api/upload`

`POST /test` accepte un fichier `image` et renvoie les métadonnées Multer.
Cette route ne compresse pas et n'envoie pas vers Cloudinary. Elle est
publique.

`GET /` à la racine de l'API répond `API running`.

### 4.7 Images

1. Le formulaire limite le fichier à 5 Mo et aux types JPEG, PNG et WebP, puis
   le compresse dans le navigateur.
2. Multer reçoit le buffer en mémoire.
3. Sharp redimensionne à 1024 px maximum et encode en WebP qualité 80.
4. Cloudinary stocke le fichier dans un dossier : `recipes`, `cookingTimes`,
   `ingredients` ou le dossier du profil.

Si aucune image n'est jointe à une recette, une fiche ou une catégorie :

1. DeepL traduit le nom du français vers l'anglais (`en-US`) et met le
   résultat en cache dans `englishName`.
2. Pixabay est interrogé (`q` = traduction + « food », 3 résultats,
   `safesearch`).
3. La première photo est recompressée puis envoyée à Cloudinary.
4. En cas d'échec, l'image reste nulle et la création du contenu continue.

Pour un ingrédient, le job `hydrateIngredientImages` tourne après la réponse
HTTP de création de recette. Il traduit le nom, interroge
`api.spoonacular.com/food/ingredients/search`, récupère le visuel CDN
Spoonacular et l'envoie dans le dossier Cloudinary `ingredients`. Un délai
sépare les appels. L'ancienne implémentation Pixabay est commentée dans le
même fichier.

À la mise à jour, remplacer l'image supprime l'ancienne sur Cloudinary. Retirer
l'image sans en fournir une nouvelle relance la recherche automatique.

La suppression d'un contenu, d'un compte, ou le nettoyage des ingrédients et
catégories orphelins détruit aussi les fichiers Cloudinary correspondants.
`CleanUsersOrphanData` retire ensuite des comptes les favoris et les
ingrédients de liste qui pointent vers des documents supprimés.

### 4.8 Catégories, ingrédients, slugs

**Catégories.** `resolveCategories` cherche le nom exact. S'il n'existe pas,
`translateCategoryCached` crée le document avec le nom français, le nom
anglais et le slug. L'image des nouvelles catégories est hydratée après la
réponse.

**Ingrédients.** `resolveIngredientsFast` est le chemin utilisé à la création
et à la mise à jour :

- retirer le contenu entre parenthèses ;
- passer en minuscules, replier `œ` / `æ` ;
- approximer un singulier (`poireaux` vers `poireau`, `œufs` vers `oeuf`) ;
- chercher par `normalizedName` ;
- créer si absent, avec un `name` singulier capitalisé ;
- stocker sur la recette la quantité et le `label` d'origine.

`resolveIngredients` (version lente avec image synchrone et pause d'une
seconde) existe encore mais n'est pas le chemin de création.

**Slugs.** `baseSlugify` retire accents et caractères spéciaux, remplace les
espaces par des tirets. Le slug utilisateur est ce résultat. Le slug d'une
recette ou d'une fiche est `{slug}_{4 derniers caractères de _id}`.

### 4.9 Frontend : flux de données

```text
Page
  -> hook (useQuery / useMutation)
       -> service (recipeService, userService, …)
            -> axiosInstance (baseURL = VITE_API_URL, Bearer automatique)
```

`AuthProvider` enveloppe l'application dans `main.tsx`, avec
`QueryClientProvider` et `ThemeProvider`. Le cache global considère une
requête fraîche pendant 5 minutes. La requête `me` a `staleTime: 0` : elle
est revalidée à chaque montage du contexte.

Les filtres d'accueil, de catégorie, de profil et de contributeur s'appliquent
en mémoire sur les tableaux déjà reçus. Ils ne provoquent pas de nouvel appel
avec des paramètres de filtre.

La recherche réutilise les hooks de listes visibles, normalise la chaîne
(`frontend/src/utils/normalize.ts`) et fait un `includes`.

Collage :

- `parseClipboardIngredients` reconnaît une quantité en tête de ligne
  (nombres, fractions, unités courantes en français) puis le nom ;
- `parseClipboardSteps` découpe les étapes.

Partage : dialogue sur grand écran, tiroir sur petit écran
(`useMediaQuery`).

### 4.10 Démarrage du serveur

`backend/server.js` charge `dotenv`, connecte MongoDB via `MONGO_URI`, puis
écoute `APP_PORT` ou `5000`. Sur Vercel, `backend/api/index.js` exporte
l'application Express sans appeler `listen`. `backend/vercel.json` redirige
toutes les URL vers ce fichier. `frontend/vercel.json` renvoie toutes les URL
vers `index.html` pour que le routeur client fonctionne.

CORS autorise `CLIENT_URL`, avec repli codé en dur vers une adresse LAN, et
`credentials: true`. Les méthodes autorisées sont GET, POST, PUT, PATCH,
DELETE et OPTIONS.

Une sauvegarde MongoDB hebdomadaire (dimanche 03:00 UTC, ou lancement manuel)
est définie dans `.github/workflows/mongo-backup.yml`. Elle exécute
`mongodump` avec le secret `MONGO_URI` et conserve l'archive 30 jours comme
artefact GitHub Actions.

### 4.11 Variables d'environnement

Les fichiers `.env` restent locaux et ne doivent pas être commités.

**Backend (`backend/.env`)**

| Variable                                                               | Rôle                                                                |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `MONGO_URI`                                                            | Connexion MongoDB                                                   |
| `APP_PORT`                                                             | Port local, défaut 5000                                             |
| `JWT_SECRET`                                                           | Signature des JWT                                                   |
| `CLIENT_URL`                                                           | Origine CORS autorisée                                              |
| `FRONTEND_URL`                                                         | Préfixe du lien de réinitialisation, défaut `http://localhost:5173` |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Stockage d'images                                                   |
| `DEEPL_API_KEY`                                                        | Traduction des noms                                                 |
| `PIXABAY_API_KEY`                                                      | Images recettes, fiches et catégories                               |
| `SPOONACULAR_API_KEY`                                                  | Images d'ingrédients                                                |
| `GEMINI_API_KEY`                                                       | Accès à Gemini pour l'assistant de cuisine                          |
| `CHAT_MONTHLY_TOKEN_LIMIT`                                             | Quota mensuel global du chat en tokens, défaut 100000               |

**Frontend (`frontend/.env`)**

| Variable       | Rôle                                                            |
| -------------- | --------------------------------------------------------------- |
| `VITE_API_URL` | Base Axios. En local, une valeur `/api` passe par le proxy Vite |
| `APP_PORT`     | Port ciblé par le proxy, lu par `vite.config.ts`, défaut 5000   |

Les variables `VITE_*` sont compilées dans le bundle navigateur. Elles ne
doivent pas contenir de secret.

### 4.12 Installation locale

Prérequis : Node.js, npm, une base MongoDB, et les clés des services utilisés
par les fonctions d'image et l'assistant (dont `GEMINI_API_KEY` si Zest doit
être disponible).

```powershell
cd backend
npm install
npm run dev
```

```powershell
cd frontend
npm install
npm run dev
```

Scripts utiles :

| Commande                       | Effet                     |
| ------------------------------ | ------------------------- |
| `backend` : `npm run dev`      | Nodemon sur `server.js`   |
| `backend` : `npm start`        | Node sans rechargement    |
| `frontend` : `npm run dev`     | Vite                      |
| `frontend` : `npm run build`   | `tsc -b` puis build Vite  |
| `frontend` : `npm run lint`    | ESLint                    |
| `frontend` : `npm run preview` | Prévisualisation du build |
