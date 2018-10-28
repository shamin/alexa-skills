const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const responseBuilder = handlerInput.responseBuilder;

    const requestAttributes = attributesManager.getRequestAttributes();
    return responseBuilder
      .speak(requestAttributes.t('HELP'))
      .reprompt(requestAttributes.t('HELP'))
      .getResponse();
  },
};

module.exports = HelpHandler
