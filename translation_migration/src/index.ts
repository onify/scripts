import path from 'path';
import { getTranslations } from './translation';
import { generateStrings, storeStrings } from './strings';
import { getArguments } from './arguments';
import { convertJsonTemplates, convertPugTemplates } from './converter';

/**
 * Executes the command.
 */
async function main(): Promise<void> {
  const args = getArguments();
  
  const translations = await getTranslations(path.join(args.projectPath, 'locales'));
  const strings = generateStrings(translations, 'en');
  await storeStrings(args.stringsOutputPath, strings);
  console.log(`Successfully migrated locals to ${args.stringsOutputPath}`);
  
  await convertPugTemplates(path.join(args.projectPath, 'templates/dashboard'));
  await convertPugTemplates(path.join(args.projectPath, 'templates/form'));
  console.log(`Successfully converted pug templates`);

  await convertJsonTemplates(path.join(args.projectPath, 'public/app/config'));
  console.log(`Successfully converted json templates`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
