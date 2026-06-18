export type Locale = 'ja' | 'en' | 'vi';

export const defaultLocale: Locale = 'ja';

export const locales: Locale[] = ['ja', 'en', 'vi'];

export const localeNames: Record<Locale, string> = {
  ja: '日本語',
  en: 'English',
  vi: 'Tiếng Việt'
};

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}