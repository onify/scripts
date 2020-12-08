import { promises as fs } from 'fs';
import path from 'path';
import { flatObject, getDirectories, FlattedObject } from './utils';

export interface Translation {
  local: string;
  strings: FlattedObject;
}

/**
 * Gets translations from custom.json in provided locals path.
 * @param {string} localsPath Locals path.
 * @return {Translation[]} The translations.
 */
export async function getTranslations(localsPath: string): Promise<Translation[]> {
  const locals = await getDirectories(localsPath);

  const stringified = await Promise.all(
    locals.map(local => {
      return fs.readFile(path.join(localsPath, local, `custom.json`), { encoding: 'utf-8' });
    })
  );

  return stringified.map((string, index) => {
    return {
      local: locals[index],
      strings: flatObject(JSON.parse(string)),
    };
  });
}
