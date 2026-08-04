// Four node columns, where the second one holds an expandable node
export const alluvialData = [
  {
    values: [
      {
        label: 'Source A',
        color: 'skyblue',
        value: 'sourceA',
        targets: [
          { node: 'flowA', value: 60 },
          { node: 'flowB', value: 40 },
        ],
      },
      {
        label: 'Source B',
        color: 'skyblue',
        value: 'sourceB',
        targets: [
          { node: 'flowA', value: 30 },
          { node: 'flowB', value: 20 },
        ],
      },
      {
        label: 'Flow A',
        color: 'royalblue',
        value: 'flowA',
        targets: [{ node: 'stepA', value: 90 }],
      },
      {
        label: 'Flow B',
        color: 'royalblue',
        value: 'flowB',
        targets: [
          { node: 'subA', value: 30 },
          { node: 'subB', value: 18 },
          { node: 'subC', value: 12 },
        ],
        expandableNodes: ['subA', 'subB', 'subC'],
      },
      {
        label: 'Sub A',
        color: 'violet',
        value: 'subA',
        targets: [{ node: 'resultB', value: 30 }],
      },
      {
        label: 'Sub B',
        color: 'violet',
        value: 'subB',
        targets: [{ node: 'resultB', value: 18 }],
      },
      {
        label: 'Sub C',
        color: 'violet',
        value: 'subC',
        targets: [{ node: 'resultB', value: 12 }],
      },
      {
        label: 'Step A',
        color: 'royalblue',
        value: 'stepA',
        targets: [{ node: 'resultA', value: 90 }],
      },
      {
        label: 'Result A',
        color: 'skyblue',
        value: 'resultA',
      },
      {
        label: 'Result B',
        color: 'red',
        value: 'resultB',
      },
    ],
  },
];
