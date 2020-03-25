import Bucketer from './Bucketer';
import Config, { IDatafile } from './Config';

class Testy {
  private userId: string;
  private config: Config;
  private bucketer: Bucketer;

  constructor(datafile: IDatafile, userId: string = '') {
    this.config = new Config(datafile);
    this.bucketer = new Bucketer();
    this.userId = userId;
  }

  private computeKey(id: string, userId?: string): string {
    return (userId || this.userId).concat(id);
  }

  isFeatureEnabled(featureId: string, userId?: string): boolean {
    const key = this.computeKey(featureId, userId);
    const allocation = this.config.getFeatureAllocation(featureId);

    return !!this.bucketer.bucket(key, [allocation]);
  }

  getVariationId(experimentId: string, userId?: string) {
    const key = this.computeKey(experimentId, userId);
    const allocations = this.config.getExperimentAllocations(experimentId);

    return this.bucketer.bucket(key, allocations);
  }
}

export default Testy;
