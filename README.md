<h1 align="center">
  testfy 🆎
</h1>

<p align="center">
  A lightway A/B Testing and Feature Flag JavaScript library focused on performance ⚡️
</p>
<p align="center">
  <img alt="license" src="https://img.shields.io/badge/license-MIT-blue.svg">
  <img alt="tests status" src="https://github.com/andresz1/size-limit-action/workflows/test/badge.svg">
</p>

Testfy provides a simple but complete solution to develop A/B Tests and Feature Flags on both server and client side without relying in any storage layer. The main features of this library are:
- Lightway and focused on performance
- Experiments
- Feature Flags
- Audience definition using [jsonLogic](http://jsonlogic.com/)
- Traffic allocation
- Sticky bucketing


## Usage
Installation
```js
npm install testfy --save
```

Import and instantiate it with a datafile. A datafile is a `json` that defines the experiments and features avaliable.
```js
import Testfy from 'testfy';

const datafile = {
  experiments: {
    'experiment-1': {
      id: 'experiment-1',
      percentage: 90,
      variations: [{
        id: '0',
        percentage: 50
      }, {
        id: '1',
        percentage: 50
      }]
    }
  }
};

const testfy = new Testfy(datafile);
```

Use testfy instance to check which `variationId` is assigned to a given `userId`
```js
const userId = '676380e0-7793-44d6-9189-eb5868e17a86';
const experimentId = 'experiment-1';

testfy.getVariationId(experimentId, userId); // '1'
```

## Feedback

Pull requests, feature ideas and bug reports are very welcome. We highly appreciate any feedback.
