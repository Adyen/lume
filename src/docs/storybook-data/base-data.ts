function randomValues(length: number, min: number, max: number) {
  return [...Array(length)].map(
    () => Math.floor(Math.random() * (max - min + 1)) + min
  );
}

const DATASETS = {
  Single: {
    data: [
      {
        values: [30, -10, 0.1, 70, 50, null, 40],
        // color: '02',
        label: 'Hot dogs',
      },
    ],
    labels: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
  },
  Multiple: {
    data: [
      {
        label: 'Cats',
        // color: '01',
        values: [10, 30, 25, null, 50, 40],
      },
      {
        label: 'Dogs',
        // color: '02',
        values: [15, 40, 20, -10, 40, 30],
      },
      {
        label: 'Fish',
        // color: '03',
        values: [8, 20, 10, 45, 50, 55],
      },
    ],
    labels: [
      'Jan 2022',
      'Feb 2022',
      'Mar 2022',
      'Apr 2022',
      'May 2022',
      'Jun 2022',
    ],
  },
  Maximum: {
    data: [
      {
        label: 'Cats',
        values: randomValues(10, 1000, 10000),
      },
      {
        label: 'Dogs',
        values: randomValues(10, 1000, 10000),
      },
      {
        label: 'Ferrets',
        values: randomValues(10, 1000, 10000),
      },
      {
        label: 'Rabbits',
        values: randomValues(10, 1000, 10000),
      },
      {
        label: 'Hamsters',
        values: randomValues(10, 1000, 10000),
      },
      {
        label: 'Other',
        values: randomValues(10, 1000, 10000),
        color: '07',
      },
    ],
    labels: [...Array(10)].map((_, i) => {
      const date = new Date();
      date.setDate(1);
      date.setMonth(date.getMonth() + i);
      return date.toLocaleString('en', { month: 'short', year: 'numeric' });
    }),
  },
  'Chargebacks_Fraud overview 28 days': {
    data: [
      {
        values: [
          0.0036, 0.004, 0.0036, 0.0036, 0.0036, 0.0036, 0.0038, 0.0036, 0.0036,
          0.0037, 0.0041, 0.0041, 0.0038, 0.0041, 0.004, 0.0036, 0.0036, 0.0041,
          0.0041, 0.004, 0.0038, 0.0041, 0.0037, 0.0038, 0.0037, 0.0041, 0.0038,
          0.0036,
        ],
        label: 'Chargebacks',
        color: '07',
        sticky: true,
      },
      {
        values: [
          0.0007, 0.0008, 0.0007, 0.0007, 0.0007, 0.0007, 0.0007, 0.0007,
          0.0007, 0.0007, 0.0009, 0.0008, 0.0007, 0.0008, 0.0008, 0.0007,
          0.0007, 0.0009, 0.0008, 0.0008, 0.0007, 0.0009, 0.0007, 0.0007,
          0.0007, 0.0008, 0.0007, 0.0007,
        ],
        label: 'NOFs',
        color: '06',
        sticky: true,
      },
    ],
    labels: [
      'Apr 7',
      'Apr 8',
      'Apr 9',
      'Apr 10',
      'Apr 11',
      'Apr 12',
      'Apr 13',
      'Apr 14',
      'Apr 15',
      'Apr 16',
      'Apr 17',
      'Apr 18',
      'Apr 19',
      'Apr 20',
      'Apr 21',
      'Apr 22',
      'Apr 23',
      'Apr 24',
      'Apr 25',
      'Apr 26',
      'Apr 27',
      'Apr 28',
      'Apr 29',
      'Apr 30',
      'May 1',
      'May 2',
      'May 3',
      'May 4',
    ],
  },
};

export default DATASETS;
