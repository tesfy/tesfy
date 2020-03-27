// @ts-ignore
import * as murmurhash from 'murmurhash';
import Bucketer from '../Bucketer';

jest.mock('murmurhash', () => ({
  v3: jest.fn()
}));

const TOTAL_BUCKETS = 10000;

beforeEach(() => {
  murmurhash.v3.mockClear();
});

describe('Config', () => {
  test('should get experiment by id', () => {
    const key = 'key';
    const bucketer = new Bucketer(TOTAL_BUCKETS);

    murmurhash.v3.mockReturnValueOnce(1000);

    const id = bucketer.bucket(key, [{
      id: '1',
      rangeEnd: 5000
    }]);

    expect(id).toEqual('1');
    expect(murmurhash.v3).toHaveBeenCalledWith(key, Bucketer.HASH_SEED);
  });
});
