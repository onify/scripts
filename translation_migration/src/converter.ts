import { replaceFilesContent } from './utils';

/**
 * Converts pug template translation references to string references.
 * @param {string} template The template.
 * @return {string} Converted template.
 */
export function pugTemplateConverter(template: string): string {
  return template.replace(/t\('(.+?)'\)/g, (_: string, key: string): string => {
    return `t('_${key.trim().replace(/\./g, '_').replace(/-/g, '_')}')`;
  });
}

/**
 * Converts pug templates translation references to string references from provided path.
 * @param {string} templatesPath Pug templates path.
 */
export async function convertPugTemplates(templatesPath: string): Promise<void> {
  return replaceFilesContent(templatesPath, pugTemplateConverter, { ext: 'pug' });
}

/**
 * Converts json template translation references to string references.
 * @param {string} template The template.
 * @return {string} Converted template.
 */
export function jsonTemplateConverter(template: string): string {
  return template.replace(/<%(.*?)%>/g, (_: string, key: string): string => {
    return `{{t _${key.trim().replace(/\./g, '_').replace(/-/g, '_')}}}`;
  });
}

/**
 * Converts json template translation references to string references from provided path.
 * @param {string} templatesPath Json templates path.
 */
export async function convertJsonTemplates(templatesPath: string): Promise<void> {
  return replaceFilesContent(templatesPath, jsonTemplateConverter, { ext: 'json' });
}
