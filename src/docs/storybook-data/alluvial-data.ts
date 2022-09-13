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
              { node: 'E', value: 42 },
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
        nodePadding: 20,
        nodeWidth: 16,
      },
    ],
  },
  RealData: {
    data: [
      {
        values: [
          {
            label: 'Other',
            value: 0,
            targets: [
              { node: 2, value: 70128, color: '03' },
              { node: 5, value: 194612, color: '03' },
              { node: 8, value: 111472, color: '03' },
              { node: 9, value: 152798, color: '03' },
            ],
            color: '03',
          },
          {
            label: 'Visa',
            value: 1,
            targets: [
              { node: 2, value: 70391, color: '03' },
              { node: 5, value: 184143, color: '03' },
              { node: 8, value: 108191, color: '03' },
              { node: 9, value: 146027, color: '03' },
            ],
            color: '03',
          },
          {
            label: 'No 3DS',
            value: 2,
            targets: [
              { node: 3, value: 182659, color: '03' },
              { node: 4, value: 65013, color: '09' },
            ],
            color: '03',
          },
          {
            label: 'Authorized',
            value: 3,
            targets: [],
            color: '03',
          },
          { label: 'Refused', value: 4, targets: [], color: '09' },
          {
            label: '3DS1',
            value: 5,
            targets: [
              { node: 6, value: 209822, color: '09' },
              { node: 7, value: 453189, color: '03' },
            ],
            color: '03',
          },
          {
            label: 'Failed authentications',
            value: 6,
            targets: [],
            color: '09',
          },
          {
            label: 'Authenticated',
            value: 7,
            targets: [
              { node: 3, value: 1107265, color: '03' },
              { node: 4, value: 199362, color: '09' },
            ],
            color: '03',
          },
          {
            label: '3DS2 Frictionless',
            value: 8,
            targets: [{ node: 7, value: 385543, color: '03' }],
            color: '03',
          },
          {
            label: '3DS2 Challenged',
            value: 9,
            targets: [
              { node: 6, value: 55553, color: '09' },
              { node: 7, value: 467895, color: '03' },
            ],
            color: '03',
          },
          {
            label: 'Mastercard',
            value: 10,
            targets: [
              { node: 2, value: 61907, color: '03' },
              { node: 5, value: 163145, color: '03' },
              { node: 8, value: 95489, color: '03' },
              { node: 9, value: 129134, color: '03' },
            ],
            color: '03',
          },
          {
            label: 'Cartes Bancaires',
            value: 11,
            targets: [
              { node: 2, value: 45246, color: '03' },
              { node: 5, value: 121111, color: '03' },
              { node: 8, value: 70391, color: '03' },
              { node: 9, value: 95489, color: '03' },
            ],
            color: '03',
          },
        ],
      },
    ],
  },
};

export default DATASETS;
