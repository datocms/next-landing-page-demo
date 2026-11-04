import type { Entry } from './types';

/** Add a key here first: this dictionary defines the keys every other locale must have */
export const en = {
  // Header: navigation, language picker, menu sheet and announcement bar
  skipToContent: 'Skip to content',
  home: 'Home',
  menu: 'Menu',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  announcement: 'Announcement',
  dismissAnnouncement: 'Dismiss announcement',
  // Suffix for the accessible name of links that open a new tab
  opensInNewTab: '(opens in a new tab)',
  mainNavigation: 'Main',
  // Title of a dropdown menu the CMS left without one
  otherItems: 'Other Items',
  currentLanguage: 'Language: {language}',

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
  docsHome: 'Docs home',
  docsBadge: 'Docs',
  featuredPages: 'Featured pages',
  subpagesOf: '{title} subpages',
  changelog: 'Changelog',
  // Read before a release date, for screen readers
  released: 'Released',

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
  // Plan comparison table: the column head of feature names, and what screen readers say for a check or a dash
  comparePlans: 'Compare plans',
  feature: 'Feature',
  included: 'Included',
  excluded: 'Not included',

  // App download block in posts
  getOnAppStore: 'Get it on the App Store',
  getOnGooglePlay: 'Get it on Google Play',
} satisfies Record<string, Entry>;
