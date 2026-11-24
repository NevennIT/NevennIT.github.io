# NevennIT.github.io

Portfolio NevennIT : une page unique en Vue 3 + Vite, avec une scène de particules 3D, un triskell en volume, des cartes projet inclinables et un défilement fluide Lenis. Thèmes sombre et clair. Publié sur [nevennit.github.io](https://nevennit.github.io).

## Développer

```bash
npm install
npm run dev
```

`npm run build` produit le site dans `dist/`, `npm run preview` le sert en local.

## Modifier le contenu

Le plus simple : **Pages CMS** (https://app.pagescms.org, connexion avec GitHub), des formulaires pour les projets, les fiches détaillées, le parcours et les textes. Chaque enregistrement met le site à jour tout seul. Mode d'emploi pas à pas : [docs/guide-portfolio.pdf](docs/guide-portfolio.pdf).

À la main, tout le contenu est en JSON dans `content/` (détail dans [content/README.md](content/README.md)) :

| Quoi | Où |
| --- | --- |
| Projets (cartes de la grille) | `content/projects/<id>.json` — captures dans `public/projects/` |
| Fiches détaillées (aperçu, fonctionnalités, technique, vidéos) | `content/fiches/<id>.json` |
| Parcours | `content/parcours.json` (`visible` : affiché sur le site publié) |
| E-mail, formulaire, phrases d'accueil | `content/site.json` |
| Autres textes de l'interface (FR/EN) | `src/i18n/messages/` |
| Captures : conversion en WebP 1600 × 1000 | `npm run images` (aussi fait au déploiement) |

## Suivi

Page privée, absente du menu : [nevennit.github.io/#/suivi](https://nevennit.github.io/#/suivi) — versions affichées, téléchargements, déploiements et historique du site. Chaque nouvelle version en ligne ouvre (et referme) un ticket dans ce dépôt : GitHub l'envoie par e-mail si le dépôt est suivi (**Watch → All Activity**).

## Design system

Couleurs, typographie, espacements et effets viennent du design system NevennIT :

- `src/styles/tokens.css` est généré depuis ses tokens (ne pas l'éditer à la main) ;
- `src/styles/nevennit.css` reprend sa feuille de composants ;
- `src/lib/motion.js` porte ses effets (inclinaison, aimant, particules, progression de défilement) ; les directives `v-tilt`, `v-magnetic`, `v-reveal` et `v-progress` les branchent dans les composants.

Avec « réduire les animations » activé dans le système, Lenis, les inclinaisons et les animations sont coupés ; le contenu reste identique.

## Versions et téléchargements

Les dépôts des applications sont privés : `npm run releases` (lancé par le déploiement) lit leurs dernières releases avec un token et les écrit dans `src/data/releases.json` (versions, dates, notes ; aucune URL de fichier privé). À faire une fois : créer un token GitHub *fine-grained* en lecture seule (**Contents : Read**) sur les dépôts des projets et l'enregistrer dans ce dépôt comme secret Actions `RELEASES_TOKEN`. Sans lui, le fichier commité est gardé tel quel. Une nouvelle version publiée dans un dépôt apparaît sur le site dans l'heure : le déploiement vérifie les releases toutes les heures et ne republie le site que si elles ont changé. En local : `GH_TOKEN=$(gh auth token) npm run releases`.

Les téléchargements gratuits passent par un dépôt **public** qui ne contient que les installateurs (ex. [NevennIT/lost-desktop-releases](https://github.com/NevennIT/lost-desktop-releases)), alimenté par la CI du dépôt privé. Dans `projects.js`, `download: { soon: true }` affiche « Bientôt disponible » et `download: { buy: 'https://…' }` un bouton d'achat.

## Déploiement

Chaque push sur `main` lance `.github/workflows/deploy.yml`, qui construit le site et le publie sur GitHub Pages. À faire une seule fois dans le dépôt : **Settings → Pages → Build and deployment → Source : GitHub Actions**.
