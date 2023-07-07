import { curveStep } from 'd3';

const DATASETS = {
  Basic: {
    data: [
      {
        values: [
          {
            label: 'A',
            color: '01',
            value: 'A',
            targets: [
              { node: 'D', value: 15 },
              { node: 'E', value: 42 },
              { node: 'G', value: 1 },
            ],
          },
          {
            label: 'B',
            color: '02',
            value: 'B',
            targets: [
              { node: 'D', value: 45 },
              { node: 'E', value: 102 },
            ],
          },
          {
            label: 'C',
            color: '03',
            value: 'C',
            targets: [{ node: 'D', value: 20 }],
          },
          {
            label: 'D',
            value: 'D',
            color: '07',
          },
          {
            label: 'E',
            value: 'E',
            color: '06',
          },
          { label: 'G', value: 'G', color: '08' },
        ],
      },
    ],
  },
  RealData: {
    data: [
      {
        values: [
          {
            label: 'Admin',
            value: 0,
            targets: [
              { node: 2, value: 70128 },
              { node: 5, value: 194612 },
              { node: 8, value: 111472 },
              { node: 9, value: 152798 },
            ],
            color: 'skyblue',
          },
          {
            label: 'Technician',
            value: 1,
            targets: [
              { node: 2, value: 70391 },
              { node: 5, value: 184143 },
              { node: 8, value: 108191 },
              { node: 9, value: 146027 },
            ],
            color: 'skyblue',
          },
          {
            label: 'Basic education',
            value: 2,
            targets: [
              { node: 6, value: 182659, color: 'red' },
              { node: 7, value: 65013 },
            ],
            color: 'skyblue',
          },
          {
            label: 'University degree',
            value: 5,
            targets: [
              { node: 6, value: 209822, color: 'red' },
              { node: 7, value: 453189 },
            ],
            color: 'skyblue',
          },
          {
            label: "Doesn't pay tax",
            value: 6,
            targets: [],
            color: 'red',
          },
          {
            label: 'Pays tax',
            value: 7,
            targets: [],
            color: 'skyblue',
          },
          {
            label: 'High school',
            value: 8,
            targets: [{ node: 7, value: 385543 }],
            color: 'skyblue',
          },
          {
            label: 'Professional course',
            value: 9,
            targets: [
              { node: 6, value: 55553, color: 'red' },
              { node: 7, value: 467895 },
            ],
            color: 'skyblue',
          },
          {
            label: 'Management',
            value: 10,
            targets: [
              { node: 2, value: 61907 },
              { node: 5, value: 163145 },
              { node: 8, value: 95489 },
              { node: 9, value: 129134 },
            ],
            color: 'skyblue',
          },
          {
            label: 'Services',
            value: 11,
            targets: [
              { node: 2, value: 45246 },
              { node: 5, value: 121111 },
              { node: 8, value: 70391 },
              { node: 9, value: 95489 },
            ],
            color: 'skyblue',
          },
        ],
      },
    ],
  },
  MultipleLevels: {
    data: [
      {
        values: [
          {
            color: '01',
            value: 'A',
            targets: [
              { node: 'C', value: 20 },
              { node: 'D', value: 15 },
            ],
          },
          {
            color: '02',
            value: 'B',
            targets: [{ node: 'D', value: 10 }],
          },
          {
            label: 'C',
            color: '03',
            value: 'C',
            targets: [
              { node: 'E', value: 15 },
              { node: 'F', value: 5 },
            ],
          },
          {
            label: 'D',
            value: 'D',
            color: '07',
            targets: [{ node: 'F', value: 25 }],
          },
          {
            label: 'E',
            value: 'E',
            color: '06',
            targets: [
              { node: 'G', value: 10 },
              { node: 'H', value: 5 },
            ],
          },
          {
            label: 'F',
            value: 'F',
            targets: [
              { node: 'G', value: 10 },
              { node: 'H', value: 20 },
            ],
          },
          {
            label: 'G',
            value: 'G',
            color: '05',
          },
          {
            label: 'H',
            value: 'H',
            color: 'royalblue',
          },
        ],
      },
    ],
  },
  MultipleLevelsWithColorDerivationFromIncomingLinks: {
    data: [
      {
        values: [
          {
            color: '01',
            value: 'A',
            targets: [
              { node: 'C', value: 20 },
              { node: 'D', value: 15 },
            ],
          },
          {
            color: '02',
            value: 'B',
            targets: [{ node: 'D', value: 10 }],
          },
          {
            label: 'C',
            color: '03',
            value: 'C',
            targets: [
              { node: 'E', value: 15 },
              { node: 'F', value: 5 },
            ],
          },
          {
            label: 'D',
            value: 'D',
            color: '07',
            targets: [{ node: 'F', value: 25 }],
          },
          {
            label: 'E',
            value: 'E',
            color: '06',
            targets: [
              { node: 'G', value: 10 },
              { node: 'H', value: 5 },
            ],
          },
          {
            label: 'F',
            value: 'F',
            targets: [
              { node: 'G', value: 10 },
              { node: 'H', value: 20 },
            ],
          },
          {
            label: 'G',
            value: 'G',
            deriveColorFromIncomingLinks: true,
          },
          {
            label: 'H',
            value: 'H',
            deriveColorFromIncomingLinks: true,
          },
        ],
      },
    ],
  },
  Empty: {
    data: [{ values: [] }],
    labels: [],
  },
  CustomCurveFunction: {
    data: [
      {
        values: [
          {
            label: 'C',
            color: 'darkteal',
            value: 'C',
            targets: [{ node: 'D', value: 6, curveFunction: curveStep }],
          },
          {
            label: 'A',
            color: 'violet',
            value: 'A',
            targets: [{ node: 'D', value: 15 }],
          },
          {
            label: 'B',
            color: 'royalblue',
            value: 'B',
            targets: [{ node: 'D', value: 20 }],
          },
          {
            label: 'D',
            value: 'D',
          },
        ],
      },
    ],
  },
};

export default DATASETS;
