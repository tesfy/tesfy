// @ts-ignore
import * as murmurhash from "murmurhash";

const HASH_SEED = 1;
const MAX_HASH_VALUE = Math.pow(2, 32);
const MAX_TRAFFIC_VALUE = 10000;

class Bucketer {
  generateValue(key: string): number {
    // @ts-ignore
    const hashValue = murmurhash.v3(key, HASH_SEED);
    const ratio = hashValue / MAX_HASH_VALUE;

    return Math.floor(ratio * MAX_TRAFFIC_VALUE);
  }
}

export default Bucketer;
