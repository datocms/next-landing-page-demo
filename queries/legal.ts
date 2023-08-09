export const legalQuery = `query MyQuery($slug: String, $locale: SiteLocale, $fallbackLocale: [SiteLocale!]) {
  legalPage(filter: {slug: {eq: $slug}}, locale: $locale, fallbackLocales: $fallbackLocale) {
    content {
      value
    }
  }
}`;
