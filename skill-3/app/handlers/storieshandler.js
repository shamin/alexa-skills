const getStories = require('../utils/getstories')

const StoriesHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return request.type === 'IntentRequest' && (request.intent.name === 'BestStoriesIntent' || request.intent.name === 'NewStoriesIntent' || request.intent.name === 'TopStoriesIntent');
  },

  async handle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const responseBuilder = handlerInput.responseBuilder;

    let type = "best"
    switch (request.intent.name) {
      case 'BestStoriesIntent':
        type = "best"
        break;
      case 'NewStoriesIntent':
        type = "new"
        break;
      case 'TopStoriesIntent':
        type = "top"
        break;
    }

    let speechOutput = ""
    try {
      const data = await getStories(type);
      speechOutput = `${type} news from hacker news ${data}`
    } catch (e) {
      speechOutput = `Some error occured!`
    }

    return responseBuilder.speak(speechOutput).getResponse();
  },

};


module.exports = StoriesHandler
