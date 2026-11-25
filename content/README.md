# Contenu du portfolio

Tout le contenu modifiable du site est ici, en JSON, à modifier dans VS Code.
Une fois la modification poussée sur `main`, le site se met à jour tout seul (environ 2 minutes).

| Fichier | Contenu |
| --- | --- |
| `projects/<id>.json` | Une carte de la grille : nom, phrase, type, statut, technos, captures, téléchargement |
| `fiches/<id>.json` | La fiche qui s'ouvre au clic : aperçu, fonctionnalités, technique, historique, vidéos |
| `parcours.json` | Expériences, formation, compétences, et l'interrupteur « afficher sur le site » |
| `site.json` | E-mail, formulaire de contact, phrases d'accueil et titres des sections |

Règles à retenir :

- Un projet et sa fiche portent le **même identifiant** (`id`), qui sert aussi dans l'adresse `#/projet/<id>`.
- Les textes sont en `{ "fr": "…", "en": "…" }` ; si l'anglais est vide, le français s'affiche.
- Les images vont dans `public/projects/` (chemin `/projects/nom.webp`). Les PNG/JPG sont convertis en WebP
  au déploiement (et en local avec `npm run images`).
- Les versions des applications ne se saisissent pas : elles sont lues dans les releases GitHub, toutes les heures.
