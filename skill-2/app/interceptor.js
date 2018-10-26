const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

const LocalizationInterceptor = {
  process(handlerInput) {
      const localizationClient = i18n.use(sprintf).init({
          lng: handlerInput.requestEnvelope.request.locale,
          overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
          resources: languageStrings,
          returnObjects: true,
      });

      const attributes = handlerInput.attributesManager.getRequestAttributes();
      attributes.t = function (...args) {
          return localizationClient.t(...args);
      };
  },
}

const languageStrings = {
  en: {
      translation: {
          WELCOME: 'Welcome to Github Assistant!',
          HELP: 'Github assistant helps you to give top trending repositories in github based on programming languages. Say, Get trending javascript repositories.',
          ABOUT: 'Github assistant helps you to give top trending repositories in github based on programming languages. Say, Get trending javascript repositories.',
          STOP: 'Okay, see you next time!',
      },
  },
};

module.exports = LocalizationInterceptor
