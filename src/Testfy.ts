import Bucketer from './Bucketer';
import AudienceEvaluator from './AudienceEvaluator';
import Config, { IDatafile } from './Config';
import StorageInterface from './StorageInterface';

class Testfy {
  static readonly TOTAL_BUCKETS = 10000;

  private userId: string;
  private attributes: Object;
  private config: Config;
  private bucketer: Bucketer;
  private evaluator: AudienceEvaluator;
  private storage: StorageInterface<string> | null;
  private cache: { [id: string]: string } = {};

  constructor(
    datafile: IDatafile,
    storage: StorageInterface<string> | null = null,
    userId: string = '',
    attributes: Object = {}
  ) {
    this.config = new Config(datafile, Testfy.TOTAL_BUCKETS);
    this.bucketer = new Bucketer(Testfy.TOTAL_BUCKETS);
    this.evaluator = new AudienceEvaluator();
    this.storage = storage;
    this.userId = userId;
    this.attributes = attributes;
  }

  private computeKey(id: string, userId?: string): string {
    return (userId || this.userId).concat(id);
  }

  private getForcedVariation(experimentId: string) {
    return this.cache[experimentId];
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  setAttributes(attributes: Object = {}) {
    this.attributes = attributes;
  }

  setForcedVariation(experimentId: string, variationId: string) {
    this.cache[experimentId] = variationId;
  }

  isFeatureEnabled(featureId: string, userId?: string, attributes?: Object): boolean {
    const key = this.computeKey(featureId, userId);
    const { audience } = this.config.getFeature(featureId);
    const allocation = this.config.getFeatureAllocation(featureId);

    if (!this.evaluator.evaluate(audience, attributes || this.attributes)) {
      return false;
    }

    return !!this.bucketer.bucket(key, [allocation]);
  }

  getVariationId(experimentId: string, userId?: string, attributes?: Object): string | null {
    let variationId = this.getForcedVariation(experimentId) || this.storage?.get(experimentId);

    if (variationId) {
      return variationId;
    }

    const { audience } = this.config.getExperiment(experimentId);

    if (!this.evaluator.evaluate(audience, attributes || this.attributes)) {
      return null;
    }

    const key = this.computeKey(experimentId, userId);
    const allocations = this.config.getExperimentAllocations(experimentId);

    variationId = this.bucketer.bucket(key, allocations);
    this.storage?.store(experimentId, variationId);

    return variationId;
  }
}

export default Testfy;
