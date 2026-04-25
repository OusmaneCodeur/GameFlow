import fr from '@/locales/fr.json';
import en from '@/locales/en.json';
import wo from '@/locales/wo.json';

export type Language = 'fr' | 'en' | 'wo';

type Dictionary = typeof fr;

const dictionaries: Record<Language, Dictionary> = { fr, en, wo };

export function getDictionary(lang: Language): Dictionary {
  return dictionaries[lang] ?? dictionaries.fr;
}

export function t(lang: Language, key: string): string {
  const dictionary = getDictionary(lang) as unknown as Record<string, unknown>;
  const value = key.split('.').reduce<unknown>((acc, token) => {
    if (typeof acc === 'object' && acc && token in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[token];
    }
    return undefined;
  }, dictionary);

  return typeof value === 'string' ? value : key;
}

export function detectLanguage(text: string): Language {
  const normalized = text.toLowerCase();

  if (
    /\b(hello|hi|where|when|transport|events|match|ticket|please)\b/.test(normalized)
  ) {
    return 'en';
  }

  if (
    /\b(naka|lan|jamm|tey|suba|dakar|ndimbal|mangi)\b/.test(normalized)
  ) {
    return 'wo';
  }

  return 'fr';
}
