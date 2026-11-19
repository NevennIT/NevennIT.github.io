// Fiche détaillée de Lost Desktop : textes de la modal (onglets Aperçu, Fonctionnalités, Technique). Sources : NevennIT/lost-desktop (README, docs/architecture.md, docs/fonctionnement-windows.md, PR #2 et #5, src-tauri/src, workflows CI), 19/11/2026.
export default {
  // Accroche affichée sous le titre dans la modal (une phrase).
  tagline: {
    fr: "Ramène les fenêtres coincées sur un écran débranché et remet chaque fenêtre à sa place quand on rebranche.",
    en: 'Brings back windows stuck on an unplugged monitor, and puts every window back in place when you plug it in again.',
  },

  // Plateformes.
  platforms: ['Windows'],

  // Onglet Aperçu.
  overview: {
    fr: [
      "Avec plusieurs écrans, il arrive qu'une fenêtre reste bloquée sur un écran débranché ou éteint. Windows déplace normalement ses fenêtres, mais pas toujours : les fenêtres réduites et les applications qui mémorisent leur position se retrouvent à des coordonnées qui ne correspondent plus à aucun écran. On ne les voit plus et on ne peut plus les attraper.",
      "Lost Desktop liste toutes les fenêtres, ouvertes et réduites, repère celles qui sont hors de portée et les ramène : d'un clic, avec un raccourci clavier global, depuis la ligne de commande ou automatiquement quand un écran disparaît. Il sait aussi enregistrer la disposition de toutes les fenêtres dans un profil et la restaurer, en relançant au besoin les applications fermées.",
      "Il tourne discrètement dans la zone de notification. Il s'adresse à tous ceux qui branchent et débranchent des écrans : portable sur une station d'accueil, poste à plusieurs écrans, écran qu'on éteint le soir.",
      "La version 0.4.0 (novembre 2026) est disponible sous forme d'installateur Windows. Elle a ajouté une page Lanceur, la fermeture des applications avant une restauration et la protection des réglages par mot de passe.",
    ],
    en: [
      'With several monitors, a window sometimes gets stuck on a monitor that has been unplugged or turned off. Windows usually moves windows back, but not always: minimised windows and apps that remember their position end up at coordinates that no longer match any screen. You cannot see them, and you cannot grab them.',
      'Lost Desktop lists every window, open or minimised, spots the ones that are out of reach and brings them back: with a click, a global keyboard shortcut, from the command line, or automatically when a monitor goes away. It can also save the layout of all your windows in a profile and restore it, relaunching closed apps if needed.',
      'It runs quietly in the notification area. It is meant for anyone who plugs and unplugs monitors: a laptop on a docking station, a multi-monitor desk, a screen that gets switched off at night.',
      'Version 0.4.0 (November 2026) is available as a Windows installer. It added a Launcher page, closing apps before a restore, and password protection for the settings.',
    ],
  },

  // Onglet Fonctionnalités.
  features: [
    {
      title: { fr: 'Carte des écrans', en: 'Monitor map' },
      text: {
        fr: "Les écrans dessinés à l'échelle avec les fenêtres par-dessus ; les fenêtres perdues apparaissent en rouge dans une marge « hors écran ». Un bouton affiche un grand numéro sur chaque écran pour les identifier.",
        en: 'Monitors drawn to scale with the windows on top of them; lost windows show up in red in an off-screen margin. A button displays a large number on each monitor to tell them apart.',
      },
    },
    {
      title: { fr: 'Liste des fenêtres', en: 'Window list' },
      text: {
        fr: "Application, titre, état (normale, réduite, agrandie), écran et statut de chaque fenêtre, avec recherche et filtres (autres bureaux virtuels, fenêtres outils, fenêtres sans titre). Depuis la liste, on envoie une fenêtre sur un autre écran ou on la met au premier plan.",
        en: 'App, title, state (normal, minimised, maximised), monitor and status of each window, with search and filters (other virtual desktops, tool windows, untitled windows). From the list you can send a window to another monitor or bring it to the front.',
      },
    },
    {
      title: { fr: 'Rapatriement', en: 'Bringing windows back' },
      text: {
        fr: "La fenêtre est centrée sur l'écran cible, réduite si elle est trop grande, en cascade s'il y en a plusieurs, et garde son état : une fenêtre réduite le reste, une fenêtre agrandie est ré-agrandie sur le bon écran. Les derniers déplacements peuvent être annulés.",
        en: 'The window is centred on the target monitor, shrunk if it is too large, cascaded if there are several, and keeps its state: a minimised window stays minimised, a maximised one is maximised again on the right monitor. Recent moves can be undone.',
      },
    },
    {
      title: { fr: 'Sauvetage automatique', en: 'Automatic rescue' },
      text: {
        fr: "Quand un écran est débranché ou qu'une application s'ouvre hors écran, Lost Desktop agit selon le réglage choisi : automatiquement, après confirmation (bandeau et notification) ou pas du tout. Un écran peut aussi être marqué comme éteint : ses fenêtres sont rapatriées et plus aucune n'y est envoyée.",
        en: 'When a monitor is unplugged or an app opens off-screen, Lost Desktop acts according to your setting: automatically, after asking (banner and notification), or not at all. A monitor can also be marked as turned off: its windows are brought back and none are sent there any more.',
      },
    },
    {
      title: { fr: 'Profils de disposition', en: 'Layout profiles' },
      text: {
        fr: "Un profil mémorise la position de toutes les fenêtres. Il se restaure d'un clic, ou tout seul quand la même configuration d'écrans est détectée. Le détail du profil permet de retirer une fenêtre et de choisir l'ordre de superposition par glisser-déposer.",
        en: 'A profile records the position of every window. It is restored with one click, or on its own when the same monitor setup is detected. The profile details let you remove a window and set the stacking order by drag and drop.',
      },
    },
    {
      title: { fr: 'Applications relancées', en: 'Relaunching apps' },
      text: {
        fr: "Lors d'une restauration manuelle, les applications fermées sont rouvertes puis placées dès que leur fenêtre apparaît. Chaque fenêtre peut ouvrir un fichier ou une adresse web précise, ou reprendre sa ligne de commande mémorisée (option). Les applications du Microsoft Store sont prises en charge.",
        en: 'On a manual restore, closed apps are reopened and placed as soon as their window shows up. Each window can open a specific file or web address, or reuse its saved command line (optional). Microsoft Store apps are supported.',
      },
    },
    {
      title: { fr: 'Page Lanceur', en: 'Launcher page' },
      text: {
        fr: "Une grille de gros boutons, chacun associé à un profil, avec libellé, couleur et icône, affichable en plein écran. Elle peut s'ouvrir à chaque appel de Lost Desktop, ce qui permet de déclencher une disposition depuis un raccourci ou une console de boutons comme un Stream Deck.",
        en: 'A grid of large buttons, each tied to a profile, with a label, colour and icon, which can be shown full screen. It can open every time Lost Desktop is called, so a layout can be triggered from a shortcut or a button console such as a Stream Deck.',
      },
    },
    {
      title: { fr: 'Fermer les applications', en: 'Closing apps' },
      text: {
        fr: "Option par profil pour fermer les applications déjà ouvertes avant de restaurer, et bouton pour fermer celles qu'on sélectionne : « Fermer » leur laisse proposer d'enregistrer, « Forcer » arrête celles qui restent après un délai. L'Explorateur et les processus système sont exclus d'office, d'autres exclusions se règlent dans les paramètres.",
        en: 'A per-profile option to close the apps already open before restoring, and a button to close the ones you select: Close lets them offer to save, Force stops whatever is still running after a delay. Explorer and system processes are always excluded, and more exclusions can be set in the settings.',
      },
    },
    {
      title: { fr: 'Gestion protégée par mot de passe', en: 'Password-protected management' },
      text: {
        fr: "Créer, modifier ou supprimer des profils, configurer le lanceur et changer les paramètres peuvent exiger un mot de passe, alors que la restauration et le lanceur restent libres. C'est une barrière contre les erreurs, pas une sécurité forte. Un code de secours ou un compte administrateur Windows permet de s'en sortir en cas d'oubli.",
        en: "Creating, editing or deleting profiles, setting up the launcher and changing the settings can require a password, while restoring and the launcher stay open. It is a guard against mistakes, not strong security. A recovery code or a Windows administrator account gets you out if you forget it.",
      },
    },
    {
      title: { fr: 'Intégration à Windows', en: 'Windows integration' },
      text: {
        fr: "Raccourci global Ctrl+Alt+Win+R (modifiable), argument --rescue pour un raccourci bureau, icône et menu dans la zone de notification, démarrage avec Windows, notifications, journal d'activité. Les fenêtres d'applications lancées en administrateur sont signalées par un cadenas, avec une proposition de relancer Lost Desktop en administrateur.",
        en: 'Global shortcut Ctrl+Alt+Win+R (configurable), a --rescue argument for a desktop shortcut, a tray icon with its menu, start with Windows, notifications, activity log. Windows of apps running as administrator are marked with a padlock, with an offer to restart Lost Desktop as administrator.',
      },
    },
  ],

  // Onglet Technique.
  tech: {
    stack: [
      { name: 'Rust', role: { fr: "backend : lecture et déplacement des fenêtres, surveillance des écrans, profils", en: 'backend: reading and moving windows, watching monitors, profiles' } },
      { name: 'windows (crate)', role: { fr: 'API Win32 : fenêtres, écrans, DWM, bureaux virtuels, processus', en: 'Win32 API: windows, monitors, DWM, virtual desktops, processes' } },
      { name: 'Tauri 2', role: { fr: 'fenêtre, zone de notification, raccourci global, démarrage auto, instance unique', en: 'window, tray icon, global shortcut, autostart, single instance' } },
      { name: 'Vue 3 + TypeScript', role: { fr: 'interface : carte des écrans en SVG, tableaux, profils', en: 'interface: SVG monitor map, tables, profiles' } },
      { name: 'Naive UI, Pinia, vue-i18n', role: { fr: 'composants, état, français et anglais', en: 'components, state, French and English' } },
      { name: 'ts-rs', role: { fr: 'types TypeScript générés depuis les structures Rust', en: 'TypeScript types generated from the Rust structs' } },
      { name: 'argon2', role: { fr: 'hachage du mot de passe de gestion', en: 'hashing the management password' } },
      { name: 'GitHub Actions', role: { fr: 'vérifications sur chaque PR, installateur publié sur tag', en: 'checks on every PR, installer published on tag' } },
    ],
    sections: [
      {
        title: { fr: 'Architecture en couches', en: 'Layered architecture' },
        text: {
          fr: [
            "Le backend Rust est découpé en couches qui n'utilisent que celles du dessous. Les commandes appelées par l'interface ne contiennent aucune logique et délèguent aux services (sauvetage, profils, surveillance, zone de notification…). Les services s'appuient sur deux couches : core, des calculs purs (géométrie, règle de la fenêtre perdue, empreinte d'une configuration d'écrans, association des fenêtres d'un profil), et win32, l'accès à l'API Windows.",
            "Tout le code unsafe est confiné dans win32 et encapsulé dans des fonctions sûres. La logique de core se teste sans dépendre des fenêtres ouvertes sur la machine. Les structures partagées sont exportées en TypeScript par ts-rs, et la CI échoue si les types générés ne sont pas à jour.",
          ],
          en: [
            'The Rust backend is split into layers that only use the ones below them. Commands called by the interface hold no logic and delegate to services (rescue, profiles, monitoring, tray…). Services rest on two layers: core, pure computations (geometry, the lost-window rule, the fingerprint of a monitor setup, matching a profile with open windows), and win32, the access to the Windows API.',
            'All unsafe code is confined to win32 and wrapped in safe functions. The core logic can be tested without depending on the windows open on the machine. Shared structs are exported to TypeScript with ts-rs, and CI fails if the generated types are out of date.',
          ],
        },
      },
      {
        title: { fr: "Les pièges de l'API Windows", en: 'Windows API pitfalls' },
        text: {
          fr: [
            "Les positions sont lues et écrites avec GetWindowPlacement et SetWindowPlacement plutôt qu'avec SetWindowPos : c'est le seul moyen de changer l'endroit où une fenêtre réduite réapparaîtra sans la restaurer. Mais cette position normale est exprimée en coordonnées d'espace de travail, décalées quand la barre des tâches est en haut ou à gauche, sauf pour les fenêtres outils.",
            "D'autres détails ont demandé du travail : la bordure invisible d'environ 7 pixels des fenêtres Windows 10 et 11 (lue via DWM), les fenêtres « masquées » des autres bureaux virtuels, les applications du Store dont la fenêtre appartient à un processus hôte, l'identifiant d'écran qui change à chaque rebranchement (remplacé par le chemin stable du périphérique), et le message de changement d'écran qui n'arrive pas aux fenêtres message-only, d'où une vraie fenêtre jamais affichée.",
            "Une application figée pourrait bloquer Lost Desktop pendant un déplacement : ces fenêtres sont repérées et ignorées, et les autres sont déplacées en mode asynchrone. Les fenêtres d'applications lancées en administrateur sont hors d'atteinte d'un programme normal (UIPI) : elles sont détectées par leur jeton de sécurité.",
          ],
          en: [
            'Positions are read and written with GetWindowPlacement and SetWindowPlacement rather than SetWindowPos: it is the only way to change where a minimised window will reappear without restoring it. But that normal position is expressed in workspace coordinates, which are offset when the taskbar sits at the top or on the left, except for tool windows.',
            'Other details took some work: the invisible border of about 7 pixels on Windows 10 and 11 windows (read through DWM), cloaked windows on other virtual desktops, Store apps whose window belongs to a host process, a monitor handle that changes every time it is plugged back in (replaced by the device’s stable path), and the display-change message that never reaches message-only windows, hence a real window that is never shown.',
            'A hung app could block Lost Desktop during a move: such windows are detected and skipped, and the others are moved asynchronously. Windows of apps running as administrator are out of reach for a normal program (UIPI): they are detected through their security token.',
          ],
        },
      },
      {
        title: { fr: 'Quand une fenêtre est-elle perdue ?', en: 'When is a window lost?' },
        text: {
          fr: [
            "Une fenêtre est considérée comme perdue quand on ne peut plus l'attraper : il faut qu'au moins 100 pixels de sa barre de titre (ou la moitié pour une petite fenêtre) soient visibles dans la zone de travail d'un écran actif. Un écran marqué comme éteint ne compte pas.",
            "Windows envoie souvent plusieurs messages en rafale quand on branche ou débranche un écran : Lost Desktop attend deux secondes de calme avant d'agir. Pour les fenêtres qui apparaissent hors écran, les événements WinEvents sont regroupés de la même façon. Le sauvetage automatique ne touche que les fenêtres d'applications : certaines placent volontairement leurs fenêtres outils hors écran.",
          ],
          en: [
            'A window counts as lost when you can no longer grab it: at least 100 pixels of its title bar (or half of it for a small window) must be visible in the work area of an active monitor. A monitor marked as turned off does not count.',
            'Windows often fires several messages in a burst when a monitor is plugged in or out: Lost Desktop waits for two quiet seconds before acting. For windows that appear off-screen, WinEvents are grouped the same way. Automatic rescue only touches application windows: some apps deliberately park their tool windows off-screen.',
          ],
        },
      },
      {
        title: { fr: 'Restaurer un profil', en: 'Restoring a profile' },
        text: {
          fr: [
            "Les fenêtres déjà ouvertes sont d'abord associées au profil et replacées. Les applications manquantes sont ensuite lancées une par une pour un même exécutable : on attend la fenêtre du lancement précédent avant le suivant, pour ne pas dupliquer les fenêtres d'un navigateur ou d'un éditeur qui rouvre toute sa session. Les nouvelles fenêtres sont placées dès qu'elles apparaissent, puis replacées une dernière fois un peu plus tard, car beaucoup d'applications se repositionnent elles-mêmes juste après leur ouverture.",
            "Les applications du Store ne se lancent pas par leur exécutable (leur dossier est verrouillé) : leur identifiant d'application est mémorisé et elles passent par l'API d'activation de Windows, avec un repli par l'Explorateur. Les navigateurs reçoivent l'option « nouvelle fenêtre », sinon l'adresse s'ouvrirait en onglet et il n'y aurait rien à placer. Enfin, l'ordre de superposition du profil est appliqué sans activer de fenêtre.",
          ],
          en: [
            'Windows that are already open are first matched with the profile and moved into place. Missing apps are then launched one at a time per executable: the window from the previous launch is awaited before the next one, so a browser or editor that reopens its whole session does not end up with duplicate windows. New windows are placed as soon as they appear, then placed once more a little later, because many apps reposition themselves right after opening.',
            'Store apps cannot be launched through their executable (their folder is locked): their application id is saved and they go through the Windows activation API, with a fallback through Explorer. Browsers get their new-window flag, otherwise the address would open as a tab and there would be nothing to place. Finally, the profile’s stacking order is applied without activating any window.',
          ],
        },
      },
      {
        title: { fr: 'Qualité et publication', en: 'Quality and releases' },
        text: {
          fr: [
            "Chaque pull request passe par une CI GitHub Actions : Prettier, ESLint, vue-tsc, tests Vitest, build Vite, rustfmt, clippy sans aucun avertissement toléré, tests Rust et vérification des types générés. La logique pure est testée côté Rust et côté interface.",
            "Pousser un tag de version déclenche la construction de l'installateur Windows (NSIS) et sa publication dans une release ; le numéro de version est pris dans le tag. L'installation se fait pour l'utilisateur courant, sans droits administrateur. Les réglages et profils sont des fichiers JSON écrits de façon atomique, migrés automatiquement après une copie de sauvegarde quand leur format change.",
          ],
          en: [
            'Every pull request goes through GitHub Actions CI: Prettier, ESLint, vue-tsc, Vitest tests, Vite build, rustfmt, clippy with zero warnings allowed, Rust tests and a check of the generated types. Pure logic is tested on both the Rust and the interface side.',
            'Pushing a version tag builds the Windows installer (NSIS) and publishes it in a release; the version number is taken from the tag. It installs for the current user, with no admin rights. Settings and profiles are JSON files written atomically, and migrated automatically after a backup copy when their format changes.',
          ],
        },
      },
    ],
  },

  // Médias en plus des captures de la carte.
  media: [],

  // Proposition de phrase courte pour la carte de la grille.
  card: {
    fr: "Rapatrie les fenêtres perdues sur un écran débranché ou éteint, et restaure la disposition de vos fenêtres, applications fermées comprises.",
    en: 'Brings back windows lost on an unplugged or turned-off monitor, and restores your window layout, closed apps included.',
  },
}
