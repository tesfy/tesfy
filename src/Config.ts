export interface IExperiment {
  id: string,
  percentage: number,
  variations: Array<IVariation>
};

export interface IVariation {
  id: string,
  percentage: number
};

export interface IFeature {
  id: string,
  isEnabled: boolean,
  percentage: number
};

export interface IAllocation {
  id: string,
  rangeEnd: number
};

export interface IDatafile {
  experiments: { [id: string]: IExperiment },
  features: { [id: string]: IFeature }
};

class Config {
  private datafile: IDatafile;

  constructor(datafile: IDatafile) {
    this.datafile = datafile;
  }

  private computeRangeEnd(percentage: number) {
    return (10000 * percentage) / 100;
  }

  getExperiment(id: string): IExperiment {
    const { experiments } = this.datafile;
    return experiments[id];
  }

  getFeature(id: string) {
    const { features } = this.datafile;
    return features[id];
  }

  getFeatureAllocation(id: string): IAllocation {
    const feature = this.getFeature(id);
    const rangeEnd = this.computeRangeEnd(feature.percentage);

    return { id, rangeEnd };
  }

  getExperimentAllocations(id: string): Array<IAllocation> {
    const experiment = this.getExperiment(id);
    let acc = 0;

    return experiment.variations
      .map(({ id, percentage }) => {
        acc += percentage / 100;
        console.log(acc);
        const rangeEnd = acc * this.computeRangeEnd(experiment.percentage);

        return { id, rangeEnd };
      });
  }
}

export default Config;
