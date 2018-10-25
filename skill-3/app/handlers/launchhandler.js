const LaunchHandler = {
  canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;

      return request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
      const attributesManager = handlerInput.attributesManager;
      const responseBuilder = handlerInput.responseBuilder;

      const requestAttributes = attributesManager.getRequestAttributes();
      const speechOutput = `${requestAttributes.t('WELCOME')} ${requestAttributes.t('HELP')}`;
      return responseBuilder
          .speak(speechOutput)
          .reprompt(speechOutput)
          .getResponse();
  },
};

module.exports = LaunchHandler
