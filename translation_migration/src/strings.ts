import { Translation } from './translation';
import { promises as fs } from 'fs';

export interface String {
  string: string;
  description: string;
  tag: string[];
  translation: Translation['strings'];
  key: string;
  createdate?: string;
  modifieddate?: string;
  createdby?: string;
  modifiedby?: string;
}

/**
 * Generates strings from translations.
 * @param {Translation[]} translations The translations.
 * @param {string} defaultLocal Default local used to generate strings string field.
 * @return {String[]} Generated strings.
 */
export function generateStrings(translations: Translation[], defaultLocal: string): String[] {
  const keys = Object.keys(translations[0].strings);

  const defaultTranslation = translations.find(translation => translation.local === defaultLocal);
  if (!defaultTranslation) {
    throw new Error('Missing en translation.');
  }

  return keys.map(key => {
    const translation = Object.assign({}, ...translations.map((translation) => {
      return {
        [translation.local]: {
          custom: translation.strings[key],
        },
      };
    }));
    
    return {
      string: defaultTranslation.strings[key],
      description: `Migrated from custom.json (${key.replace(/_/g, '.').substring(1)})`,
      tag: [
        ...key.split('_').slice(1, 3),
        'custom',
        'migrated',
      ],
      translation,
      key: key.replace(/-/g, '_'),
    };
  });
}

/**
 * Stores strings to provided file path.
 * @param {string} outputFilePath Json's file path.
 * @param {String[]} strings The strings.
 */
export function storeStrings(outputFilePath: string, strings: String[]): Promise<void> {
  return fs.writeFile(outputFilePath, JSON.stringify(strings, null, 2), { encoding: 'utf-8' });
}
