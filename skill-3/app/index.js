const Alexa = require('ask-sdk-core');
const LaunchHandler = require('./handlers/launchhandler')
const StoriesHandler = require('./handlers/storieshandler')
const AboutHandler = require('./handlers/abouthandler')
const StopHandler = require('./handlers/stophandler')
const FallbackHandler = require('./handlers/fallbackhandler')
const SessionEndedHandler = require('./handlers/sessionendhandler')
const ErrorHandler = require('./handlers/errorhandler')
const LocalizationInterceptor = require('./interceptor')

const skillBuilder = Alexa.SkillBuilders.custom();

module.exports = skillBuilder
    .addRequestHandlers(
        LaunchHandler,
        AboutHandler,
        StoriesHandler,
        StopHandler,
        FallbackHandler,
        SessionEndedHandler
    )
    .addRequestInterceptors(LocalizationInterceptor)
    .addErrorHandlers(ErrorHandler)
    .lambda();
