import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'hi', 'ta', 'te', 'kn', 'ml', 'mr', 'gu', 'bn', 'or', 'pa', 'as'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale) locale = 'en';
  if (!locales.includes(locale as Locale)) notFound();
  
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});