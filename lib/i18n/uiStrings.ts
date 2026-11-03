/**
 * Interface copy that doesn't come from the CMS: the labels, counters and
 * fallbacks the site needs around CMS content (header and menu, posts index,
 * carousels and galleries, pricing, docs and changelog chrome, footer headings,
 * share and copy buttons, the newsletter form, the Draft Mode toggle, the 404).
 *
 * Content stays in DatoCMS. These strings exist only where a route or a
 * component has no record to read them from. The module is plain data plus
 * pure functions, so it runs on the server, in client islands and in the
 * draft-mode RealTime tree: a component that knows the locale calls uiString()
 * itself, and a few server parents resolve labels once and pass them to their
 * client islands as props.
 *
 * Add a key to `en` first: its type defines the keys, and every other locale
 * must then have it too. A locale the site adds later reads in English.
 */

/** A count-dependent string, chosen with Intl.PluralRules from `vars.n` */
type Plural = { one: string; other: string };
type Entry = string | Plural;

/** Every locale has the same keys as `en`, and a plural key stays plural */
type Dictionary = {
  [Key in UiStringKey]: (typeof en)[Key] extends Plural ? Plural : string;
};
type UiStringKey = keyof typeof en;

const en = {
  // Header, menu sheet and announcement bar
  skipToContent: 'Skip to content',
  home: 'Home',
  menu: 'Menu',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  announcement: 'Announcement',
  dismissAnnouncement: 'Dismiss announcement',
  // Suffix for the accessible name of links that open a new tab
  opensInNewTab: '(opens in a new tab)',

  // Posts index, tag and author pages
  blog: 'Blog',
  latestPosts: 'Latest posts',
  tag: 'Tag',
  author: 'Author',
  postsBy: 'Posts by {name}',
  postCount: { one: '{n} post', other: '{n} posts' },
  pageOf: 'Page {page} of {total}',
  noTaggedPosts: 'No posts with this tag yet.',
  pagination: 'Pagination',
  previous: 'Prev',
  next: 'Next',

  // Featured posts sections and their carousel
  featuredPosts: 'Featured posts',
  readMore: 'Read more',
  previousPost: 'Previous post',
  nextPost: 'Next post',
  slideOf: '{n} of {total}',

  // Post detail
  tags: 'Tags',
  share: 'Share',
  shareOn: 'Share on {network} (opens in a new tab)',
  copyLink: 'Copy link',
  copied: 'Copied',

  // Docs, legal and changelog
  copy: 'Copy',
  copyCode: 'Copy code',
  openDocsMenu: 'Open documentation menu',
  closeDocsMenu: 'Close documentation menu',
  onThisPage: 'On this page',
  documentation: 'Documentation',
  getStarted: 'Get started',
  backToSite: 'Back to site',
  latest: 'Latest',
  releases: 'Releases',

  // Footer column headings
  legal: 'Legal',
  social: 'Social',
  language: 'Language',

  // Newsletter form
  emailAddress: 'Email address',
  emailPlaceholder: 'you@company.com',
  subscribe: 'Subscribe',
  invalidEmail: 'Enter a valid email address.',
  subscribed: "Thanks, you're on the list.",

  // 404 page (the title is split in two for the two-tone heading)
  notFoundTitle: 'Page',
  notFoundTitleRest: 'not found',
  notFoundBody:
    'The page you were looking for appears to have been moved, deleted or does not exist.',
  backToHome: 'Back to homepage',

  // Header navigation and language picker
  mainNavigation: 'Main',
  // Title of a dropdown menu the CMS left without one
  otherItems: 'Other Items',
  currentLanguage: 'Language: {language}',

  // Draft Mode toggle, password prompt and confirmation
  draftMode: 'Draft mode',
  enterDraftMode: 'Enter draft mode',
  exitDraftMode: 'Exit draft mode',
  exit: 'Exit',
  authenticate: 'Authenticate',
  // {variable} is replaced by the environment variable name, set in code
  draftPasswordHint:
    "Enter the password to see draft content. It's the value of the {variable} environment variable.",
  password: 'Password',
  wrongPassword: 'Incorrect password. Try again.',
  cancel: 'Cancel',
  draftModeOn: 'Draft mode is on',
  draftModeOnBody:
    "You're now seeing content from the DatoCMS draft endpoint, with real-time updates. Changes you make in DatoCMS show up here instantly.",
  dismiss: 'Dismiss',

  // Docs and changelog chrome
  docsHome: 'Docs home',
  docsBadge: 'Docs',
  featuredPages: 'Featured pages',
  subpagesOf: '{title} subpages',
  changelog: 'Changelog',
  // Read before a release date, for screen readers
  released: 'Released',

  // Carousels and galleries in page sections (roledescriptions are lowercase nouns)
  carousel: 'carousel',
  slide: 'slide',
  features: 'Features',
  previousFeature: 'Previous feature',
  nextFeature: 'Next feature',
  testimonials: 'Testimonials',
  previousTestimonial: 'Previous testimonial',
  nextTestimonial: 'Next testimonial',
  // Announced when a testimonial carousel changes slide
  testimonialAnnouncement: 'Testimonial {n} of {total}: {name}',
  // Accessible name of one testimonial slide
  testimonialSlide: 'Testimonial {n} of {total}, {name}',
  ratedOutOf: 'Rated {value} out of {max}',
  brands: 'Brands',
  pauseLogos: 'Pause logos',
  playLogos: 'Play logos',

  // Video sections
  video: 'Video',
  videoPlayer: 'Video player',
  playVideo: 'Play video',
  playVideoTitled: 'Play video: {title}',
  closeVideo: 'Close video',

  // Pricing sections
  pricing: 'Pricing',
  choosePlan: 'Choose plan',
  startFreeTrial: 'Start free trial',
  startNow: 'Start now',
  bestValue: 'Best value',
  // Read before a feature the plan lacks, for screen readers
  notIncluded: 'Not included:',
  billingPeriod: 'Billing period',
  monthly: 'Monthly',
  yearly: 'Yearly',
  showingMonthlyPrices: 'Showing monthly prices',
  showingYearlyPrices: 'Showing yearly prices',
  // Price units: the short one is shown, the spoken one read by screen readers
  perMonthShort: '/mo',
  perMonthSpoken: 'per month',
  perYearShort: '/yr',
  perYearSpoken: 'per year',
  plan: 'Plan',

  // App download block in posts
  getOnAppStore: 'Get it on the App Store',
  getOnGooglePlay: 'Get it on Google Play',
} satisfies Record<string, Entry>;

const it: Dictionary = {
  // Header, menu sheet and announcement bar
  skipToContent: 'Vai al contenuto',
  home: 'Home',
  menu: 'Menu',
  openMenu: 'Apri il menu',
  closeMenu: 'Chiudi il menu',
  announcement: 'Annuncio',
  dismissAnnouncement: "Chiudi l'annuncio",
  opensInNewTab: '(si apre in una nuova scheda)',

  // Posts index, tag and author pages
  blog: 'Blog',
  latestPosts: 'Ultimi articoli',
  tag: 'Tag',
  author: 'Autore',
  postsBy: 'Articoli di {name}',
  postCount: { one: '{n} articolo', other: '{n} articoli' },
  pageOf: 'Pagina {page} di {total}',
  noTaggedPosts: 'Ancora nessun articolo con questo tag.',
  pagination: 'Paginazione',
  previous: 'Precedente',
  next: 'Successiva',

  // Featured posts sections and their carousel
  featuredPosts: 'Articoli in evidenza',
  readMore: 'Leggi di più',
  previousPost: 'Articolo precedente',
  nextPost: 'Articolo successivo',
  slideOf: '{n} di {total}',

  // Post detail
  tags: 'Tag',
  share: 'Condividi',
  shareOn: 'Condividi su {network} (si apre in una nuova scheda)',
  copyLink: 'Copia link',
  copied: 'Copiato',

  // Docs, legal and changelog
  copy: 'Copia',
  copyCode: 'Copia il codice',
  openDocsMenu: 'Apri il menu della documentazione',
  closeDocsMenu: 'Chiudi il menu della documentazione',
  onThisPage: 'In questa pagina',
  documentation: 'Documentazione',
  getStarted: 'Inizia',
  backToSite: 'Torna al sito',
  latest: 'Più recente',
  releases: 'Versioni',

  // Footer column headings
  legal: 'Note legali',
  social: 'Social',
  language: 'Lingua',

  // Newsletter form
  emailAddress: 'Indirizzo email',
  emailPlaceholder: 'nome@azienda.it',
  subscribe: 'Iscriviti',
  invalidEmail: 'Inserisci un indirizzo email valido.',
  subscribed: 'Grazie, iscrizione completata.',

  // 404 page
  notFoundTitle: 'Pagina',
  notFoundTitleRest: 'non trovata',
  notFoundBody:
    'La pagina che cercavi è stata spostata, eliminata o non esiste.',
  backToHome: 'Torna alla home',

  // Header navigation and language picker
  mainNavigation: 'Principale',
  // Title of a dropdown menu the CMS left without one
  otherItems: 'Altre voci',
  currentLanguage: 'Lingua: {language}',

  // Draft Mode toggle, password prompt and confirmation
  draftMode: 'Modalità bozza',
  enterDraftMode: 'Attiva la modalità bozza',
  exitDraftMode: 'Esci dalla modalità bozza',
  exit: 'Esci',
  authenticate: 'Accedi',
  // {variable} is replaced by the environment variable name, set in code
  draftPasswordHint:
    "Inserisci la password per vedere i contenuti in bozza. È il valore della variabile d'ambiente {variable}.",
  password: 'Password',
  wrongPassword: 'Password errata. Riprova.',
  cancel: 'Annulla',
  draftModeOn: 'La modalità bozza è attiva',
  draftModeOnBody:
    "Ora vedi i contenuti dell'endpoint delle bozze di DatoCMS, con aggiornamenti in tempo reale. Le modifiche che fai in DatoCMS compaiono qui all'istante.",
  dismiss: 'Chiudi',

  // Docs and changelog chrome
  docsHome: 'Home della documentazione',
  docsBadge: 'Docs',
  featuredPages: 'Pagine in evidenza',
  subpagesOf: 'Sottopagine di {title}',
  changelog: 'Changelog',
  // Read before a release date, for screen readers
  released: 'Pubblicata il',

  // Carousels and galleries in page sections (roledescriptions are lowercase nouns)
  carousel: 'carosello',
  slide: 'diapositiva',
  features: 'Funzionalità',
  previousFeature: 'Funzionalità precedente',
  nextFeature: 'Funzionalità successiva',
  testimonials: 'Testimonianze',
  previousTestimonial: 'Testimonianza precedente',
  nextTestimonial: 'Testimonianza successiva',
  // Announced when a testimonial carousel changes slide
  testimonialAnnouncement: 'Testimonianza {n} di {total}: {name}',
  // Accessible name of one testimonial slide
  testimonialSlide: 'Testimonianza {n} di {total}, {name}',
  ratedOutOf: 'Valutazione: {value} su {max}',
  brands: 'Marchi',
  pauseLogos: 'Metti in pausa i loghi',
  playLogos: 'Riprendi i loghi',

  // Video sections
  video: 'Video',
  videoPlayer: 'Lettore video',
  playVideo: 'Riproduci il video',
  playVideoTitled: 'Riproduci il video: {title}',
  closeVideo: 'Chiudi il video',

  // Pricing sections
  pricing: 'Prezzi',
  choosePlan: 'Scegli il piano',
  startFreeTrial: 'Inizia la prova gratuita',
  startNow: 'Inizia ora',
  bestValue: 'Più conveniente',
  // Read before a feature the plan lacks, for screen readers
  notIncluded: 'Non incluso:',
  billingPeriod: 'Periodo di fatturazione',
  monthly: 'Mensile',
  yearly: 'Annuale',
  showingMonthlyPrices: 'Prezzi mensili',
  showingYearlyPrices: 'Prezzi annuali',
  // Price units: the short one is shown, the spoken one read by screen readers
  perMonthShort: '/mese',
  perMonthSpoken: 'al mese',
  perYearShort: '/anno',
  perYearSpoken: "all'anno",
  plan: 'Piano',

  // App download block in posts
  getOnAppStore: 'Scarica su App Store',
  getOnGooglePlay: 'Disponibile su Google Play',
};

const de: Dictionary = {
  // Header, menu sheet and announcement bar
  skipToContent: 'Zum Inhalt springen',
  home: 'Startseite',
  menu: 'Menü',
  openMenu: 'Menü öffnen',
  closeMenu: 'Menü schließen',
  announcement: 'Ankündigung',
  dismissAnnouncement: 'Ankündigung schließen',
  opensInNewTab: '(öffnet in einem neuen Tab)',

  // Posts index, tag and author pages
  blog: 'Blog',
  latestPosts: 'Neueste Beiträge',
  tag: 'Schlagwort',
  author: 'Autor',
  postsBy: 'Beiträge von {name}',
  postCount: { one: '{n} Beitrag', other: '{n} Beiträge' },
  pageOf: 'Seite {page} von {total}',
  noTaggedPosts: 'Noch keine Beiträge mit diesem Schlagwort.',
  pagination: 'Seitennavigation',
  previous: 'Zurück',
  next: 'Weiter',

  // Featured posts sections and their carousel
  featuredPosts: 'Ausgewählte Beiträge',
  readMore: 'Weiterlesen',
  previousPost: 'Vorheriger Beitrag',
  nextPost: 'Nächster Beitrag',
  slideOf: '{n} von {total}',

  // Post detail
  tags: 'Schlagwörter',
  share: 'Teilen',
  shareOn: 'Auf {network} teilen (öffnet in einem neuen Tab)',
  copyLink: 'Link kopieren',
  copied: 'Kopiert',

  // Docs, legal and changelog
  copy: 'Kopieren',
  copyCode: 'Code kopieren',
  openDocsMenu: 'Dokumentationsmenü öffnen',
  closeDocsMenu: 'Dokumentationsmenü schließen',
  onThisPage: 'Auf dieser Seite',
  documentation: 'Dokumentation',
  getStarted: 'Loslegen',
  backToSite: 'Zurück zur Website',
  latest: 'Neueste',
  releases: 'Versionen',

  // Footer column headings
  legal: 'Rechtliches',
  social: 'Social Media',
  language: 'Sprache',

  // Newsletter form
  emailAddress: 'E-Mail-Adresse',
  emailPlaceholder: 'name@firma.de',
  subscribe: 'Abonnieren',
  invalidEmail: 'Gib eine gültige E-Mail-Adresse ein.',
  subscribed: 'Danke, du bist dabei.',

  // 404 page
  notFoundTitle: 'Seite',
  notFoundTitleRest: 'nicht gefunden',
  notFoundBody:
    'Die gesuchte Seite wurde verschoben, gelöscht oder existiert nicht.',
  backToHome: 'Zur Startseite',

  // Header navigation and language picker
  mainNavigation: 'Hauptnavigation',
  // Title of a dropdown menu the CMS left without one
  otherItems: 'Weitere Einträge',
  currentLanguage: 'Sprache: {language}',

  // Draft Mode toggle, password prompt and confirmation
  draftMode: 'Entwurfsmodus',
  enterDraftMode: 'Entwurfsmodus aktivieren',
  exitDraftMode: 'Entwurfsmodus beenden',
  exit: 'Beenden',
  authenticate: 'Anmelden',
  // {variable} is replaced by the environment variable name, set in code
  draftPasswordHint:
    'Gib das Passwort ein, um Entwurfsinhalte zu sehen. Es ist der Wert der Umgebungsvariable {variable}.',
  password: 'Passwort',
  wrongPassword: 'Falsches Passwort. Versuch es noch einmal.',
  cancel: 'Abbrechen',
  draftModeOn: 'Der Entwurfsmodus ist aktiv',
  draftModeOnBody:
    'Du siehst jetzt Inhalte vom Entwurfs-Endpunkt von DatoCMS, mit Echtzeit-Updates. Änderungen in DatoCMS erscheinen hier sofort.',
  dismiss: 'Schließen',

  // Docs and changelog chrome
  docsHome: 'Startseite der Dokumentation',
  docsBadge: 'Doku',
  featuredPages: 'Ausgewählte Seiten',
  subpagesOf: 'Unterseiten von {title}',
  changelog: 'Changelog',
  // Read before a release date, for screen readers
  released: 'Veröffentlicht am',

  // Carousels and galleries in page sections (roledescriptions are lowercase nouns)
  carousel: 'Karussell',
  slide: 'Folie',
  features: 'Funktionen',
  previousFeature: 'Vorherige Funktion',
  nextFeature: 'Nächste Funktion',
  testimonials: 'Kundenstimmen',
  previousTestimonial: 'Vorherige Kundenstimme',
  nextTestimonial: 'Nächste Kundenstimme',
  // Announced when a testimonial carousel changes slide
  testimonialAnnouncement: 'Kundenstimme {n} von {total}: {name}',
  // Accessible name of one testimonial slide
  testimonialSlide: 'Kundenstimme {n} von {total}, {name}',
  ratedOutOf: 'Bewertet mit {value} von {max}',
  brands: 'Marken',
  pauseLogos: 'Logos anhalten',
  playLogos: 'Logos abspielen',

  // Video sections
  video: 'Video',
  videoPlayer: 'Videoplayer',
  playVideo: 'Video abspielen',
  playVideoTitled: 'Video abspielen: {title}',
  closeVideo: 'Video schließen',

  // Pricing sections
  pricing: 'Preise',
  choosePlan: 'Tarif wählen',
  startFreeTrial: 'Kostenlos testen',
  startNow: 'Jetzt starten',
  bestValue: 'Bester Preis',
  // Read before a feature the plan lacks, for screen readers
  notIncluded: 'Nicht enthalten:',
  billingPeriod: 'Abrechnungszeitraum',
  monthly: 'Monatlich',
  yearly: 'Jährlich',
  showingMonthlyPrices: 'Monatliche Preise',
  showingYearlyPrices: 'Jährliche Preise',
  // Price units: the short one is shown, the spoken one read by screen readers
  perMonthShort: '/Monat',
  perMonthSpoken: 'pro Monat',
  perYearShort: '/Jahr',
  perYearSpoken: 'pro Jahr',
  plan: 'Tarif',

  // App download block in posts
  getOnAppStore: 'Laden im App Store',
  getOnGooglePlay: 'Jetzt bei Google Play',
};

const fr: Dictionary = {
  // Header, menu sheet and announcement bar
  skipToContent: 'Aller au contenu',
  home: 'Accueil',
  menu: 'Menu',
  openMenu: 'Ouvrir le menu',
  closeMenu: 'Fermer le menu',
  announcement: 'Annonce',
  dismissAnnouncement: "Fermer l'annonce",
  opensInNewTab: "(s'ouvre dans un nouvel onglet)",

  // Posts index, tag and author pages
  blog: 'Blog',
  latestPosts: 'Derniers articles',
  tag: 'Étiquette',
  author: 'Auteur',
  postsBy: 'Articles de {name}',
  postCount: { one: '{n} article', other: '{n} articles' },
  pageOf: 'Page {page} sur {total}',
  noTaggedPosts: 'Aucun article avec cette étiquette pour le moment.',
  pagination: 'Pagination',
  previous: 'Précédente',
  next: 'Suivante',

  // Featured posts sections and their carousel
  featuredPosts: 'Articles à la une',
  readMore: 'Lire la suite',
  previousPost: 'Article précédent',
  nextPost: 'Article suivant',
  slideOf: '{n} sur {total}',

  // Post detail
  tags: 'Étiquettes',
  share: 'Partager',
  shareOn: "Partager sur {network} (s'ouvre dans un nouvel onglet)",
  copyLink: 'Copier le lien',
  copied: 'Copié',

  // Docs, legal and changelog
  copy: 'Copier',
  copyCode: 'Copier le code',
  openDocsMenu: 'Ouvrir le menu de la documentation',
  closeDocsMenu: 'Fermer le menu de la documentation',
  onThisPage: 'Sur cette page',
  documentation: 'Documentation',
  getStarted: 'Commencer',
  backToSite: 'Retour au site',
  latest: 'Dernière',
  releases: 'Versions',

  // Footer column headings
  legal: 'Mentions légales',
  social: 'Réseaux sociaux',
  language: 'Langue',

  // Newsletter form
  emailAddress: 'Adresse e-mail',
  emailPlaceholder: 'vous@entreprise.fr',
  subscribe: "S'abonner",
  invalidEmail: 'Saisissez une adresse e-mail valide.',
  subscribed: 'Merci, votre inscription est confirmée.',

  // 404 page
  notFoundTitle: 'Page',
  notFoundTitleRest: 'introuvable',
  notFoundBody:
    "La page que vous cherchez a été déplacée, supprimée ou n'existe pas.",
  backToHome: "Retour à l'accueil",

  // Header navigation and language picker
  mainNavigation: 'Principale',
  // Title of a dropdown menu the CMS left without one
  otherItems: 'Autres éléments',
  currentLanguage: 'Langue : {language}',

  // Draft Mode toggle, password prompt and confirmation
  draftMode: 'Mode brouillon',
  enterDraftMode: 'Activer le mode brouillon',
  exitDraftMode: 'Quitter le mode brouillon',
  exit: 'Quitter',
  authenticate: 'Se connecter',
  // {variable} is replaced by the environment variable name, set in code
  draftPasswordHint:
    "Saisissez le mot de passe pour voir le contenu en brouillon. C'est la valeur de la variable d'environnement {variable}.",
  password: 'Mot de passe',
  wrongPassword: 'Mot de passe incorrect. Réessayez.',
  cancel: 'Annuler',
  draftModeOn: 'Le mode brouillon est activé',
  draftModeOnBody:
    "Vous voyez maintenant le contenu du point d'accès des brouillons de DatoCMS, avec des mises à jour en temps réel. Les modifications faites dans DatoCMS apparaissent ici instantanément.",
  dismiss: 'Fermer',

  // Docs and changelog chrome
  docsHome: 'Accueil de la documentation',
  docsBadge: 'Docs',
  featuredPages: 'Pages à la une',
  subpagesOf: 'Sous-pages de {title}',
  changelog: 'Changelog',
  // Read before a release date, for screen readers
  released: 'Publiée le',

  // Carousels and galleries in page sections (roledescriptions are lowercase nouns)
  carousel: 'carrousel',
  slide: 'diapositive',
  features: 'Fonctionnalités',
  previousFeature: 'Fonctionnalité précédente',
  nextFeature: 'Fonctionnalité suivante',
  testimonials: 'Témoignages',
  previousTestimonial: 'Témoignage précédent',
  nextTestimonial: 'Témoignage suivant',
  // Announced when a testimonial carousel changes slide
  testimonialAnnouncement: 'Témoignage {n} sur {total} : {name}',
  // Accessible name of one testimonial slide
  testimonialSlide: 'Témoignage {n} sur {total}, {name}',
  ratedOutOf: 'Noté {value} sur {max}',
  brands: 'Marques',
  pauseLogos: 'Mettre les logos en pause',
  playLogos: 'Relancer les logos',

  // Video sections
  video: 'Vidéo',
  videoPlayer: 'Lecteur vidéo',
  playVideo: 'Lire la vidéo',
  playVideoTitled: 'Lire la vidéo : {title}',
  closeVideo: 'Fermer la vidéo',

  // Pricing sections
  pricing: 'Tarifs',
  choosePlan: 'Choisir ce forfait',
  startFreeTrial: "Commencer l'essai gratuit",
  startNow: 'Commencer',
  bestValue: 'Meilleure offre',
  // Read before a feature the plan lacks, for screen readers
  notIncluded: 'Non inclus :',
  billingPeriod: 'Période de facturation',
  monthly: 'Mensuel',
  yearly: 'Annuel',
  showingMonthlyPrices: 'Prix mensuels',
  showingYearlyPrices: 'Prix annuels',
  // Price units: the short one is shown, the spoken one read by screen readers
  perMonthShort: '/mois',
  perMonthSpoken: 'par mois',
  perYearShort: '/an',
  perYearSpoken: 'par an',
  plan: 'Forfait',

  // App download block in posts
  getOnAppStore: "Télécharger dans l'App Store",
  getOnGooglePlay: 'Disponible sur Google Play',
};

const es: Dictionary = {
  // Header, menu sheet and announcement bar
  skipToContent: 'Saltar al contenido',
  home: 'Inicio',
  menu: 'Menú',
  openMenu: 'Abrir menú',
  closeMenu: 'Cerrar menú',
  announcement: 'Anuncio',
  dismissAnnouncement: 'Cerrar anuncio',
  opensInNewTab: '(se abre en una pestaña nueva)',

  // Posts index, tag and author pages
  blog: 'Blog',
  latestPosts: 'Últimos artículos',
  tag: 'Etiqueta',
  author: 'Autor',
  postsBy: 'Artículos de {name}',
  postCount: { one: '{n} artículo', other: '{n} artículos' },
  pageOf: 'Página {page} de {total}',
  noTaggedPosts: 'Todavía no hay artículos con esta etiqueta.',
  pagination: 'Paginación',
  previous: 'Anterior',
  next: 'Siguiente',

  // Featured posts sections and their carousel
  featuredPosts: 'Artículos destacados',
  readMore: 'Leer más',
  previousPost: 'Artículo anterior',
  nextPost: 'Artículo siguiente',
  slideOf: '{n} de {total}',

  // Post detail
  tags: 'Etiquetas',
  share: 'Compartir',
  shareOn: 'Compartir en {network} (se abre en una pestaña nueva)',
  copyLink: 'Copiar enlace',
  copied: 'Copiado',

  // Docs, legal and changelog
  copy: 'Copiar',
  copyCode: 'Copiar código',
  openDocsMenu: 'Abrir menú de documentación',
  closeDocsMenu: 'Cerrar menú de documentación',
  onThisPage: 'En esta página',
  documentation: 'Documentación',
  getStarted: 'Empezar',
  backToSite: 'Volver al sitio',
  latest: 'Última',
  releases: 'Versiones',

  // Footer column headings
  legal: 'Legal',
  social: 'Redes sociales',
  language: 'Idioma',

  // Newsletter form
  emailAddress: 'Correo electrónico',
  emailPlaceholder: 'tu@empresa.com',
  subscribe: 'Suscribirse',
  invalidEmail: 'Introduce un correo electrónico válido.',
  subscribed: 'Gracias, ya estás en la lista.',

  // 404 page
  notFoundTitle: 'Página',
  notFoundTitleRest: 'no encontrada',
  notFoundBody:
    'La página que buscas se ha movido, se ha eliminado o no existe.',
  backToHome: 'Volver al inicio',

  // Header navigation and language picker
  mainNavigation: 'Principal',
  // Title of a dropdown menu the CMS left without one
  otherItems: 'Otros elementos',
  currentLanguage: 'Idioma: {language}',

  // Draft Mode toggle, password prompt and confirmation
  draftMode: 'Modo borrador',
  enterDraftMode: 'Activar el modo borrador',
  exitDraftMode: 'Salir del modo borrador',
  exit: 'Salir',
  authenticate: 'Acceder',
  // {variable} is replaced by the environment variable name, set in code
  draftPasswordHint:
    'Introduce la contraseña para ver el contenido en borrador. Es el valor de la variable de entorno {variable}.',
  password: 'Contraseña',
  wrongPassword: 'Contraseña incorrecta. Inténtalo de nuevo.',
  cancel: 'Cancelar',
  draftModeOn: 'El modo borrador está activado',
  draftModeOnBody:
    'Ahora ves el contenido del endpoint de borradores de DatoCMS, con actualizaciones en tiempo real. Los cambios que hagas en DatoCMS aparecen aquí al instante.',
  dismiss: 'Cerrar',

  // Docs and changelog chrome
  docsHome: 'Inicio de la documentación',
  docsBadge: 'Docs',
  featuredPages: 'Páginas destacadas',
  subpagesOf: 'Subpáginas de {title}',
  changelog: 'Changelog',
  // Read before a release date, for screen readers
  released: 'Publicada el',

  // Carousels and galleries in page sections (roledescriptions are lowercase nouns)
  carousel: 'carrusel',
  slide: 'diapositiva',
  features: 'Funciones',
  previousFeature: 'Función anterior',
  nextFeature: 'Función siguiente',
  testimonials: 'Testimonios',
  previousTestimonial: 'Testimonio anterior',
  nextTestimonial: 'Testimonio siguiente',
  // Announced when a testimonial carousel changes slide
  testimonialAnnouncement: 'Testimonio {n} de {total}: {name}',
  // Accessible name of one testimonial slide
  testimonialSlide: 'Testimonio {n} de {total}, {name}',
  ratedOutOf: 'Valoración: {value} de {max}',
  brands: 'Marcas',
  pauseLogos: 'Pausar los logotipos',
  playLogos: 'Reanudar los logotipos',

  // Video sections
  video: 'Vídeo',
  videoPlayer: 'Reproductor de vídeo',
  playVideo: 'Reproducir el vídeo',
  playVideoTitled: 'Reproducir el vídeo: {title}',
  closeVideo: 'Cerrar el vídeo',

  // Pricing sections
  pricing: 'Precios',
  choosePlan: 'Elegir plan',
  startFreeTrial: 'Empezar la prueba gratis',
  startNow: 'Empezar ahora',
  bestValue: 'Mejor precio',
  // Read before a feature the plan lacks, for screen readers
  notIncluded: 'No incluido:',
  billingPeriod: 'Periodo de facturación',
  monthly: 'Mensual',
  yearly: 'Anual',
  showingMonthlyPrices: 'Precios mensuales',
  showingYearlyPrices: 'Precios anuales',
  // Price units: the short one is shown, the spoken one read by screen readers
  perMonthShort: '/mes',
  perMonthSpoken: 'al mes',
  perYearShort: '/año',
  perYearSpoken: 'al año',
  plan: 'Plan',

  // App download block in posts
  getOnAppStore: 'Descárgalo en el App Store',
  getOnGooglePlay: 'Disponible en Google Play',
};

const DICTIONARIES = { en, it, de, fr, es } satisfies Record<
  string,
  Dictionary
>;

type UiLocale = keyof typeof DICTIONARIES;

/** The supported locale for a code ('it', 'it-CH'…); English for anything unknown or missing */
export function resolveUiLocale(locale?: string | null): UiLocale {
  const code = locale?.toLowerCase().split(/[-_]/)[0];
  return code && code in DICTIONARIES ? (code as UiLocale) : 'en';
}

/** The entry's text, picking the plural form for `count` when it has one */
function pickForm(entry: Entry, locale: UiLocale, count: number): string {
  if (typeof entry === 'string') return entry;
  return new Intl.PluralRules(locale).select(count) === 'one'
    ? entry.one
    : entry.other;
}

/**
 * One interface string, resolved for `locale` and filled with `vars`
 * (`{name}` placeholders). Plural keys pick their form from `vars.n`.
 *
 *   uiString(locale, 'latestPosts')                    // "Ultimi articoli"
 *   uiString(locale, 'postCount', { n: 12 })           // "12 articoli"
 *   uiString(locale, 'pageOf', { page: 1, total: 2 })  // "Pagina 1 di 2"
 *
 * Pass raw CMS values as vars (an author name keeps its stega), and run
 * stripStega on the result only when it becomes aria text.
 */
export function uiString(
  locale: string | null | undefined,
  key: UiStringKey,
  vars?: Record<string, string | number>,
): string {
  const uiLocale = resolveUiLocale(locale);
  const template = pickForm(
    DICTIONARIES[uiLocale][key],
    uiLocale,
    Number(vars?.n ?? 0),
  );

  if (!vars) return template;

  // An unknown placeholder is left as written
  return template.replace(/\{(\w+)\}/g, (placeholder, name: string) =>
    name in vars ? String(vars[name]) : placeholder,
  );
}
