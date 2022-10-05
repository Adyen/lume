import { isProd } from './helpers';

export enum Warnings {
  DatasetLength = 'Our guidelines highly recommend not having more than 5 datasets in one chart.\nLearn more: https://lume.design/guidelines/datasets',
  ColorLoop = 'Colors will loop around after the 5th dataset. You can prevent this by setting specific colors for your datasets.',
}

const PREFIX = '[lume] ';

export function warn(warning: Warnings, devOnly = true) {
  if (devOnly && isProd()) return;
  console.warn(PREFIX + 'Warning: ' + warning);
}
