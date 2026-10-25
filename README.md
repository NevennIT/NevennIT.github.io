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
| Projets (titre, phrase, stack, lien, capture) | `src/data/projects.js` — captures dans `public/projets/` |
| Accroche, liens, service du formulaire | `src/config.js` |
| Liens de la navigation | `navLinks` dans `src/config.js` |

Le formulaire de contact poste vers un service tiers (GitHub Pages ne sait pas envoyer de mail) : créer un formulaire sur [Formspree](https://formspree.io), puis coller son URL dans `formEndpoint`. Tant que ce champ est vide, le formulaire indique qu'il n'est pas encore relié.

## Design system

Couleurs, typographie, espacements et effets viennent du design system NevennIT :

- `src/styles/tokens.css` est généré depuis ses tokens (ne pas l'éditer à la main) ;
- `src/styles/nevennit.css` reprend sa feuille de composants ;
- `src/lib/motion.js` porte ses effets (inclinaison, aimant, particules, progression de défilement) ; les directives `v-tilt`, `v-magnetic`, `v-reveal` et `v-progress` les branchent dans les composants.

Avec « réduire les animations » activé dans le système, Lenis, les inclinaisons et les animations sont coupés ; le contenu reste identique.

## Déploiement

Chaque push sur `main` lance `.github/workflows/deploy.yml`, qui construit le site et le publie sur GitHub Pages. À faire une seule fois dans le dépôt : **Settings → Pages → Build and deployment → Source : GitHub Actions**.
