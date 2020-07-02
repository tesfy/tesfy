import Config from '../src/Config';
import * as datafile from './fixtures/datafile.json';

const TOTAL_BUCKETS = 10000;

describe('Config', () => {
  test('should get experiments', () => {
    const config = new Config(datafile, TOTAL_BUCKETS);
    const experiments = config.getExperiments();

    expect(datafile.experiments).toBe(experiments);
  });

  test('should get experiment by id', () => {
    const config = new Config(datafile, TOTAL_BUCKETS);
    const experiment = config.getExperiment('experiment-1');

    expect('experiment-1').toBe(experiment.id);
  });

  test('should get features', () => {
    const config = new Config(datafile, TOTAL_BUCKETS);
    const features = config.getFeatures();

    expect(datafile.features).toBe(features);
  });

  test('should get feature by id', () => {
    const config = new Config(datafile, TOTAL_BUCKETS);
    const experiment = config.getFeature('feature-1');

    expect('feature-1').toBe(experiment.id);
  });

  test('should get experiment allocations', () => {
    const config = new Config(datafile, TOTAL_BUCKETS);
    const allocations = config.getExperimentAllocations('experiment-2');

    expect(allocations).toEqual([
      {
        id: '0',
        rangeEnd: 3400
      },
      {
        id: '1',
        rangeEnd: 6700
      },
      {
        id: '2',
        rangeEnd: 10000
      }
    ]);
  });

  test('should get feature allocation', () => {
    const config = new Config(datafile, TOTAL_BUCKETS);
    const allocations = config.getFeatureAllocation('feature-1');

    expect(allocations).toEqual({
      id: 'feature-1',
      rangeEnd: 5000
    });
  });
});
