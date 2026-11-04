import type { Dictionary } from './types';

export const fr: Dictionary = {
  // Header: navigation, language picker, menu sheet and announcement bar
  skipToContent: 'Aller au contenu',
  home: 'Accueil',
  menu: 'Menu',
  openMenu: 'Ouvrir le menu',
  closeMenu: 'Fermer le menu',
  announcement: 'Annonce',
  dismissAnnouncement: "Fermer l'annonce",
  opensInNewTab: "(s'ouvre dans un nouvel onglet)",
  mainNavigation: 'Principale',
  otherItems: 'Autres éléments',
  currentLanguage: 'Langue : {language}',

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
  docsHome: 'Accueil de la documentation',
  docsBadge: 'Docs',
  featuredPages: 'Pages à la une',
  subpagesOf: 'Sous-pages de {title}',
  changelog: 'Changelog',
  released: 'Publiée le',

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

  // Draft Mode toggle, password prompt and confirmation
  draftMode: 'Mode brouillon',
  enterDraftMode: 'Activer le mode brouillon',
  exitDraftMode: 'Quitter le mode brouillon',
  exit: 'Quitter',
  authenticate: 'Se connecter',
  draftPasswordHint:
    "Saisissez le mot de passe pour voir le contenu en brouillon. C'est la valeur de la variable d'environnement {variable}.",
  password: 'Mot de passe',
  wrongPassword: 'Mot de passe incorrect. Réessayez.',
  cancel: 'Annuler',
  draftModeOn: 'Le mode brouillon est activé',
  draftModeOnBody:
    "Vous voyez maintenant le contenu du point d'accès des brouillons de DatoCMS, avec des mises à jour en temps réel. Les modifications faites dans DatoCMS apparaissent ici instantanément.",
  dismiss: 'Fermer',

  // Carousels and galleries in page sections (roledescriptions are lowercase nouns)
  carousel: 'carrousel',
  slide: 'diapositive',
  features: 'Fonctionnalités',
  previousFeature: 'Fonctionnalité précédente',
  nextFeature: 'Fonctionnalité suivante',
  testimonials: 'Témoignages',
  previousTestimonial: 'Témoignage précédent',
  nextTestimonial: 'Témoignage suivant',
  testimonialAnnouncement: 'Témoignage {n} sur {total} : {name}',
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
  notIncluded: 'Non inclus :',
  billingPeriod: 'Période de facturation',
  monthly: 'Mensuel',
  yearly: 'Annuel',
  showingMonthlyPrices: 'Prix mensuels',
  showingYearlyPrices: 'Prix annuels',
  perMonthShort: '/mois',
  perMonthSpoken: 'par mois',
  perYearShort: '/an',
  perYearSpoken: 'par an',
  plan: 'Forfait',
  comparePlans: 'Comparer les offres',
  feature: 'Fonctionnalité',
  included: 'Inclus',
  excluded: 'Non inclus',

  // App download block in posts
  getOnAppStore: "Télécharger dans l'App Store",
  getOnGooglePlay: 'Disponible sur Google Play',
};
