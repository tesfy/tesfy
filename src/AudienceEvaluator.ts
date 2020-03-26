// @ts-ignore
import * as jsonLogic from 'json-logic-js';

class AudienceEvaluator {
  evaluate(audience: Object = {}, attributes: Object = {}) {
    return jsonLogic.apply(audience, attributes);
  }
}

export default AudienceEvaluator;
