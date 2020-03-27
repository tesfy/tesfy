// @ts-ignore
import * as jsonLogic from 'json-logic-js';
import AudienceEvaluator from '../AudienceEvaluator';

jest.mock('json-logic-js', () => ({
  apply: jest.fn()
}));

describe('Config', () => {
  test('should evaluate audience', () => {
    const key = 'key';
    const evaluator = new AudienceEvaluator();
    const audience = {
      '==' : [
        { var : 'countryCode' },
        'us'
      ]
    };
    const attributes = { countryCode: 'us' }

    jsonLogic.apply.mockReturnValueOnce(true);

    expect(evaluator.evaluate(audience, attributes)).toEqual(true);
    expect(jsonLogic.apply).toHaveBeenCalledWith(audience, attributes);
  });
});
