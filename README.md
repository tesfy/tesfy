<p align="center">
  <img alt="logo" src="https://tesfy.s3.us-west-2.amazonaws.com/images/logo.png" width="220">
</p>

<p align="center">
  A lightweight A/B Testing and Feature Flag JavaScript library focused on performance ⚡️
</p>

<p align="center">
  <img alt="license badge" src="https://img.shields.io/badge/license-MIT-blue.svg">
  <img alt="tests badge" src="https://github.com/andresz1/tesfy/workflows/main/badge.svg">
  <img alt="size badge" src="https://badgen.net/bundlephobia/minzip/tesfy">
  <a href="https://discord.gg/QxEcWYc">
  <image alt="discord chat" src="https://img.shields.io/discord/704771560782692474?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2">
    </a>
</p>

Tesfy provides a simple but complete solution to develop A/B Tests and Feature Flags on both server and client side without relying in any storage layer. The main features of this library are:
- Lightweight and focused on performance
- Experiments
- Feature Flags
- Audience definition using [jsonLogic](http://jsonlogic.com/)
- Traffic Allocation
- Sticky Bucketing


## Usage

### Installation
```sh
npm install tesfy --save
```

### Initialization
Import and instantiate it with a datafile. A datafile is a `json` that defines the experiments and features avaliable. Ideally this file should be hosted somewhere outside your application (for example in [S3](https://aws.amazon.com/s3/)), so it could be fetched during boostrap or every certain time. This will allow you to make changes to the file without deploying the application.

```ts
import * as Tesfy from 'tesfy';

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

const tesfy = new Tesfy.Engine({ datafile });
```

### Experiments
Check which variation of an experiment is assigned to a user.

```ts
const userId = '676380e0-7793-44d6-9189-eb5868e17a86';
const experimentId = 'experiment-1';

tesfy.getVariationId(experimentId, userId); // '1'
```

### Feature Flags
Check if a feature is enabled for a user.

```ts
const userId = '676380e0-7793-44d6-9189-eb5868e17a86';
const featureId = 'feature-1';

tesfy.isFeatureEnabled(featureId, userId); // true
```

### Audiences
Use attributes to target an specific audience.

```ts
const userId = '676380e0-7793-44d6-9189-eb5868e17a86';
const experimentId = 'experiment-2';

tesfy.getVariationId(experimentId, userId, { countryCode: 've' }); // null
tesfy.getVariationId(experimentId, userId, { countryCode: 'us' }); // '0'
```

### Sticky Bucketing
Optionally add a storage layer when instantiating tesfy. This layer could be whatever you want (memory cache, [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) among others). This way even allocation or attributes change users will stick with same variation.

```ts
const tesfy = new Tesfy.Engine({
  datafile,
  storage: {
    get: (experimentId: string) => {
      return storage.get(experimentId);
    },
    store: (experimentId: string, variationId: string) => {
      return storage.save(experimentId, variationId);
    }
  }
});
const userId = '676380e0-7793-44d6-9189-eb5868e17a86';
const experimentId = 'experiment-2';

tesfy.getVariationId(experimentId, userId, { countryCode: 'us' }); // '0'
tesfy.getVariationId(experimentId, userId, { countryCode: 've' }); // '0'
```

## Integrations

Tesfy could be integrated with several JavaScript frameworks or libraries to provide a better API to use alongside those.
- [react-tesfy](https://github.com/andresz1/react-tesfy)

## Feedback

Pull requests, feature ideas and bug reports are very welcome. We highly appreciate any feedback.
