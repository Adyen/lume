const SNAPSHOT_PATH = 'test/unit/snapshots';
const COMPONENT_PATH = 'src/components';

// eslint-disable-next-line no-undef
module.exports = {
  // Outputs snapshots to test/unit/snapshots
  // (e.g. test/unit/snapshots/lume-line-chart/lume-line-chart.spec.ts.snap)
  resolveSnapshotPath: (testPath, snapshotExtension) =>
    testPath.replace(COMPONENT_PATH, SNAPSHOT_PATH) + snapshotExtension,
  resolveTestPath: (snapshotFilePath, snapshotExtension) =>
    snapshotFilePath
      .replace(SNAPSHOT_PATH, COMPONENT_PATH)
      .slice(0, -snapshotExtension.length),
  testPathForConsistencyCheck:
    'src/components/charts/lume-bar-chart/lume-bar-chart.spec.ts',
};
