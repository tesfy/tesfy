import Engine from '../src/Engine';
// @ts-ignore
import * as datafile from './fixtures/datafile.json';

describe('Engine', () => {
  test('should allocate experiment inside variation', () => {
    const userId = '676380e0-7793-44d6-9189-eb5868e17a86';
    const engine = new Engine({ datafile, userId });

    expect(engine.getVariationId('experiment-1')).toBe('0');
  });

  test('should not allocate experiment inside variation', () => {
    const userId = '111180e0-7793-44d6-9189-eb5868e17a86';
    const engine = new Engine({ datafile, userId });

    expect(engine.getVariationId('experiment-1')).toBeNull();
  });

  test('should not allocate experiment inside variation due traffic allocation', () => {
    const userId = '111180e0-7793-44d6-9189-eb5868e17a86';
    const engine = new Engine({ datafile, userId });

    expect(engine.getVariationId('experiment-2')).toBeNull();
  });

  test('should allocate experiment inside same variation regarding traffic allocation change', () => {
    const userId = '676380e0-7793-44d6-9189-eb5868e17aqq';
    const { experiments } = datafile;
    const experimentId = 'experiment-2';
    const variationId = '2';
    let engine;

    engine = new Engine({ datafile, userId });

    expect(engine.getVariationId(experimentId)).toBe(variationId);

    engine = new Engine({
      datafile: {
        ...datafile,
        experiments: {
          ...experiments,
          [experimentId]: {
            ...experiments[experimentId],
            percentage: 100
          }
        }
      },
      userId
    });

    expect(engine.getVariationId(experimentId)).toBe(variationId);
  });

  test('should get all variations', () => {
    const userId = '676380e0-7793-44d6-9189-eb5868e17a86';
    const engine = new Engine({ datafile, userId });

    expect(engine.getVariationIds()).toEqual({
      'experiment-1': '0',
      'experiment-2': null,
      'experiment-3': null
    });
  });

  test('should set user id properly', () => {
    const userId = '676380e0-7793-44d6-9189-eb5868e17a86';
    const engine = new Engine({ datafile, userId });

    engine.setUserId('111180e0-7793-44d6-9189-eb5868e17a86');

    expect(engine.getVariationId('experiment-1')).toBeNull();
  });

  test('should match audience before bucketing experiment', () => {
    const userId = '676380e0-7793-44d6-9189-eb5868e17a86';
    const engine = new Engine({ datafile });

    expect(
      engine.getVariationId('experiment-3', userId, {
        countryCode: 'tr'
      })
    ).toBeNull();

    expect(
      engine.getVariationId('experiment-3', userId, {
        countryCode: 'us'
      })
    ).toBe('0');
  });

  test('should set attributes properly', () => {
    const userId = '676380e0-7793-44d6-9189-eb5868e17a86';
    const engine = new Engine({ datafile, userId });

    expect(engine.getVariationId('experiment-3')).toBeNull();

    engine.setAttributes({
      countryCode: 'us'
    });

    expect(engine.getVariationId('experiment-3')).toBe('0');
  });

  test('should bucket enabled feature', () => {
    const userId = '111180e0-8213-4dd6-9189-eb5868e17a86';
    const engine = new Engine({ datafile, userId });

    expect(engine.isFeatureEnabled('feature-1')).toBeTruthy();
  });

  test('should bucket disabled feature', () => {
    const userId = '111180e0-7793-44d6-9189-eb5868e17a86';
    const engine = new Engine({ datafile, userId });

    expect(engine.isFeatureEnabled('feature-1')).toBeFalsy();
  });

  test('should get all enabled features', () => {
    const userId = '111180e0-8213-4dd6-9189-eb5868e17a86';
    const engine = new Engine({ datafile, userId });

    expect(engine.getEnabledFeatures()).toEqual({
      'feature-1': true,
      'feature-2': null
    });
  });

  test('should disabled feature if not defined', () => {
    const userId = '111180e0-7793-44d6-9189-eb5868e17a86';
    const engine = new Engine({ datafile, userId });

    expect(engine.isFeatureEnabled('feature-x')).toBeNull();
  });

  test('should match audience before bucketing feature', () => {
    const userId = '111180e0-8213-4dd6-9189-eb5868e17a86';
    const engine = new Engine({ datafile });

    expect(engine.isFeatureEnabled('feature-2', userId, { price: 10 })).toBeNull();
    expect(engine.isFeatureEnabled('feature-2', userId, { price: 60 })).toBeTruthy();
  });

  test('should force variation', () => {
    const userId = '676380e0-7793-44d6-9189-eb5868e17a86';
    const engine = new Engine({ datafile, userId });

    engine.setForcedVariation('experiment-1', '1');
    expect(engine.getVariationId('experiment-1')).toBe('1');
  });
});
