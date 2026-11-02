import { translations } from './translations';

export const languages = { es: 'Español', en: 'English', ro: 'Română' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'es';

/** Código BCP 47 para <html lang>, hreflang y formato de números */
export const locales: Record<Lang, string> = { es: 'es-ES', en: 'en', ro: 'ro-RO' };

export type PageKey = 'home' | 'privacy' | 'legal';

/** URL de cada página en cada idioma (slugs traducidos para SEO) */
export const routes: Record<Lang, Record<PageKey, string>> = {
  es: { home: '/', privacy: '/privacidad/', legal: '/aviso-legal/' },
  en: { home: '/en/', privacy: '/en/privacy/', legal: '/en/legal-notice/' },
  ro: { home: '/ro/', privacy: '/ro/confidentialitate/', legal: '/ro/informatii-legale/' },
};

export function getLang(locale: string | undefined): Lang {
  return locale && locale in languages ? (locale as Lang) : defaultLang;
}

export function useTranslations(locale: string | undefined) {
  return translations[getLang(locale)];
}
