# Fiches détaillées des projets

Un fichier `<id>.js` par projet (même `id` que dans `src/data/projects.js`), qui exporte par défaut les textes de la modal. Textes bruts uniquement (ni HTML ni Markdown). Un texte bilingue s'écrit `{ fr, en }`.

| Champ | Forme | Rôle |
| --- | --- | --- |
| `tagline` | `{ fr, en }` | Une phrase sous le titre de la modal |
| `platforms` | `string[]` | Étiquettes : `'Windows'`, `'Android'`, `'Web'`… |
| `overview` | `{ fr: string[], en: string[] }` | Onglet Aperçu, 2 à 4 paragraphes |
| `features` | `[{ title: { fr, en }, text: { fr, en } }]` | Onglet Fonctionnalités ; `[]` si ce n'est pas une application |
| `roadmap` | `[{ fr, en }]` | Facultatif : prévu, pas encore fait |
| `tech.stack` | `[{ name, role: { fr, en } }]` | Technologies et leur rôle |
| `tech.sections` | `[{ title: { fr, en }, text: { fr: string[], en: string[] } }]` | Onglet Technique, 3 à 6 sections |
| `history` | `[{ year, title: { fr, en }, text: { fr, en }, image? }]` | Facultatif : étapes du projet |
| `media` | `[{ type: 'image', src, caption: { fr, en } } \| { type: 'video', src, poster } \| { type: 'youtube', id }]` | Médias en plus des captures de la carte |
| `card` | `{ fr, en }` | Proposition de texte court pour la carte (≤ 180 caractères), recopiée à la main dans `projects.js` |

Règle de contenu : chaque affirmation vient du dépôt du projet (README, docs, code, notes de version). Aucun extrait de code des dépôts privés ; pour Gantt-V, aucun nom d'entreprise, de site ou de client.
