const getTrendingRepos = require('../utils/gettrendingrepos')

const TrendingHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return request.type === 'IntentRequest' && request.intent.name === 'TrendingIntent';
  },
  handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const responseBuilder = handlerInput.responseBuilder;

    const requestAttributes = attributesManager.getRequestAttributes();

    return responseBuilder
      .speak(requestAttributes.t('ABOUT'))
      .getResponse();
  },

  async handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;

    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const language = slots["language"].value || "";
    const response = await getTrendingRepos(language);
    const speechOutput = getTextToSpeak(response)

    return responseBuilder.speak(speechOutput).getResponse();
  },

};

const getTextToSpeak = (data)=>{
  const top = data.data.items.slice(1, 10);
  const text = top.map((repo)=>repo.name).join(",")
  return text
}

module.exports = TrendingHandler
