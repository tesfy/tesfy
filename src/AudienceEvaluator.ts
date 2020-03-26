// @ts-ignore
import jsonLogic from 'json-logic-js';

class AudienceEvaluator {
  evaluate(audience: Object, attributes: Object) {
    return jsonLogic(audience, attributes);
  }
}

export default AudienceEvaluator;
