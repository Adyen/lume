import { Data, DatasetValueObject } from "@/types/dataset";
import { Scale } from "@/mixins/scales";
import { scaleBand, scaleLinear } from "d3-scale";
import { ContainerSize } from '@/types/size';

const width = 640;
const height = 480;

export const data: Data<DatasetValueObject<number>> = [
    { values: [
        { value: 10 },
        { value: -40 },
        { value: 30 },
        { value: 20 },
        { value: -70 },
        { value: 60 },
        { value: 50 },
    ] },
];

export const labels: Array<string> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const containerSize: ContainerSize = { width, height };

const highestValue = Math.max(...data[0].values.map(({ value }) => value));

export const xScale: Scale = scaleBand<number>()
    .domain(labels.map((_, i) => i))
    .range([0, width]);
export const yScale: Scale = scaleLinear<number>()
    .domain([0, highestValue])
    .range([0, height])
