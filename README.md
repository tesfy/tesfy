<h1 align="center">
  testfy 🆎
</h1>

<p align="center">
  A lightweight A/B Testing and Feature Flag JavaScript library focused on performance ⚡️
</p>
<p align="center">
  <img alt="license" src="https://img.shields.io/badge/license-MIT-blue.svg">
  <img alt="tests status" src="https://github.com/andresz1/size-limit-action/workflows/test/badge.svg">
</p>

Testfy provides a simple but complete solution to develop A/B Tests and Feature Flags on both server and client side without relying in any storage layer. The main features of this library are:
- Lightweight and focused on performance
- Experiments
- Feature Flags
- Audience definition using [jsonLogic](http://jsonlogic.com/)
- Traffic Allocation
- Sticky Bucketing


## Usage

### Installation
```ts
npm install testfy --save
```

### Initialization
Import and instantiate it with a datafile. A datafile is a `json` that defines the experiments and features avaliable. Ideally this file should be hosted somewhere outside your application (for example in [S3](https://aws.amazon.com/s3/)), so it could be fetched during boostrap or every certain time. This will allow you to make changes to the file without deploying the application.

```ts
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
    },
    'experiment-2': {
      id: 'experiment-2',
      percentage: 100,
      variations: [{
        id: '0',
        percentage: 100
      }],
      audience: {
        '==' : [{ var : 'countryCode' }, 'us']
      }
    }
  },
  features: {
    'feature-1': {
      id: 'feature-1',
      percentage: 50
    }
  }
};

const testfy = new Testfy(datafile);
```

### Experiments
Check which variation of an experiment is assigned to a user.

```js
const userId = '676380e0-7793-44d6-9189-eb5868e17a86';
const experimentId = 'experiment-1';

testfy.getVariationId(experimentId, userId); // '1'
```

### Feature Flags
Check if a feature is enabled for a user.

```ts
const userId = '676380e0-7793-44d6-9189-eb5868e17a86';
const featureId = 'feature-1';

testfy.isFeatureEnabled(featureId, userId); // true
```

### Audiences
Use attributes to target an specific audience.

```ts
const userId = '676380e0-7793-44d6-9189-eb5868e17a86';
const experimentId = 'experiment-2';

testfy.getVariationId(experimentId, userId, { countryCode: 've' }); // null
testfy.getVariationId(experimentId, userId, { countryCode: 'us' }); // '0'
```

### Sticky Bucketing
Optionally add a storage layer when instantiating testfy. This layer could be whatever you want (memory cache, [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) among others). This way even allocation or attributes change users will stick with same variation.

```ts
const testfy = new Testfy(datafile, {
  get: (experimentId: string) => {
    return storage.get(experimentId);
  },
  store: (experimentId: string, variationId: string) => {
    returb storage.save(experimentId, variationId);
  }
});
const userId = '676380e0-7793-44d6-9189-eb5868e17a86';
const experimentId = 'experiment-2';

testfy.getVariationId(experimentId, userId, { countryCode: 'us' }); // '0'
testfy.getVariationId(experimentId, userId, { countryCode: 've' }); // '0'
```

## Feedback

Pull requests, feature ideas and bug reports are very welcome. We highly appreciate any feedback.
