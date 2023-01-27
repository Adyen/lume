import { Data, DatasetValueObject } from '@/types/dataset';
import { Scale } from '@/composables/scales';
import { scaleBand, scaleLinear } from 'd3';
import { ContainerSize } from '@/types/size';
import { LegacyColors } from '@/utils/constants';

const width = 640;
const height = 480;

const NUMBER_OF_COLORS = 5;

export const data: Data<DatasetValueObject<number>> = [
  {
    values: [
      { value: 10 },
      { value: -40 },
      { value: 30 },
      { value: 20 },
      { value: -70 },
      { value: 60 },
      { value: 50 },
    ],
  },
];

export const labels: Array<string> = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];
export const containerSize: ContainerSize = { width, height };

const highestValue = Math.max(...data[0].values.map(({ value }) => value));

export const xScale: Scale = scaleBand<number>()
  .domain(labels.map((_, i) => i))
  .range([0, width]);
export const yScale: Scale = scaleLinear<number>()
  .domain([0, highestValue])
  .range([0, height]);

const generateValue = (domain, useNegativeValues, useIntegers) => {
  const value =
    Math.random() * domain * (useNegativeValues ? 2 : 1) -
    (useNegativeValues ? domain : 0);
  return useIntegers ? Math.round(value) : value;
};

export const generateData = (
  numberOfSets: number,
  numberOfRecords: number,
  domain = 1000,
  useIntegers = false,
  useNegativeValues = false,
  useColor = false
): Data<DatasetValueObject<number>> => {
  let dataSets: Data<DatasetValueObject<number>> = null;

  do {
    dataSets = [];
    for (let i = 0; i < numberOfSets; i++) {
      const dataSet: DatasetValueObject<number>[] = [];
      for (let j = 0; j < numberOfRecords; j++) {
        dataSet.push({
          value: generateValue(domain, useNegativeValues, useIntegers),
        });
      }
      dataSets.push({
        values: dataSet,
        ...(useColor
          ? { color: `0${1 + (i % NUMBER_OF_COLORS)}` as LegacyColors }
          : {}),
      });
    }
    // Not only allow but ensure that there are negative values
  } while (
    dataSets
      .reduce(
        (acc, { values }) => [...acc, ...values.map(({ value }) => value)],
        []
      )
      .filter((val) => val < 0).length > 0
  );

  return dataSets;
};

export const generateLinearScale = (
  data: Data<DatasetValueObject<number>>,
  range = [0, height]
): Scale => {
  const flatData = data.reduce(
    (acc, { values }) => [...acc, ...values.map(({ value }) => value)],
    []
  );
  const min = Math.min(...flatData);
  const highestValue = Math.max(...flatData);
  const lowestValue = min > 0 ? 0 : min;
  return scaleLinear<number>().domain([lowestValue, highestValue]).range(range);
};
