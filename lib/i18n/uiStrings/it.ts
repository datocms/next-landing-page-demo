import type { Dictionary } from './types';

export const it: Dictionary = {
  // Header: navigation, language picker, menu sheet and announcement bar
  skipToContent: 'Vai al contenuto',
  home: 'Home',
  menu: 'Menu',
  openMenu: 'Apri il menu',
  closeMenu: 'Chiudi il menu',
  announcement: 'Annuncio',
  dismissAnnouncement: "Chiudi l'annuncio",
  opensInNewTab: '(si apre in una nuova scheda)',
  mainNavigation: 'Principale',
  otherItems: 'Altre voci',
  currentLanguage: 'Lingua: {language}',

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
  docsHome: 'Home della documentazione',
  docsBadge: 'Docs',
  featuredPages: 'Pagine in evidenza',
  subpagesOf: 'Sottopagine di {title}',
  changelog: 'Changelog',
  released: 'Pubblicata il',

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

  // Draft Mode toggle, password prompt and confirmation
  draftMode: 'Modalità bozza',
  enterDraftMode: 'Attiva la modalità bozza',
  exitDraftMode: 'Esci dalla modalità bozza',
  exit: 'Esci',
  authenticate: 'Accedi',
  draftPasswordHint:
    "Inserisci la password per vedere i contenuti in bozza. È il valore della variabile d'ambiente {variable}.",
  password: 'Password',
  wrongPassword: 'Password errata. Riprova.',
  cancel: 'Annulla',
  draftModeOn: 'La modalità bozza è attiva',
  draftModeOnBody:
    "Ora vedi i contenuti dell'endpoint delle bozze di DatoCMS, con aggiornamenti in tempo reale. Le modifiche che fai in DatoCMS compaiono qui all'istante.",
  dismiss: 'Chiudi',

  // Carousels and galleries in page sections (roledescriptions are lowercase nouns)
  carousel: 'carosello',
  slide: 'diapositiva',
  features: 'Funzionalità',
  previousFeature: 'Funzionalità precedente',
  nextFeature: 'Funzionalità successiva',
  testimonials: 'Testimonianze',
  previousTestimonial: 'Testimonianza precedente',
  nextTestimonial: 'Testimonianza successiva',
  testimonialAnnouncement: 'Testimonianza {n} di {total}: {name}',
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
  notIncluded: 'Non incluso:',
  billingPeriod: 'Periodo di fatturazione',
  monthly: 'Mensile',
  yearly: 'Annuale',
  showingMonthlyPrices: 'Prezzi mensili',
  showingYearlyPrices: 'Prezzi annuali',
  perMonthShort: '/mese',
  perMonthSpoken: 'al mese',
  perYearShort: '/anno',
  perYearSpoken: "all'anno",
  plan: 'Piano',
  comparePlans: 'Confronta i piani',
  feature: 'Funzionalità',
  included: 'Incluso',
  excluded: 'Non incluso',

  // App download block in posts
  getOnAppStore: 'Scarica su App Store',
  getOnGooglePlay: 'Disponibile su Google Play',
};
