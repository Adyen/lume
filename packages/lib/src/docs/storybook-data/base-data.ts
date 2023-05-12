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
        values: [10, 30, 50, null, 70, 40],
      },
      {
        label: 'Dogs',
        values: [15, 40, 20, -10, 40, 30],
      },
      {
        label: 'Fish',
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
  'Adoption rate overview 28 days': {
    data: [
      {
        values: [
          36, 4, 36, 36, 36, 36, 38, 36, 36, 37, 41, 41, 38, 41, 4, 36, 36, 41,
          41, 4, 38, 41, 37, 38, 37, 41, 38, 36,
        ],
        label: 'Cat adoptions',
        color: '07',
        sticky: true,
      },
      {
        values: [
          7, 8, 7, 7, 7, 7, 7, 7, 7, 7, 9, 8, 7, 8, 8, 7, 7, 9, 8, 8, 7, 9, 7,
          7, 7, 8, 7, 7,
        ],
        label: 'Dog adoptions',
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
  Empty: {
    data: [{ values: [] }],
    labels: [],
  },
};

export default DATASETS;
