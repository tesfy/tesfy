import Config from '../Config';
import * as datafile from './fixtures/datafile.json';

const TOTAL_BUCKETS = 10000;

describe('Config', () => {
  test('should get experiment by id', () => {
    const config = new Config(datafile, TOTAL_BUCKETS);
    const experiment = config.getExperiment('experiment-1');

    expect('experiment-1').toBe(experiment.id);
  });

  test('should get feature by id', () => {
    const config = new Config(datafile, TOTAL_BUCKETS);
    const experiment = config.getFeature('feature-1');

    expect('feature-1').toBe(experiment.id);
  });

  test('should get experiment allocations', () => {
    const config = new Config(datafile, TOTAL_BUCKETS);
    const allocations = config.getExperimentAllocations('experiment-1');

    expect(allocations).toEqual([
      {
        id: '0',
        rangeEnd: 3000,
      },
      {
        id: '1',
        rangeEnd: 7000,
      },
    ]);
  });

  test('should get feature allocation', () => {
    const config = new Config(datafile, TOTAL_BUCKETS);
    const allocations = config.getFeatureAllocation('feature-1');

    expect(allocations).toEqual({
      id: 'feature-1',
      rangeEnd: 5000,
    });
  });
});
