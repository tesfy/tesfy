import Testfy from '../Testfy';
import * as datafile from './fixtures/datafile.json';

describe('Testfy', () => {
  test('should bucket experiment into a variation', () => {
    const userId = '676380e0-7793-44d6-9189-eb5868e17a86';
    const testfy = new Testfy(datafile, null, userId);

    expect(testfy.getVariationId('experiment-1')).toBe('0');
  });

  test('should bucket experiment outside a variation', () => {
    const userId = '111180e0-7793-44d6-9189-eb5868e17a86';
    const testfy = new Testfy(datafile, null, userId);

    expect(testfy.getVariationId('experiment-1')).toBe(null);
  });

  test('should bucket experiment outside a variation if not defined', () => {
    const userId = '676380e0-7793-44d6-9189-eb5868e17a86';
    const testfy = new Testfy(datafile, null, userId);

    expect(testfy.getVariationId('experiment-x')).toBe(null);
  });

  test('should set user id properly', () => {
    const userId = '676380e0-7793-44d6-9189-eb5868e17a86';
    const testfy = new Testfy(datafile, null, userId);

    testfy.setUserId('111180e0-7793-44d6-9189-eb5868e17a86');

    expect(testfy.getVariationId('experiment-1')).toBe(null);
  });

  test('should not allocate experiment inside variation', () => {
    const userId = '111180e0-7793-44d6-9189-eb5868e17a86';
    const testfy = new Testfy(datafile, null, userId);

    expect(testfy.getVariationId('experiment-2')).toBe(null);
  });

  test('should match audience before bucketing experiment', () => {
    const userId = '676380e0-7793-44d6-9189-eb5868e17a86';
    const testfy = new Testfy(datafile);

    expect(testfy.getVariationId('experiment-3', userId, {
      countryCode: 'tr'
    }))
      .toBe(null);

    expect(testfy.getVariationId('experiment-3', userId, {
      countryCode: 'us'
    }))
      .toBe('0');
  });

  test('should set attributes properly', () => {
    const userId = '676380e0-7793-44d6-9189-eb5868e17a86';
    const testfy = new Testfy(datafile, null, userId, {});

    expect(testfy.getVariationId('experiment-3')).toBe(null);

    testfy.setAttributes({
      countryCode: 'us'
    });

    expect(testfy.getVariationId('experiment-3')).toBe('0');
  });

  test('should bucket enabled feature', () => {
    const userId = '111180e0-8213-4dd6-9189-eb5868e17a86';
    const testfy = new Testfy(datafile, null, userId);

    expect(testfy.isFeatureEnabled('feature-1')).toBe(true);
  });

  test('should bucket disabled feature', () => {
    const userId = '111180e0-7793-44d6-9189-eb5868e17a86';
    const testfy = new Testfy(datafile, null, userId);

    expect(testfy.isFeatureEnabled('feature-1')).toBe(false);
  });

  test('should disabled feature if not defined', () => {
    const userId = '111180e0-7793-44d6-9189-eb5868e17a86';
    const testfy = new Testfy(datafile, null, userId);

    expect(testfy.isFeatureEnabled('feature-x')).toBe(false);
  });

  test('should match audience before bucketing feature', () => {
    const userId = '111180e0-8213-4dd6-9189-eb5868e17a86';
    const testfy = new Testfy(datafile, null);

    expect(testfy.isFeatureEnabled('feature-2', userId, { price: 10 }))
      .toBe(false);

    expect(testfy.isFeatureEnabled('feature-2', userId, { price: 60 }))
      .toBe(true);
  });

  test('should force variation', () => {
    const userId = '676380e0-7793-44d6-9189-eb5868e17a86';
    const testfy = new Testfy(datafile, null, userId);

    testfy.setForcedVariation('experiment-1', '1');
    expect(testfy.getVariationId('experiment-1')).toBe('1');
  });
});
