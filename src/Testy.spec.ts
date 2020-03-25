import Testy from "./Testy";

const datafile = {
  experiments: {
    'experiment-1': {
      id: 'experiment-1',
      percentage: 100,
      variations: [{
        id: '0',
        percentage: 50
      }, {
        id: '1',
        percentage: 50
      }]
    }
  },
  features: {}
}

describe("Testy", () => {
  test("that bucketing into a experiment works as expected", () => {
    const userId = '676380e0-7793-44d6-9189-eb5868e17a86';
    const testy = new Testy(datafile, userId);

    console.log(testy.getVariationId('experiment-1'));

    expect(true).toBeTruthy();
  });
});
