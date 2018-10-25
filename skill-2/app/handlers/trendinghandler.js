const getTrendingRepos = require('../utils/gettrendingrepos')

const TrendingHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;

    return request.type === 'IntentRequest' && request.intent.name === 'TrendingIntent';
  },

  async handle(handlerInput) {
    const responseBuilder = handlerInput.responseBuilder;

    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const language = slots["language"].value || "";
    const response = await getTrendingRepos(language);
    const speechOutput = `Top ${language} repositories ${getTextToSpeak(response)}`

    return responseBuilder.speak(speechOutput).getResponse();
  },

};

const getTextToSpeak = (data)=>{
  const top = data.data.items.slice(0, 10);
  const text = top.map((repo)=>repo.name).join(", ")
  return text
}

module.exports = TrendingHandler
