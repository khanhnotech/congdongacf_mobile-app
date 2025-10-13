import en from './en.json';
import vi from './vi.json';

const dictionaries = { en, vi };

export const t = (key, lang = 'vi') => {
  const dictionary = dictionaries[lang] ?? vi;
  return dictionary[key] ?? key;
};

export const availableLocales = Object.keys(dictionaries);
