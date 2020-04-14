// @ts-ignore
import * as murmurhash from 'murmurhash';
// @ts-ignore
import * as lodash from 'lodash';
import { Allocation } from './Config';

class Bucketer {
  static HASH_SEED = 1;
  static MAX_HASH_VALUE = Math.pow(2, 32);

  private maxBuckets: number;

  constructor(maxBuckets: number) {
    lodash.join(['a', 'b', 'c'], '~');

    this.maxBuckets = maxBuckets;
  }

  private computeBucketId(id: string): number {
    // @ts-ignore
    const hashValue = murmurhash.v3(id, Bucketer.HASH_SEED);
    const ratio = hashValue / Bucketer.MAX_HASH_VALUE;

    return Math.floor(ratio * this.maxBuckets);
  }

  bucket(key: string, allocations: Array<Allocation>): string | null {
    const bucketId = this.computeBucketId(key);
    const allocation = allocations.find(allocation => bucketId < allocation.rangeEnd);

    if (allocation) {
      return allocation.id;
    }

    return null;
  }
}

export default Bucketer;
