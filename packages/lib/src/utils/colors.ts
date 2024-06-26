import { ColorPalette } from '@/types/dataset';
import {
  type Color,
  Colors,
  DivergentColors,
  LegacyColors,
  OtherColors,
  SequentialColors,
} from '@/types/utils';
import { shiftItems } from './helpers';
import { warn, Warnings } from './warnings';

const DEFAULT_PALETTE = ColorPalette.Categorical;
export const DEFAULT_COLOR = Colors.Skyblue;
const DEFAULT_DIVERGENT_COLOR = DivergentColors.SkyTeal;

function getDefaultColorByPalette(palette: ColorPalette) {
  if (palette === ColorPalette.Divergent) return DEFAULT_DIVERGENT_COLOR;
  return DEFAULT_COLOR;
}

function isLegacy(color: Color) {
  return Object.values(LegacyColors).includes(color as LegacyColors);
}

function validateColor(color: Color | null, palette: ColorPalette) {
  if (palette === ColorPalette.Divergent) {
    return Object.values(DivergentColors).includes(color as DivergentColors);
  }
  return Object.values({
    ...Colors,
    ...SequentialColors,
    ...OtherColors,
    ...LegacyColors,
  }).includes(color as Colors | LegacyColors);
}

function getCategoricalColor(color: Colors, index: number) {
  // When computing the categorical color, we need to move items in the colors enum to
  //   be able to correctly map them to the datasets based on the provided index.
  // For instance, if the user says the first color should be `royalblue`, then we
  //   move items in the enum so that index 0 is now `royalblue` (and `skyblue` is last).
  const colorIndex = Object.values(Colors).indexOf(color);
  return shiftItems(Object.values(Colors), colorIndex > -1 ? colorIndex : 0)[
    index
  ] as Colors;
}

function getSequentialColor(color: Colors, index: number) {
  const value = 50 + index * 10;
  return `${color}-${value}`;
}

function getDivergentColor(color: DivergentColors, index: number) {
  const value = (index + 1) * 10;
  return `${color}-${value}`;
}

function getColorByPalette(color: Color, palette: ColorPalette, index: number) {
  switch (palette) {
  default:
  case ColorPalette.Categorical:
    return isLegacy(color)
      ? color
      : getCategoricalColor(color as Colors, index);
  case ColorPalette.Sequential:
    return getSequentialColor(color as Colors, index);
  case ColorPalette.Divergent:
    return getDivergentColor(color as DivergentColors, index);
  }
}

export function computeColor(
  datasetColor: Color,
  color: Color,
  palette: ColorPalette = DEFAULT_PALETTE,
  index: number
) {
  const isDatasetColorValid = validateColor(datasetColor, palette);
  if (isDatasetColorValid) return datasetColor;

  if (index > 4) {
    warn(Warnings.ColorLoop);
    index = index % 5; // Loop colors back after the 5th dataset
  }

  const isColorValid = validateColor(color, palette);
  if (isColorValid) return getColorByPalette(color, palette, index);

  return getColorByPalette(getDefaultColorByPalette(palette), palette, index);
}

export function getDataTypeClass(type: ColorPalette = DEFAULT_PALETTE) {
  return `lume-data-type--${type}`;
}
