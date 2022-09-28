import { DataType } from '@/types/dataset';
import { Color, Colors, DivergentColors, LegacyColors } from '@/constants';

const DEFAULT_TYPE = DataType.Categorical;

const DEFAULT_COLOR = Colors.Skyblue;
const DEFAULT_DIVERGENT_COLOR = DivergentColors.SkyTeal;

function getDefaultColorByType(type: DataType) {
  if (type === DataType.Divergent) return DEFAULT_DIVERGENT_COLOR;
  return DEFAULT_COLOR;
}

function isLegacy(color: Color) {
  return Object.values(LegacyColors).includes(color as LegacyColors);
}

function validateColor(color: Color | null, type: DataType) {
  if (type === DataType.Divergent) {
    return Object.values(DivergentColors).includes(color as DivergentColors);
  }
  return Object.values({ ...Colors, ...LegacyColors }).includes(
    color as Colors | LegacyColors
  );
}

function getCategoricalColor(index: number) {
  return Object.values(Colors)[index];
}

function getSequentialColor(color: Colors, index: number) {
  const value = 50 + index * 10;
  return `${color}-${value}`;
}

function getDivergentColor(color: DivergentColors, index: number) {
  const value = (index + 1) * 10;
  return `${color}-${value}`;
}

function getColorByType(color: Color, type: DataType, index: number) {
  switch (type) {
    default:
    case DataType.Categorical:
      return isLegacy(color) ? color : getCategoricalColor(index);
    case DataType.Sequential:
      return getSequentialColor(color as Colors, index);
    case DataType.Divergent:
      return getDivergentColor(color as DivergentColors, index);
  }
}

export function computeColor(
  datasetColor: Color,
  color: Color,
  type: DataType = DEFAULT_TYPE,
  index: number
) {
  const isDatasetColorValid = validateColor(datasetColor, type);
  if (isDatasetColorValid) return getColorByType(datasetColor, type, index);

  const isColorValid = validateColor(color, type);
  if (isColorValid) return getColorByType(color, type, index);

  return getColorByType(getDefaultColorByType(type), type, index);
}

export function getDataTypeClass(type: DataType = DEFAULT_TYPE) {
  return `adv-data-type--${type}`;
}
