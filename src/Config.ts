export interface IExperiment {
  id: string,
  percentage: number,
  variations: Array<IVariation>,
  audience?: Object
};

export interface IVariation {
  id: string,
  percentage: number
};

export interface IFeature {
  id: string,
  percentage: number,
  audience?: Object
};

export interface IAllocation {
  id: string,
  rangeEnd: number
};

export interface IDatafile {
  experiments?: { [id: string]: IExperiment },
  features?: { [id: string]: IFeature }
};

class Config {
  private datafile: IDatafile;
  private maxBuckets: number;

  constructor(datafile: IDatafile, maxBuckets: number) {
    this.datafile = datafile;
    this.maxBuckets = maxBuckets;
  }

  private computeRangeEnd(percentage: number) {
    return (this.maxBuckets * percentage) / 100;
  }

  getExperiment(id: string): IExperiment {
    const { experiments = {} } = this.datafile;
    return experiments[id];
  }

  getFeature(id: string) {
    const { features = {} } = this.datafile;
    return features[id];
  }

  getFeatureAllocation(id: string): IAllocation | undefined {
    const feature = this.getFeature(id);

    if (!feature) {
      return;
    }

    const rangeEnd = this.computeRangeEnd(feature.percentage);

    return { id, rangeEnd };
  }

  getExperimentAllocations(id: string): Array<IAllocation> {
    const experiment = this.getExperiment(id);
    let acc = 0;

    return experiment.variations
      .map(({ id, percentage }) => {
        acc += percentage / 100;
        const rangeEnd = acc * this.computeRangeEnd(experiment.percentage);

        return { id, rangeEnd };
      });
  }
}

export default Config;
