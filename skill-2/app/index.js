const Alexa = require('ask-sdk-core');
const LaunchHandler = require('./handlers/launchhandler')
const AboutHandler = require('./handlers/abouthandler')
const StopHandler = require('./handlers/stophandler')
const FallbackHandler = require('./handlers/fallbackhandler')
const SessionEndedHandler = require('./handlers/sessionendhandler')
const ErrorHandler = require('./handlers/errorhandler')

const skillBuilder = Alexa.SkillBuilders.custom();

module.exports = skillBuilder
    .addRequestHandlers(
        LaunchHandler,
        AboutHandler,
        StopHandler,
        FallbackHandler,
        SessionEndedHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();
