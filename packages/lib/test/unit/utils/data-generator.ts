const defaultLabels = 12;
const maxNumberOfEdges = 4;
const maxNumberOfColors = 7;
const defaultHighestValue = 1000;

export const generateData = (
  numberOfLabels = defaultLabels,
  highestValue = defaultHighestValue
) => {
  const labels = [];
  const data = [];
  for (let i = 0; i < numberOfLabels; i++) {
    labels.push(`label-${i + 1}`);
    const edges = Math.floor(Math.random() * maxNumberOfEdges);
    const targets = [];
    const accountedFor = [];
    // Make sure there are options left to link to, otherwise we'll get stuck in an infinite loop,
    // Keeping in mind the own entry doesn't count, we subtract 1 extra
    for (
      let j = 0;
      j < edges && accountedFor.length < numberOfLabels - i - 1;
      j++
    ) {
      let target = null;
      // Make sure we don't register double entries or links to self
      while (target === null || target === i || accountedFor.includes(target)) {
        target = Math.floor(i + Math.random() * (numberOfLabels - i));
      }
      accountedFor.push(target);
      const value = Math.floor(Math.random() * highestValue);
      targets.push({ node: `label-${target + 1}`, value });
    }
    data.push({
      label: labels[i],
      color: `0${1 + (i % maxNumberOfColors)}`,
      value: labels[i],
      targets,
    });
  }

  return [
    {
      values: data,
    },
  ];
};
