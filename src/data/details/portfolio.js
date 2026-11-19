// Fiche détaillée du Portfolio NevennIT : textes de la modal (onglets Aperçu, Technique). Sources : NevennIT/NevennIT.github.io (dossier local : README, src/, scripts/, .github/workflows/deploy.yml), 19/11/2026.
export default {
  // Accroche affichée sous le titre dans la modal (une phrase).
  tagline: {
    fr: "Le site que vous lisez : une page Vue 3 dont les effets sont écrits à la main, sans bibliothèque d'animation.",
    en: 'The site you are reading: a single Vue 3 page whose effects are hand-written, with no animation library.',
  },

  // Plateformes.
  platforms: ['Web'],

  // Onglet Aperçu.
  overview: {
    fr: [
      "Ce site présente les projets NevennIT : des applications de bureau et des outils sur mesure. C'est une seule page, en français et en anglais, avec un thème sombre et un thème clair : un accueil, la grille des projets (filtrable par type, technologie et statut, avec un carrousel de captures) et un formulaire de contact.",
      "Le parti pris est de garder très peu de dépendances (Vue et Lenis à l'exécution) et d'écrire les effets soi-même : une sphère de particules en Canvas sur l'accueil, et le logo, un triskell, qui suit le défilement d'un bout à l'autre de la page, explose en éclats, passe en fil de fer et se recompose dans le pied de page.",
      "Le site est publié sur GitHub Pages et son code est public.",
    ],
    en: [
      'This site presents the NevennIT projects: desktop apps and custom tools. It is a single page, in French and English, with a dark and a light theme: a home section, the project grid (filterable by type, technology and status, with a screenshot carousel) and a contact form.',
      'The idea is to keep dependencies to a minimum (Vue and Lenis at runtime) and to write the effects by hand: a Canvas particle sphere on the home section, and the logo, a triskelion, which follows the scroll from one end of the page to the other, shatters into shards, turns into a wireframe and comes back together in the footer.',
      'The site is published on GitHub Pages and its code is public.',
    ],
  },

  // Pas une application : pas d'onglet Fonctionnalités.
  features: [],

  // Onglet Technique.
  tech: {
    stack: [
      { name: 'Vue 3', role: { fr: 'composants et directives pour les effets', en: 'components and directives for the effects' } },
      { name: 'Vite', role: { fr: 'développement et build', en: 'development and build' } },
      { name: 'Lenis', role: { fr: 'défilement fluide', en: 'smooth scrolling' } },
      { name: 'Canvas 2D', role: { fr: 'sphère de particules', en: 'particle sphere' } },
      { name: 'SVG et transformations CSS 3D', role: { fr: 'triskell en volume, éclats et fil de fer', en: 'triskelion in volume, shards and wireframe' } },
      { name: 'View Transitions API', role: { fr: 'bascule de thème en cercle', en: 'circular theme switch' } },
      { name: 'sharp', role: { fr: 'conversion des captures en WebP', en: 'converting screenshots to WebP' } },
      { name: 'GitHub Actions + Pages', role: { fr: 'build et publication à chaque push', en: 'build and publish on every push' } },
      { name: 'Formspree', role: { fr: 'envoi du formulaire de contact (le site est statique)', en: 'sending the contact form (the site is static)' } },
    ],
    sections: [
      {
        title: { fr: 'Organisation', en: 'Structure' },
        text: {
          fr: [
            "Les couleurs, la typographie et les effets viennent du design system NevennIT : les tokens CSS en sont générés, et ses effets (inclinaison des cartes, boutons aimantés, particules, progression au défilement) sont portés dans un module JavaScript que des directives Vue branchent sur le DOM (v-tilt, v-magnetic, v-reveal, v-progress).",
            "Le contenu est séparé du code : les projets et leurs fiches sont des fichiers de données bilingues, et les textes de l'interface sont dans des fichiers de messages. La traduction est une petite fonction maison, sans dépendance : la langue vient du choix mémorisé ou, à défaut, de celle du navigateur, et le titre et la description de la page suivent.",
          ],
          en: [
            'Colours, typography and effects come from the NevennIT design system: the CSS tokens are generated from it, and its effects (card tilt, magnetic buttons, particles, scroll progress) are ported into a JavaScript module that Vue directives attach to the DOM (v-tilt, v-magnetic, v-reveal, v-progress).',
            "Content is kept apart from code: projects and their detail pages are bilingual data files, and interface strings live in message files. Translation is a small home-made function with no dependency: the language comes from the saved choice or, failing that, from the browser, and the page title and description follow.",
          ],
        },
      },
      {
        title: { fr: 'Le triskell qui traverse la page', en: 'The triskelion that crosses the page' },
        text: {
          fr: [
            "Le logo vit dans une seule couche fixe, pilotée par une seule boucle requestAnimationFrame qui lit la position de défilement. Les positions des sections ne sont mesurées qu'au redimensionnement ; entre deux, tout est calculé. Il part de l'accueil, traverse l'écran sur une courbe en huit (une courbe de Lissajous) en culbutant sur trois axes, éclate à l'entrée des projets, passe en fil de fer après un court effet de glitch, puis se pose dans le pied de page.",
            "Les éclats sont des cellules de Voronoï calculées sans bibliothèque : des points sont semés à l'intérieur du tracé du logo, choisis pour être bien répartis, puis chaque cellule est obtenue en découpant un rectangle par les demi-plans qui la séparent des autres. Le générateur pseudo-aléatoire est déterministe, si bien que le logo se brise de la même façon à chaque visite.",
            "Pour rester fluide, la boucle n'écrit un style que si sa valeur a changé, et elle démarre après celle de Lenis pour lire une position de défilement à jour, sans décalage d'une image.",
          ],
          en: [
            'The logo lives in a single fixed layer, driven by a single requestAnimationFrame loop that reads the scroll position. Section positions are only measured on resize; everything in between is computed. It leaves the home section, crosses the screen along a figure-eight (a Lissajous curve) while tumbling on three axes, shatters as the projects come in, turns into a wireframe after a short glitch effect, and finally settles in the footer.',
            'The shards are Voronoi cells computed without any library: points are seeded inside the logo outline, picked to be evenly spread, and each cell is obtained by clipping a rectangle with the half-planes that separate it from the others. The pseudo-random generator is deterministic, so the logo breaks the same way on every visit.',
            'To stay smooth, the loop only writes a style when its value has changed, and it starts after the Lenis loop so it reads an up-to-date scroll position, with no one-frame lag.',
          ],
        },
      },
      {
        title: { fr: 'La sphère de particules', en: 'The particle sphere' },
        text: {
          fr: [
            "Quelques centaines de points (moins sur un écran tactile) sont répartis sur une sphère selon une spirale de Fibonacci, puis projetés en perspective dans un Canvas 2D. La sphère respire, tourne, suit le pointeur, s'écarte autour de lui et se disperse quand on fait défiler la page. Ses couleurs sont lues dans les tokens CSS, ce qui lui permet de suivre le thème.",
          ],
          en: [
            'A few hundred points (fewer on a touch screen) are spread over a sphere along a Fibonacci spiral, then projected in perspective onto a 2D canvas. The sphere breathes, spins, follows the pointer, moves aside around it and scatters as you scroll down. Its colours are read from the CSS tokens, so it follows the theme.',
          ],
        },
      },
      {
        title: { fr: 'Chargement, thème et accessibilité', en: 'Loading, theme and accessibility' },
        text: {
          fr: [
            "Le thème et la langue sont posés par un petit script dans le HTML avant le premier rendu, pour éviter un flash de la mauvaise couleur. L'écran de chargement attend que l'application soit montée et les polices prêtes, et les apparitions au défilement attendent qu'il se soit retiré ; un délai de sécurité le retire de toute façon si quelque chose échoue.",
            "Quand le système demande de réduire les animations, Lenis, les inclinaisons et les animations sont coupés et le logo reste immobile : le contenu, lui, ne change pas.",
          ],
          en: [
            'Theme and language are set by a small script in the HTML before the first render, to avoid a flash of the wrong colours. The loading screen waits for the app to be mounted and the fonts to be ready, and scroll reveals wait for it to be gone; a safety timeout removes it anyway if something fails.',
            'When the system asks for reduced motion, Lenis, tilts and animations are turned off and the logo stays still: the content itself does not change.',
          ],
        },
      },
      {
        title: { fr: 'Build et publication', en: 'Build and publishing' },
        text: {
          fr: [
            "Chaque push sur la branche principale lance un workflow GitHub Actions qui construit le site avec Vite et le publie sur GitHub Pages. Un script Node basé sur sharp convertit les captures des projets en WebP de 1 600 × 1 000 pixels (16:10), recadrées sur le haut, là où se trouvent les barres de titre et les menus.",
          ],
          en: [
            'Every push to the main branch runs a GitHub Actions workflow that builds the site with Vite and publishes it on GitHub Pages. A Node script based on sharp converts project screenshots to 1600 × 1000 WebP images (16:10), cropped from the top, where title bars and menus are.',
          ],
        },
      },
    ],
  },

  // Médias en plus des captures de la carte.
  media: [],

  // Proposition de phrase courte pour la carte de la grille.
  card: {
    fr: "Ce site : une page Vue 3 avec une sphère de particules en Canvas, un triskell qui traverse la page en éclatant, et un défilement Lenis.",
    en: 'This site: a single Vue 3 page with a Canvas particle sphere, a triskelion that shatters its way down the page, and Lenis smooth scrolling.',
  },
}
