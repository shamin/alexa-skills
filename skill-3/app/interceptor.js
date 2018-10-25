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
          WELCOME: 'Welcome to Hacker News Reader!',
          HELP: 'Hacker News Reader reads top,best and new stories from hackernews. Say, Get best stories.',
          ABOUT: 'Hacker News Reader reads top,best and new stories from hackernews. Say, Get best stories.',
          STOP: 'Okay, see you next time!',
      },
  },
};

module.exports = LocalizationInterceptor
