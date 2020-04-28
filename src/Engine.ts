import Bucketer from './Bucketer';
import AudienceEvaluator from './AudienceEvaluator';
import Config, { Datafile } from './Config';
import Storage from './Storage';

class Engine {
  static readonly TOTAL_BUCKETS = 10000;

  private config: Config;
  private bucketer: Bucketer;
  private evaluator: AudienceEvaluator;
  private userId?: string;
  private attributes?: Record<string, any>;
  private storage?: Storage<string>;
  private cache: { [id: string]: string } = {};

  constructor({
    datafile,
    userId,
    attributes,
    storage
  }: {
    datafile: Datafile;
    storage?: Storage<string>;
    userId?: string;
    attributes?: Record<string, any>;
  }) {
    this.config = new Config(datafile, Engine.TOTAL_BUCKETS);
    this.bucketer = new Bucketer(Engine.TOTAL_BUCKETS);
    this.evaluator = new AudienceEvaluator();
    this.storage = storage;
    this.userId = userId;
    this.attributes = attributes;
  }

  private computeKey(id: string, userId?: string): string {
    return (userId || this.userId || '').concat(id);
  }

  private getForcedVariation(experimentId: string): string | undefined {
    return this.cache[experimentId];
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  setAttributes(attributes: Record<string, any> = {}): void {
    this.attributes = attributes;
  }

  setForcedVariation(experimentId: string, variationId: string): void {
    this.cache[experimentId] = variationId;
  }

  isFeatureEnabled(featureId: string, userId?: string, attributes?: Record<string, any>): boolean {
    const key = this.computeKey(featureId, userId);
    const feature = this.config.getFeature(featureId);

    if (!feature) {
      return false;
    }

    const { audience } = feature;
    const allocation = this.config.getFeatureAllocation(featureId);

    if (!allocation || !this.evaluator.evaluate(audience, attributes || this.attributes)) {
      return false;
    }

    return !!this.bucketer.bucket(key, [allocation]);
  }

  getEnabledFeatures(
    userId?: string,
    attributes?: Record<string, any>
  ): { [featureId: string]: boolean } {
    const features = this.config.getFeatures();

    return Object.keys(features).reduce((features, featureId) => {
      return {
        ...features,
        [featureId]: this.isFeatureEnabled(featureId, userId, attributes)
      };
    }, {});
  }

  getVariationId(
    experimentId: string,
    userId?: string,
    attributes?: Record<string, any>
  ): string | null {
    let variationId = this.getForcedVariation(experimentId) || this.storage?.get(experimentId);

    if (variationId) {
      return variationId;
    }

    const experiment = this.config.getExperiment(experimentId);

    if (!experiment) {
      return null;
    }

    const { audience } = experiment;

    if (!this.evaluator.evaluate(audience, attributes || this.attributes)) {
      return null;
    }

    const key = this.computeKey(experimentId, userId);
    const allocations = this.config.getExperimentAllocations(experimentId);

    variationId = this.bucketer.bucket(key, allocations);
    this.storage?.store(experimentId, variationId);

    return variationId;
  }

  getVariationIds(
    userId?: string,
    attributes?: Record<string, any>
  ): { [experimentId: string]: string } {
    const experiments = this.config.getExperiments();

    return Object.keys(experiments).reduce((experiments, experimentId) => {
      return {
        ...experiments,
        [experimentId]: this.getVariationId(experimentId, userId, attributes)
      };
    }, {});
  }
}

export default Engine;
