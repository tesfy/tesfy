// @ts-ignore
import * as jsonLogic from 'json-logic-js';

class AudienceEvaluator {
  evaluate(audience: Record<string, any> = {}, attributes: Record<string, any> = {}): boolean {
    return jsonLogic.apply(audience, attributes);
  }
}

export default AudienceEvaluator;
