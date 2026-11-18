import type { Entry } from './types';

/** Add a key here first: this dictionary defines the keys and is the English fallback used
 * whenever DatoCMS has no text for a key */
export const en = {
  // Header: navigation, language picker, menu sheet and announcement bar
  skipToContent: 'Skip to content',
  home: 'Home',
  menu: 'Menu',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  announcement: 'Announcement',
  // Suffix for the accessible name of links that open a new tab
  opensInNewTab: '(opens in a new tab)',
  mainNavigation: 'Main',
  // Title of a dropdown menu the CMS left without one
  otherItems: 'More',
  currentLanguage: 'Language: {language}',

  // Ratings: the value in words, read by screen readers next to the stars
  ratingOutOf: '{value} out of {max}',

  // Posts index, tag and author pages
  latestPosts: 'Latest posts',
  postsBy: 'Posts by {name}',
  postCount: { one: '{n} post', other: '{n} posts' },
  pageOf: 'Page {page} of {total}',
  noTaggedPosts: 'No posts with this tag yet.',
  pagination: 'Pagination',
  // Post lists and the end of a post. "Untitled" stands in for a post without a title
  untitled: 'Untitled',
  allPosts: 'All posts',
  // The list of authors: its title, and the link to it from an author's page
  allAuthors: 'All authors',
  morePosts: 'More posts',
  writtenBy: 'Written by',
  taggedPostCount: {
    one: '{n} post with this tag',
    other: '{n} posts with this tag',
  },

  // Featured posts sections
  featuredPosts: 'Featured posts',

  // Post detail
  tags: 'Tags',
  share: 'Share',
  shareOn: 'Share on {network} (opens in a new tab)',
  copyLink: 'Copy link',
  copied: 'Copied',
  // The browser's own share sheet, after the links to the networks
  shareOther: 'Other apps',

  // Docs, legal and changelog
  copy: 'Copy',
  copyCode: 'Copy code',
  openDocsMenu: 'Open documentation menu',
  closeDocsMenu: 'Close documentation menu',
  onThisPage: 'On this page',
  documentation: 'Documentation',
  backToSite: 'Back to site',
  latest: 'Latest',
  docsHome: 'Docs home',
  docsBadge: 'Docs',
  featuredPages: 'Featured pages',
  // Over the list of a docs page's subtopics, at the end of the page
  inThisTopic: 'In this topic',
  // Docs, on phones: the button under the header that opens the topic list
  allTopics: 'All topics',
  previousPage: 'Previous',
  nextPage: 'Next',
  docsPagination: 'Previous and next page',
  changelog: 'Changelog',
  // Read before a release date, for screen readers
  released: 'Released',
  // Before the date a legal page last changed
  lastUpdated: 'Last updated',

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

  // 404 page
  notFoundTitle: 'Page not found',
  notFoundBody:
    'The page you were looking for appears to have been moved, deleted or does not exist.',
  backToHome: 'Back to homepage',

  // Draft Mode toggle, password prompt and confirmation
  enterDraftMode: 'Enter draft mode',
  exitDraftMode: 'Exit draft mode',
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

  // Accessible names of page sections without a visible title
  testimonials: 'Testimonials',
  brands: 'Brands',

  // Video sections
  video: 'Video',
  videoPlayer: 'Video player',
  playVideo: 'Play video',
  playVideoTitled: 'Play video: {title}',
  closeVideo: 'Close video',

  // Pricing sections
  pricing: 'Pricing',
  choosePlan: 'Choose plan',
  // Read before a feature the plan lacks, for screen readers
  notIncluded: 'Not included:',
  billingPeriod: 'Billing period',
  monthly: 'Monthly',
  yearly: 'Yearly',
  showingMonthlyPrices: 'Showing monthly prices',
  showingYearlyPrices: 'Showing yearly prices',
  // Price periods, shown in small type after the figure
  perMonth: 'per month',
  perYear: 'per year',
  // Accessible name of the plan tabs
  plans: 'Plans',
  // Plan comparison table: the column head of feature names, and what screen readers say for a check or a dash
  comparePlans: 'Compare plans',
  feature: 'Feature',
  included: 'Included',
  excluded: 'Not included',

  // App download block in posts
  getOnAppStore: 'Get it on the App Store',
  getOnGooglePlay: 'Get it on Google Play',
} satisfies Record<string, Entry>;
