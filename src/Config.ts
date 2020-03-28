export interface Experiment {
  id: string;
  percentage: number;
  variations: Array<Variation>;
  audience?: Record<string, any>;
}

export interface Variation {
  id: string;
  percentage: number;
}

export interface Feature {
  id: string;
  percentage: number;
  audience?: Record<string, any>;
}

export interface Allocation {
  id: string;
  rangeEnd: number;
}

export interface Datafile {
  experiments?: { [id: string]: Experiment };
  features?: { [id: string]: Feature };
}

class Config {
  private datafile: Datafile;
  private maxBuckets: number;

  constructor(datafile: Datafile, maxBuckets: number) {
    this.datafile = datafile;
    this.maxBuckets = maxBuckets;
  }

  private computeRangeEnd(percentage: number): number {
    return (this.maxBuckets * percentage) / 100;
  }

  getExperiment(id: string): Experiment {
    const { experiments = {} } = this.datafile;
    return experiments[id];
  }

  getFeature(id: string): Feature {
    const { features = {} } = this.datafile;
    return features[id];
  }

  getFeatureAllocation(id: string): Allocation | undefined {
    const feature = this.getFeature(id);

    if (!feature) {
      return;
    }

    const rangeEnd = this.computeRangeEnd(feature.percentage);

    return { id, rangeEnd };
  }

  getExperimentAllocations(id: string): Array<Allocation> {
    const experiment = this.getExperiment(id);
    let acc = 0;

    return experiment.variations.map(({ id, percentage }) => {
      acc += percentage / 100;
      const rangeEnd = acc * this.computeRangeEnd(experiment.percentage);

      return { id, rangeEnd };
    });
  }
}

export default Config;
