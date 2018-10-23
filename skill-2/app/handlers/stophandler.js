const StopHandler = {
  canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;

      return request.type === 'IntentRequest'
          && (request.intent.name === 'AMAZON.NoIntent'
          || request.intent.name === 'AMAZON.CancelIntent'
          || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
      const attributesManager = handlerInput.attributesManager;
      const responseBuilder = handlerInput.responseBuilder;

      const requestAttributes = attributesManager.getRequestAttributes();
      return responseBuilder
          .speak(requestAttributes.t('STOP'))
          .getResponse();
  },
};

module.exports = StopHandler
