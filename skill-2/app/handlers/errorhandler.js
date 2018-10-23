const ErrorHandler = {
  canHandle() {
      return true;
  },
  handle(handlerInput, error) {
      const request = handlerInput.requestEnvelope.request;

      console.log(`Error handled: ${error.message}`);
      console.log(` Original request was ${JSON.stringify(request, null, 2)}\n`);

      return handlerInput.responseBuilder
          .speak('Sorry, I can\'t understand the command. Please say again.')
          .reprompt('Sorry, I can\'t understand the command. Please say again.')
          .getResponse();
  },
};

module.exports = ErrorHandler
