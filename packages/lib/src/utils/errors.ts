import { isProd } from './helpers';

export enum Errors {
  // Alluvial
  GraphProblem = 'There was an issue generating your alluvial graph.',
}

const PREFIX = '[lume] ';

export function error(error: Errors, stack: Error, devOnly = true) {
  if (devOnly && isProd()) return;
  console.error(PREFIX + 'Error: ' + error, stack);
}
