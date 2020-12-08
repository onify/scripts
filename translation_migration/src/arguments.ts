import yargs from 'yargs';

export interface Arguments {
  stringsOutputPath: string;
  projectPath: string;
  _: string[];
}

/**
 * Gets command arguments.
 * @return {Arguments} Command's arguments.
 */
export function getArguments(): Arguments {
  return yargs.options({
    stringsOutputPath: {
      alias: 'output',
      type: 'string',
      description: 'Strings output file path.',
      required: true,
    },
    projectPath: {
      alias: 'project',
      type: 'string',
      description: 'Project\'s folder path.',
      required: true,
    },
  }).argv;
}
