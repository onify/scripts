import { promises as fs } from 'fs';
import path from 'path';
 
export interface FlattedObject {
  [key: string]: string;
}

/**
 * Flats all nested objects to key-value pairs.
 * @param {object} object The object.
 * @return {FlattedObject} The object with flatted keys.
 */
export function flatObject(object: object): FlattedObject {
  const flatted: FlattedObject = {};

  // keeps getting filled with all objects that are nested inside our object that we are trying to flat
  const sources: { prefix: string, object: object }[] = [{ prefix: '', object }];

  for (const source of sources) {
    Object.entries(source.object).forEach(([key, value]) => {
      const finalKey = `${source.prefix}_${key}`;
      if (typeof value === 'object') {
        sources.push({
          prefix: finalKey,
          object: value,
        });
      } else {
        flatted[finalKey] = value;
      }
    });
  }

  return flatted;
}

/**
 * Chunks array into smaller arrays.
 * @param {T[]} array The array.
 * @param {number} size The size of a chunk.
 * @return {T[][]} The array with chunks.
 */
export function chunk<T extends {}>(array: T[], size: number): T[][] {
  return Array.from({
    length: Math.ceil(array.length / size),
  }, (_, index) => {
    return array.slice(index * size, index * size + size);
  });
}

/**
 * Gets files list in the directory.
 * @param {string} dirPath Path of the directory.
 * @return {Promise<string[]>} The list of files.
 */
export async function getDirectories(dirPath: string): Promise<string[]> {
  const list = await fs.readdir(dirPath, { withFileTypes: true });
  return list.filter(item => item.isDirectory()).map(item => item.name);
}

/**
 * Gets files paths in the directory and nested directories.
 * @param dir Path of the directory.
 * @param ext File extension to filter the results.
 * @return {Promise<string[]>} The list of files.
 */
export async function getFiles(dir: string, ext?: string | string[]): Promise<string[]> {
  const list = await fs.readdir(dir, { withFileTypes: true });
  
  const files = await Promise.all(list.map(async item => {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      return getFiles(fullPath);
    }
    if (!ext) {
      return fullPath;
    }
    if (typeof ext === 'string') {
      return fullPath.endsWith(`.${ext}`) ? fullPath : '';
    }
    return ext.includes(path.extname(item.name).substring(1)) ? fullPath : '';
  }));

  return files
    // flat the deeper files
    .reduce((acc: string[], file) => {
      if (Array.isArray(file)) {
        return [...acc, ...file];
      }
      return [...acc, file];
    }, [])
    // filter empty files returned from file extension filtering
    .filter(file => file !== '');
}

type Replacer = (content: string) => string;

/**
 * Replaces file content.
 * @param {string} filePath Path of the file.
 * @param {Replacer} replacer Content replacer.
 */
export async function replaceFileContent(filePath: string, replacer: Replacer): Promise<void> {
  const content = await fs.readFile(filePath, { encoding: 'utf-8' });
  const converted = replacer(content);
  await fs.writeFile(filePath, converted, { encoding: 'utf-8' });
}

interface ReplaceFilesContentOptions {
  ext?: string | string[];
  parallel?: number;
}

/**
 * Replaces files contents in the directory.
 * @param {string} dirPath Path of the directory
 * @param {Replacer} replacer Content replacer.
 * @param {ReplaceFilesContentOptions} options Options.
 */
export async function replaceFilesContent(dirPath: string, replacer: Replacer, options?: ReplaceFilesContentOptions): Promise<void> {
  const files = await getFiles(dirPath, options?.ext);
  const groups = chunk(files, options?.parallel ?? 5);
  for await (const group of groups) {
    await Promise.all(group.map(async file => replaceFileContent(file, replacer)));
  }
}
