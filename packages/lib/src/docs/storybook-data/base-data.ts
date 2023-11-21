const DATASETS = {
  Single: {
    data: [
      {
        values: [
          60, 80, 70, 30, 60, 90, 120, 220, 170, 190, 150, 80, 100, 125, 70,
        ],
        label: 'Dogs',
      },
    ],
    labels: [
      'Jan 1',
      'Jan 2',
      'Jan 3',
      'Jan 4',
      'Jan 5',
      'Jan 6',
      'Jan 7',
      'Jan 8',
      'Jan 9',
      'Jan 10',
      'Jan 11',
      'Jan 12',
      'Jan 13',
      'Jan 14',
      'Jan 15',
    ],
    title: 'Dogs petted over time',
  },
  LifeExpectancy: {
    data: [
      {
        values: [18, 15, 9, 25, 8],
        label: 'Life expectancy',
      },
    ],
    labels: ['Cats', 'Dogs', 'Birds', 'Snakes', 'Frogs'],
    title: 'Life expectancy',
  },
  AdoptedAnimals: {
    data: [
      {
        label: 'Cats',
        values: [11000, 12000, 4000, 15000],
      },
      {
        label: 'Dogs',
        values: [5000, 8000, 2000, 4000],
      },
      {
        label: 'Horses',
        values: [500, 11000, 1000],
      },
    ],
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    title: 'Adopted animals',
  },
  MissingDataPoints: {
    data: [
      {
        label: 'Spent on cats',
        values: [10000, 2000, 15000, 0.5, null, 18000],
      },
    ],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  },
  WeeklyAnimalEncounter: {
    data: [
      {
        label: 'Cats',
        values: [10, 70, 25, 35],
      },
      {
        label: 'Dogs',
        values: [30, 20, 10, 25],
      },
      {
        label: 'Birds',
        values: [60, 70, 25],
      },
    ],
    labels: ['NL', 'India', 'UK', 'France'],
    title: 'Weekly animal encounter',
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
  CatsMetIn2023: {
    data: [
      {
        values: [15, 25, 30, null, 40, 50, 60, 12, 30, 12, 344, 400],
        label: 'Cats',
      },
    ],
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
  },
  AnimalsMetIn2023: {
    data: [
      {
        values: [15, 25, 30, null, 40, 50, 60, 12, 30],
        label: 'Cats',
      },
      {
        values: [5, 15, 20, 30, 51, 70, 180, 28, 150, 172, 200, 340],
        label: 'Dogs',
      },
      {
        values: [35, 10, 18, 50, 71, null, 100, 128, 140, 162, 180, 170],
        label: 'Birds',
      },
    ],
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
  },
};

export default DATASETS;
