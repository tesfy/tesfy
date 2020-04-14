import Engine from '../src/Engine';
// @ts-ignore
import * as datafile from './fixtures/datafile.json';

describe('Engine', () => {
  test('should bucket experiment into a variation', () => {
    const userId = '676380e0-7793-44d6-9189-eb5868e17a86';
    const engine = new Engine(datafile, null, userId);

    expect(engine.getVariationId('experiment-1')).toBe('0');
  });

  test('should bucket experiment outside a variation', () => {
    const userId = '111180e0-7793-44d6-9189-eb5868e17a86';
    const engine = new Engine(datafile, null, userId);

    expect(engine.getVariationId('experiment-1')).toBe(null);
  });

  test('should bucket experiment outside a variation if not defined', () => {
    const userId = '676380e0-7793-44d6-9189-eb5868e17a86';
    const engine = new Engine(datafile, null, userId);

    expect(engine.getVariationId('experiment-x')).toBe(null);
  });

  test('should set user id properly', () => {
    const userId = '676380e0-7793-44d6-9189-eb5868e17a86';
    const engine = new Engine(datafile, null, userId);

    engine.setUserId('111180e0-7793-44d6-9189-eb5868e17a86');

    expect(engine.getVariationId('experiment-1')).toBe(null);
  });

  test('should not allocate experiment inside variation', () => {
    const userId = '111180e0-7793-44d6-9189-eb5868e17a86';
    const engine = new Engine(datafile, null, userId);

    expect(engine.getVariationId('experiment-2')).toBe(null);
  });

  test('should match audience before bucketing experiment', () => {
    const userId = '676380e0-7793-44d6-9189-eb5868e17a86';
    const engine = new Engine(datafile);

    expect(
      engine.getVariationId('experiment-3', userId, {
        countryCode: 'tr'
      })
    ).toBe(null);

    expect(
      engine.getVariationId('experiment-3', userId, {
        countryCode: 'us'
      })
    ).toBe('0');
  });

  test('should set attributes properly', () => {
    const userId = '676380e0-7793-44d6-9189-eb5868e17a86';
    const engine = new Engine(datafile, null, userId, {});

    expect(engine.getVariationId('experiment-3')).toBe(null);

    engine.setAttributes({
      countryCode: 'us'
    });

    expect(engine.getVariationId('experiment-3')).toBe('0');
  });

  test('should bucket enabled feature', () => {
    const userId = '111180e0-8213-4dd6-9189-eb5868e17a86';
    const engine = new Engine(datafile, null, userId);

    expect(engine.isFeatureEnabled('feature-1')).toBe(true);
  });

  test('should bucket disabled feature', () => {
    const userId = '111180e0-7793-44d6-9189-eb5868e17a86';
    const engine = new Engine(datafile, null, userId);

    expect(engine.isFeatureEnabled('feature-1')).toBe(false);
  });

  test('should disabled feature if not defined', () => {
    const userId = '111180e0-7793-44d6-9189-eb5868e17a86';
    const engine = new Engine(datafile, null, userId);

    expect(engine.isFeatureEnabled('feature-x')).toBe(false);
  });

  test('should match audience before bucketing feature', () => {
    const userId = '111180e0-8213-4dd6-9189-eb5868e17a86';
    const engine = new Engine(datafile, null);

    expect(engine.isFeatureEnabled('feature-2', userId, { price: 10 })).toBe(false);

    expect(engine.isFeatureEnabled('feature-2', userId, { price: 60 })).toBe(true);
  });

  test('should force variation', () => {
    const userId = '676380e0-7793-44d6-9189-eb5868e17a86';
    const engine = new Engine(datafile, null, userId);

    engine.setForcedVariation('experiment-1', '1');
    expect(engine.getVariationId('experiment-1')).toBe('1');
  });
});
