# Contenu du portfolio

Tout le contenu modifiable du site est ici, en JSON. Le plus simple est de le modifier depuis **Pages CMS**
(https://app.pagescms.org, connexion avec GitHub) : ses formulaires sont décrits dans `.pages.yml`.
Chaque enregistrement crée un commit sur `main` et le site se met à jour tout seul (environ 2 minutes).
Mode d'emploi complet : `docs/guide-portfolio.pdf`.

| Fichier | Contenu | Formulaire Pages CMS |
| --- | --- | --- |
| `projects/<id>.json` | Une carte de la grille : nom, phrase, type, statut, technos, captures, téléchargement | Projets |
| `fiches/<id>.json` | La fiche qui s'ouvre au clic : aperçu, fonctionnalités, technique, historique, vidéos | Fiches détaillées |
| `parcours.json` | Expériences, formation, compétences, et l'interrupteur « afficher sur le site » | Parcours |
| `site.json` | E-mail, formulaire de contact, phrases d'accueil et titres des sections | Textes et réglages |

Règles à retenir :

- Un projet et sa fiche portent le **même identifiant** (`id`), qui sert aussi dans l'adresse `#/projet/<id>`.
- Les textes sont en `{ "fr": "…", "en": "…" }` ; si l'anglais est vide, le français s'affiche.
- Les images vont dans `public/projects/` (chemin `/projects/nom.webp`). Les PNG/JPG sont convertis en WebP
  au déploiement (et en local avec `npm run images`).
- Les versions des applications ne se saisissent pas : elles sont lues dans les releases GitHub, toutes les heures.
