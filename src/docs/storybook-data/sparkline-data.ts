const DATASETS = {
  Basic: {
    data: [
      {
        values: [12, 14, 8, 10, 20, 9, 8, 4, 12, 0, 15, 8, 9, 10],
        color: '02',
        legend: 'Trend',
      },
    ],
  },
  NegativeValue: {
    data: [
      {
        values: [10, 15, 8, -4, -1, 4, 20],
        color: '09',
        legend: 'Trend',
      },
    ],
  },
  NullValues: {
    data: [
      {
        values: [30, null, 40, 50, null, null, 60, 20, 10, null],
        color: '03',
        legend: 'Trend',
      },
    ],
  },
};

export default DATASETS;
