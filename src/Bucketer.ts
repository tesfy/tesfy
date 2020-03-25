// @ts-ignore
import * as murmurhash from "murmurhash";
import { IAllocation } from './Config';

const HASH_SEED = 1;
const MAX_HASH_VALUE = Math.pow(2, 32);
const MAX_TRAFFIC_VALUE = 10000;

class Bucketer {
  private computeBucketId(id: string): number {
    // @ts-ignore
    const hashValue = murmurhash.v3(id, HASH_SEED);
    const ratio = hashValue / MAX_HASH_VALUE;

    return Math.floor(ratio * MAX_TRAFFIC_VALUE);
  }

  bucket(key: string, allocations: Array<IAllocation>): string | null {
    const bucketId = this.computeBucketId(key);
    console.log('bucketId', bucketId);
    const allocation = allocations
      .find(allocation => bucketId < allocation.rangeEnd);

    if (allocation) {
      return allocation.id;
    }

    return null;
  }
}

export default Bucketer;
