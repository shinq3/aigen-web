import { useTranslation } from 'react-i18next';
import { defaultLocale, isValidLocale, type Locale } from '@shared/i18n';

/**
 * Hook to get current locale and locale-aware navigation
 */
export function useLocale() {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language as Locale;

  return {
    locale: currentLocale,
    isValidLocale,
  };
}

/**
 * Create a locale-aware link path
 */
export function linkTo(path: string, locale?: Locale): string {
  const currentLocale = locale || defaultLocale;
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Always prefix with locale
  return `/${currentLocale}${cleanPath ? '/' + cleanPath : ''}`;
}

/**
 * Extract locale from path and return clean path
 */
export function extractLocaleFromPath(path: string): { locale: Locale; cleanPath: string } {
  const pathParts = path.split('/').filter(Boolean);
  
  if (pathParts.length > 0 && isValidLocale(pathParts[0])) {
    const locale = pathParts[0] as Locale;
    const cleanPath = '/' + pathParts.slice(1).join('/');
    return { locale, cleanPath };
  }
  
  return { locale: defaultLocale, cleanPath: path };
}

/**
 * Get current path without locale prefix
 */
export function getCurrentCleanPath(location: string): string {
  const { cleanPath } = extractLocaleFromPath(location);
  return cleanPath || '/';
}