# NevennIT.github.io

Portfolio NevennIT : une page unique en Vue 3 + Vite, avec une scène de particules 3D, un triskell en volume, des cartes projet inclinables et un défilement fluide Lenis. Thèmes sombre et clair. Publié sur [nevennit.github.io](https://nevennit.github.io).

## Développer

```bash
npm install
npm run dev
```

`npm run build` produit le site dans `dist/`, `npm run preview` le sert en local.

## Modifier le contenu

| Quoi | Où |
| --- | --- |
| Projets (titre, phrase, type, statut, stack, captures, téléchargement) | `src/data/projects.js` — captures dans `public/projects/` |
| Captures : conversion en WebP 1600 × 1000 | `npm run images` (PNG/JPG de `public/projects/` → `.webp`) |
| Textes de l'interface, en français et en anglais | `src/i18n/messages/` |
| Liens, e-mail, service du formulaire, sections affichées | `src/config.js` |
| Fiches détaillées (modal : aperçu, fonctionnalités, technique, médias, vidéos) | `src/data/details/<id>.js` — schéma dans `src/data/details/README.md` |
| Parcours (expériences, formation, compétences) | `src/data/parcours.js` ; affiché en ligne quand `sections.parcours` vaut `true` |
| Liens de la navigation | `navLinks` dans `src/config.js` |

Le formulaire de contact poste vers un service tiers (GitHub Pages ne sait pas envoyer de mail) : créer un formulaire sur [Formspree](https://formspree.io), puis coller son URL dans `formEndpoint`. Tant que ce champ est vide, le formulaire indique qu'il n'est pas encore relié.

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
