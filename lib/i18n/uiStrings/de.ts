import type { Dictionary } from './types';

export const de: Dictionary = {
  // Header: navigation, language picker, menu sheet and announcement bar
  skipToContent: 'Zum Inhalt springen',
  home: 'Startseite',
  menu: 'Menü',
  openMenu: 'Menü öffnen',
  closeMenu: 'Menü schließen',
  announcement: 'Ankündigung',
  dismissAnnouncement: 'Ankündigung schließen',
  opensInNewTab: '(öffnet in einem neuen Tab)',
  mainNavigation: 'Hauptnavigation',
  otherItems: 'Weitere Einträge',
  currentLanguage: 'Sprache: {language}',

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
  docsHome: 'Startseite der Dokumentation',
  docsBadge: 'Doku',
  featuredPages: 'Ausgewählte Seiten',
  subpagesOf: 'Unterseiten von {title}',
  changelog: 'Changelog',
  released: 'Veröffentlicht am',

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

  // Draft Mode toggle, password prompt and confirmation
  draftMode: 'Entwurfsmodus',
  enterDraftMode: 'Entwurfsmodus aktivieren',
  exitDraftMode: 'Entwurfsmodus beenden',
  exit: 'Beenden',
  authenticate: 'Anmelden',
  draftPasswordHint:
    'Gib das Passwort ein, um Entwurfsinhalte zu sehen. Es ist der Wert der Umgebungsvariable {variable}.',
  password: 'Passwort',
  wrongPassword: 'Falsches Passwort. Versuch es noch einmal.',
  cancel: 'Abbrechen',
  draftModeOn: 'Der Entwurfsmodus ist aktiv',
  draftModeOnBody:
    'Du siehst jetzt Inhalte vom Entwurfs-Endpunkt von DatoCMS, mit Echtzeit-Updates. Änderungen in DatoCMS erscheinen hier sofort.',
  dismiss: 'Schließen',

  // Carousels and galleries in page sections (roledescriptions are lowercase nouns)
  carousel: 'Karussell',
  slide: 'Folie',
  features: 'Funktionen',
  previousFeature: 'Vorherige Funktion',
  nextFeature: 'Nächste Funktion',
  testimonials: 'Kundenstimmen',
  previousTestimonial: 'Vorherige Kundenstimme',
  nextTestimonial: 'Nächste Kundenstimme',
  testimonialAnnouncement: 'Kundenstimme {n} von {total}: {name}',
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
  notIncluded: 'Nicht enthalten:',
  billingPeriod: 'Abrechnungszeitraum',
  monthly: 'Monatlich',
  yearly: 'Jährlich',
  showingMonthlyPrices: 'Monatliche Preise',
  showingYearlyPrices: 'Jährliche Preise',
  perMonthShort: '/Monat',
  perMonthSpoken: 'pro Monat',
  perYearShort: '/Jahr',
  perYearSpoken: 'pro Jahr',
  plan: 'Tarif',
  comparePlans: 'Pläne vergleichen',
  feature: 'Funktion',
  included: 'Enthalten',
  excluded: 'Nicht enthalten',

  // App download block in posts
  getOnAppStore: 'Laden im App Store',
  getOnGooglePlay: 'Jetzt bei Google Play',
};
