import { curveStep } from 'd3';

const DATASETS = {
  Basic: {
    data: [
      {
        values: [
          {
            label: 'Students from the University of Amsterdam',
            color: 'skyblue',
            value: 'students',
            targets: [
              { node: 'passed', value: 60 },
              { node: 'retriedExam', value: 50 },
              { node: 'skipped', value: 0 },
            ],
          },
          {
            label: 'Retried exam',
            color: 'skyblue',
            value: 'retriedExam',
            targets: [
              { node: 'failed', value: 10, color: 'red' },
              { node: 'passed', value: 40 },
            ],
          },
          {
            label: 'Passed',
            color: 'skyblue',
            value: 'passed',
          },
          {
            label: 'Failed',
            color: 'red',
            value: 'failed',
          },
          {
            label: 'Skipped',
            value: 'skipped',
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
            label: 'Pets',
            color: 'skyblue',
            value: 'pets',
            targets: [
              { node: 'dogs', value: 400 },
              { node: 'cats', value: 300 },
              { node: 'otherPets', value: 200 },
            ],
          },
          {
            label: 'Cats',
            color: 'royalblue',
            value: 'cats',
            targets: [
              { node: 'medicalCare', value: 50 },
              { node: 'foodAndTreats', value: 120 },
              { node: 'litter', value: 30 },
              { node: 'toys', value: 50 },
              { node: 'misc', value: 50 },
            ],
          },
          {
            label: 'Dogs',
            color: 'royalblue',
            value: 'dogs',
            targets: [
              { node: 'medicalCare', value: 100 },
              { node: 'foodAndTreats', value: 140 },
              { node: 'litter', value: 40 },
              { node: 'toys', value: 60 },
              { node: 'misc', value: 60 },
            ],
          },
          {
            label: 'Other pets',
            value: 'otherPets',
            color: 'grey',
            targets: [
              { node: 'medicalCare', value: 50 },
              { node: 'foodAndTreats', value: 40 },
              { node: 'litter', value: 10 },
              { node: 'toys', value: 60 },
              { node: 'misc', value: 40 },
            ],
          },
          {
            label: 'Medical care',
            value: 'medicalCare',
            color: 'red',
          },
          {
            label: 'Food and treats',
            value: 'foodAndTreats',
            color: 'violet',
          },
          {
            label: 'Litter',
            value: 'litter',
            color: 'darkteal',
          },
          {
            label: 'Toys',
            value: 'toys',
            color: 'gold',
          },
          {
            label: 'Misc',
            value: 'misc',
            color: 'grey',
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
            value: 'A',
            targets: [
              { node: 'C', value: 20 },
              { node: 'D', value: 15 },
            ],
          },
          {
            value: 'B',
            targets: [{ node: 'D', value: 10 }],
          },
          {
            label: 'C',
            value: 'C',
            targets: [
              { node: 'E', value: 15 },
              { node: 'F', value: 5 },
            ],
          },
          {
            label: 'D',
            value: 'D',
            targets: [{ node: 'F', value: 25 }],
          },
          {
            label: 'E',
            value: 'E',
            color: 'royalblue',
            targets: [
              { node: 'G', value: 10 },
              { node: 'H', value: 5, color: 'darkteal' },
            ],
          },
          {
            label: 'F',
            value: 'F',
            color: 'red',
            targets: [
              { node: 'G', value: 10 },
              { node: 'H', value: 20, color: 'darkteal' },
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
            color: 'darkteal',
          },
        ],
      },
    ],
  },
  Empty: {
    data: [],
    labels: [],
  },
  CustomCurveFunction: {
    data: [
      {
        values: [
          {
            label: 'Darcy',
            value: 'darcy',
            color: 'darkteal',
            targets: [
              { node: 'litter', value: 47, curveFunction: curveStep },
              { node: 'foodAndTreats', value: 30 },
            ],
          },
          {
            label: 'Max',
            value: 'max',
            targets: [
              { node: 'foodAndTreats', value: 31 },
              { node: 'litter', value: 34 },
              { node: 'toys', value: 34 },
            ],
          },
          {
            label: 'Food and treats',
            value: 'foodAndTreats',
          },
          {
            label: 'Litter',
            value: 'litter',
          },
          {
            label: 'Toys',
            value: 'toys',
          },
        ],
      },
    ],
  },
  Offset: {
    data: [
      {
        values: [
          {
            label: 'Pets',
            color: 'skyblue',
            value: 'pets',
            targets: [
              { node: 'dogs', value: 400 },
              { node: 'cats', value: 300 },
              { node: 'otherPets', value: 200 },
            ],
          },
          {
            label: 'Cats',
            color: 'royalblue',
            value: 'cats',
            targets: [
              { node: 'medicalCare', value: 50 },
              { node: 'foodAndTreats', value: 120 },
              { node: 'litter', value: 30 },
              { node: 'toys', value: 50 },
              { node: 'misc', value: 50 },
            ],
          },
          {
            label: 'Dogs (offset by 40px)',
            color: 'royalblue',
            value: 'dogs',
            targets: [
              { node: 'medicalCare', value: 100 },
              { node: 'foodAndTreats', value: 140 },
              { node: 'litter', value: 40 },
              { node: 'toys', value: 60 },
              { node: 'misc', value: 60 },
            ],
            offset: 40,
          },
          {
            label: 'Other pets (offset by 10px)',
            value: 'otherPets',
            color: 'grey',
            targets: [
              { node: 'medicalCare', value: 50 },
              { node: 'foodAndTreats', value: 40 },
              { node: 'litter', value: 10 },
              { node: 'toys', value: 60 },
              { node: 'misc', value: 40 },
            ],
            offset: 10,
          },
          {
            label: 'Medical care',
            value: 'medicalCare',
            color: 'red',
          },
          {
            label: 'Food and treats (offset by -30px)',
            value: 'foodAndTreats',
            color: 'violet',
            offset: -30,
          },
          {
            label: 'Litter',
            value: 'litter',
            color: 'darkteal',
          },
          {
            label: 'Toys',
            value: 'toys',
            color: 'gold',
          },
          {
            label: 'Misc',
            value: 'misc',
            color: 'grey',
          },
        ],
      },
    ],
  },
};

export default DATASETS;
