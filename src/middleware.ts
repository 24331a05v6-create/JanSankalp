import createMiddleware from 'next-intl/middleware';

const locales = ['en', 'hi', 'ta', 'te', 'kn', 'ml', 'mr', 'gu', 'bn', 'or', 'pa', 'as'];

export default createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'as-needed',
});

export const config = {
  matcher: ['/(hi|ta|te|kn|ml|mr|gu|bn|or|pa|as)/:path*'],
};