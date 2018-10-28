const AboutHandler = {
  canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;

      return request.type === 'IntentRequest' && request.intent.name === 'AboutIntent';
  },
  handle(handlerInput) {
      const attributesManager = handlerInput.attributesManager;
      const responseBuilder = handlerInput.responseBuilder;

      const requestAttributes = attributesManager.getRequestAttributes();

      return responseBuilder
          .speak(requestAttributes.t('ABOUT'))
          .shouldEndSession(false)
          .getResponse();
  },
};

module.exports = AboutHandler
