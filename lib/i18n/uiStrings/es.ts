import type { Dictionary } from './types';

export const es: Dictionary = {
  // Header: navigation, language picker, menu sheet and announcement bar
  skipToContent: 'Saltar al contenido',
  home: 'Inicio',
  menu: 'Menú',
  openMenu: 'Abrir menú',
  closeMenu: 'Cerrar menú',
  announcement: 'Anuncio',
  dismissAnnouncement: 'Cerrar anuncio',
  opensInNewTab: '(se abre en una pestaña nueva)',
  mainNavigation: 'Principal',
  otherItems: 'Otros elementos',
  currentLanguage: 'Idioma: {language}',

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
  docsHome: 'Inicio de la documentación',
  docsBadge: 'Docs',
  featuredPages: 'Páginas destacadas',
  subpagesOf: 'Subpáginas de {title}',
  changelog: 'Changelog',
  released: 'Publicada el',

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

  // Draft Mode toggle, password prompt and confirmation
  draftMode: 'Modo borrador',
  enterDraftMode: 'Activar el modo borrador',
  exitDraftMode: 'Salir del modo borrador',
  exit: 'Salir',
  authenticate: 'Acceder',
  draftPasswordHint:
    'Introduce la contraseña para ver el contenido en borrador. Es el valor de la variable de entorno {variable}.',
  password: 'Contraseña',
  wrongPassword: 'Contraseña incorrecta. Inténtalo de nuevo.',
  cancel: 'Cancelar',
  draftModeOn: 'El modo borrador está activado',
  draftModeOnBody:
    'Ahora ves el contenido del endpoint de borradores de DatoCMS, con actualizaciones en tiempo real. Los cambios que hagas en DatoCMS aparecen aquí al instante.',
  dismiss: 'Cerrar',

  // Carousels and galleries in page sections (roledescriptions are lowercase nouns)
  carousel: 'carrusel',
  slide: 'diapositiva',
  features: 'Funciones',
  previousFeature: 'Función anterior',
  nextFeature: 'Función siguiente',
  testimonials: 'Testimonios',
  previousTestimonial: 'Testimonio anterior',
  nextTestimonial: 'Testimonio siguiente',
  testimonialAnnouncement: 'Testimonio {n} de {total}: {name}',
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
  notIncluded: 'No incluido:',
  billingPeriod: 'Periodo de facturación',
  monthly: 'Mensual',
  yearly: 'Anual',
  showingMonthlyPrices: 'Precios mensuales',
  showingYearlyPrices: 'Precios anuales',
  perMonthShort: '/mes',
  perMonthSpoken: 'al mes',
  perYearShort: '/año',
  perYearSpoken: 'al año',
  plan: 'Plan',
  comparePlans: 'Compara los planes',
  feature: 'Función',
  included: 'Incluido',
  excluded: 'No incluido',

  // App download block in posts
  getOnAppStore: 'Descárgalo en el App Store',
  getOnGooglePlay: 'Disponible en Google Play',
};
