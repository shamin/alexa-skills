/* eslint-disable  func-names */
/* eslint-disable  no-console */
/* eslint-disable  no-use-before-define */


// City Guide: A sample Alexa Skill Lambda function
//  This function shows how you can manage data in objects and arrays,
//   choose a random recommendation,
//   call an external API and speak the result,
//   handle YES/NO intents with session attributes,
//   and return text data on a card.

const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');
const https = require('https');


// 1. Handlers ===================================================================================

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
            .getResponse();
    },
};

const CoffeeHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' && request.intent.name === 'CoffeeIntent';
    },
    handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        const responseBuilder = handlerInput.responseBuilder;

        const sessionAttributes = attributesManager.getSessionAttributes();
        const restaurant = randomArrayElement(getRestaurantsByMeal('coffee'));
        sessionAttributes.restaurant = restaurant.name;
        const speechOutput = `For a great coffee shop, I recommend, ${restaurant.name}. Would you like to hear more?`;

        return responseBuilder.speak(speechOutput).reprompt(speechOutput).getResponse();
    },
};

const BreakfastHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' && request.intent.name === 'BreakfastIntent';
    },
    handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        const responseBuilder = handlerInput.responseBuilder;

        const sessionAttributes = attributesManager.getSessionAttributes();
        const restaurant = randomArrayElement(getRestaurantsByMeal('breakfast'));
        sessionAttributes.restaurant = restaurant.name;
        const speechOutput = `For breakfast, try this, ${restaurant.name}. Would you like to hear more?`;

        return responseBuilder.speak(speechOutput).reprompt(speechOutput).getResponse();
    },
};

const LunchHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' && request.intent.name === 'LunchIntent';
    },
    handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        const responseBuilder = handlerInput.responseBuilder;

        const sessionAttributes = attributesManager.getSessionAttributes();
        const restaurant = randomArrayElement(getRestaurantsByMeal('lunch'));
        sessionAttributes.restaurant = restaurant.name;
        const speechOutput = `Lunch time! Here is a good spot. ${restaurant.name}. Would you like to hear more?`;

        return responseBuilder.speak(speechOutput).reprompt(speechOutput).getResponse();
    },
};

const DinnerHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' && request.intent.name === 'DinnerIntent';
    },
    handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        const responseBuilder = handlerInput.responseBuilder;

        const sessionAttributes = attributesManager.getSessionAttributes();
        const restaurant = randomArrayElement(getRestaurantsByMeal('dinner'));
        sessionAttributes.restaurant = restaurant.name;
        const speechOutput = `Enjoy dinner at, ${restaurant.name}. Would you like to hear more?`;

        return responseBuilder.speak(speechOutput).reprompt(speechOutput).getResponse();
    },
};

const YesHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.YesIntent';
    },
    handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        const responseBuilder = handlerInput.responseBuilder;

        const sessionAttributes = attributesManager.getSessionAttributes();
        const restaurantName = sessionAttributes.restaurant;
        const restaurantDetails = getRestaurantByName(restaurantName);
        const speechOutput = `${restaurantDetails.name
        } is located at ${restaurantDetails.address
        }, the phone number is ${restaurantDetails.phone
        }, and the description is, ${restaurantDetails.description
        }  I have sent these details to the Alexa App on your phone.  Enjoy your meal!
        <say-as interpret-as="interjection">bon appetit</say-as>`;

        const card = `${restaurantDetails.name}\n${restaurantDetails.address}\n$
        {data.city}, ${data.state} ${data.postcode}\nphone: ${restaurantDetails.phone}\n`;

        return responseBuilder
            .speak(speechOutput)
            .withSimpleCard(SKILL_NAME, card)
            .getResponse();
    },
};

const AttractionHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' && request.intent.name === 'AttractionIntent';
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;

        let distance = 200;
        if (request.intent.slots.distance.value && request.intent.slots.distance.value !== "?") {
            distance = request.intent.slots.distance.value;
        }

        const attraction = randomArrayElement(getAttractionsByDistance(distance));

        const speechOutput = `Try ${
            attraction.name}, which is ${
            attraction.distance === '0' ? 'right downtown. ' : `${attraction.distance} kilometers away. Have fun! `
        }${attraction.description}`;

        return responseBuilder.speak(speechOutput).getResponse();
    },
};

const GoOutHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' && request.intent.name === 'GoOutIntent';
    },
    handle(handlerInput) {
        return new Promise((resolve) => {
            getWeather((localTime, currentTemp, currentCondition) => {
                const speechOutput = `It is ${localTime
                } and the weather in ${data.city
                } is ${
                    currentTemp} and ${currentCondition}`;
                resolve(handlerInput.responseBuilder.speak(speechOutput).getResponse());
            });
        });
    },
};

const HelpHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        const responseBuilder = handlerInput.responseBuilder;

        const requestAttributes = attributesManager.getRequestAttributes();
        return responseBuilder
            .speak(requestAttributes.t('HELP'))
            .reprompt(requestAttributes.t('HELP'))
            .getResponse();
    },
};

const StopHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest'
            && (request.intent.name === 'AMAZON.NoIntent'
            || request.intent.name === 'AMAZON.CancelIntent'
            || request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        const responseBuilder = handlerInput.responseBuilder;

        const requestAttributes = attributesManager.getRequestAttributes();
        return responseBuilder
            .speak(requestAttributes.t('STOP'))
            .getResponse();
    },
};

const SessionEndedHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

        return handlerInput.responseBuilder.getResponse();
    },
};

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

const FallbackHandler = {

  // 2018-May-01: AMAZON.FallackIntent is only currently available in en-US locale.

  //              This handler will not be triggered except in that locale, so it can be

  //              safely deployed for any locale.

  canHandle(handlerInput) {

    const request = handlerInput.requestEnvelope.request;

    return request.type === 'IntentRequest'

      && request.intent.name === 'AMAZON.FallbackIntent';

  },

  handle(handlerInput) {

    return handlerInput.responseBuilder

      .speak(FALLBACK_MESSAGE)

      .reprompt(FALLBACK_REPROMPT)

      .getResponse();

  },

};


// 2. Constants ==================================================================================

const languageStrings = {
    en: {
        translation: {
            WELCOME: 'Welcome to Kochi Guide!',
            HELP: 'Say about, to hear more about the city, or say coffee, breakfast, lunch, or dinner, to hear local restaurant suggestions, or say recommend an attraction, or say, go outside. ',
            ABOUT: 'Kochi, is a major port city on the south-west coast of India bordering the Laccadive Sea. It is part of the district of Ernakulam in the state of Kerala and is often referred to as Ernakulam.',
            STOP: 'Okay, see you next time!',
        },
    },
};
const data = {
    city: 'Kochi',
    state: 'Kerala',
    postcode: '682042',
    restaurants: [
        {
            name: "Aaryas",
            address: 'Seaport Airport Road Kakkanad',
            phone: '0484-297-2974',
            meals: 'breakfast, lunch',
            description: 'A vegetarian restaurant for South Indian foods.',
        },
        {
            name: 'Marriot',
            address: 'Lulu Mall Edappally',
            phone: '0484-717-7777',
            meals: 'breakfast',
            description: 'Awesome food in 5 star standards. Great ambience and great food.',
        },
        {
            name: 'Pie Dosa',
            address: 'Near Al-Ameen Public School Edappally',
            phone: '0484-280-1778',
            meals: 'dinner',
            description: 'Good place to eat different varieties of dosa. Easy to spot on highway side.',
        },
        {
            name: 'Ifthar',
            address: 'KK Building Edappally',
            phone: '989-538-9777',
            meals: 'dinner',
            description: 'Yummy Malabar dishes and fast service. Excellent place to go out with friends.',
        },
        {
            name: 'Navras',
            address: 'Chittoor Road Pullepady',
            phone: '703-400-7722',
            meals: 'lunch',
            description: 'Cozy atmosphere, great service, and the grilled fish. It tastes awesome spicy.',
        },
        {
            name: "The Burger Junction",
            address: 'Panampilly Nagar',
            phone: '0484-404-1510',
            meals: 'lunch, dinner',
            description: 'Great burgers at Great Prices.',
        },
        {
            name: "Barbeque Nation",
            address: 'Imperial Trade Center Mahatma Gandhi Rd',
            phone: '1800-108-6060',
            meals: 'lunch, dinner',
            description: 'Pioneers of Live Grill Concept in India. A place known for any celebrations. Best Barbecues/kebabs & Starters. Unlimited Food including Starters, Main Course, Desserts, Kulfi’s',
        },
        {
            name: "Paragon",
            address: 'Lulu Mall Edappally',
            phone: '0484-401-1000',
            meals: 'lunch, dinner',
            description: 'Enduring Malabar restaurant specialising in seafood specialties such as masala fried fish.',
        },
        {
            name: "Caffe Coffee Day",
            address: 'Lulu Mall Edappally',
            phone: '0996-483-7700',
            meals: 'coffee',
            description: 'Great ambience and atmosphere. A good place to sip a coffee and chat.',
        },
        {
            name: "Tonico Cafe",
            address: 'Seaport Airport Road Kakkanad',
            phone: '0702-532-2222',
            meals: 'coffee, dinner',
            description: 'This casual coffee shop serves a range of coffee drinks, smoothies and international snack food.',
        },
    ],
    attractions: [
        {
            name: 'Fort Kochi',
            description: 'Being a hub of Dutch, Portuguese and British Administration in colonial times, Fort Kochi incredibly, is a great place to explore European Architecture.',
            distance: '0',
        },
        {
            name: 'Cherai Beach',
            description: 'A tranquil and pristine beach, Cherai is dotted with lush green swaying coconut plantations. There are golden sandy beaches, happening beach shacks and plenty of sea shells.',
            distance: '23',
        },
        {
            name: 'Hill Palace',
            description: 'Heritage museum and houses many archaeological relics and imperial belongings of the Maharaja of Kochi.',
            distance: '19',
        },
        {
            name: 'Mangalavanam Bird Sanctuary',
            description: 'Biosphere reserve located at Central Cochin is a natural habitat to many endangered and regular species of local and migratory birds, as well as mangrove vegetation',
            distance: '7',
        },
    ],
};

const SKILL_NAME = 'Kochi City Guide';
const FALLBACK_MESSAGE = `The ${SKILL_NAME} skill can\'t help you with that.  It can help you learn about Kochi if you say tell me about this place. What can I help you with?`;
const FALLBACK_REPROMPT = 'What can I help you with?';



// 3. Helper Functions ==========================================================================


const myAPI = {
    host: 'query.yahooapis.com',
    port: 443,
    path: `/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22${encodeURIComponent(data.city)}%2C%20${data.state}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`,
    method: 'GET',
};

function getRestaurantsByMeal(mealType) {
    const list = [];
    for (let i = 0; i < data.restaurants.length; i += 1) {
        if (data.restaurants[i].meals.search(mealType) > -1) {
            list.push(data.restaurants[i]);
        }
    }
    return list;
}

function getRestaurantByName(restaurantName) {
    let restaurant = {};
    for (let i = 0; i < data.restaurants.length; i += 1) {
        if (data.restaurants[i].name === restaurantName) {
            restaurant = data.restaurants[i];
        }
    }
    return restaurant;
}

function getAttractionsByDistance(maxDistance) {
    const list = [];

    for (let i = 0; i < data.attractions.length; i += 1) {
        if (parseInt(data.attractions[i].distance, 10) <= maxDistance) {
            list.push(data.attractions[i]);
        }
    }
    return list;
}

function getWeather(callback) {
    const req = https.request(myAPI, (res) => {
        res.setEncoding('utf8');
        let returnData = '';

        res.on('data', (chunk) => {
            returnData += chunk;
        });
        res.on('end', () => {
            const channelObj = JSON.parse(returnData).query.results.channel;

            let localTime = channelObj.lastBuildDate.toString();
            localTime = localTime.substring(17, 25).trim();

            const currentTemp = channelObj.item.condition.temp;

            const currentCondition = channelObj.item.condition.text;

            callback(localTime, currentTemp, currentCondition);
        });
    });
    req.end();
}

function randomArrayElement(array) {
    let i = 0;
    i = Math.floor(Math.random() * array.length);
    return (array[i]);
}

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
};

const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchHandler,
        AboutHandler,
        CoffeeHandler,
        BreakfastHandler,
        LunchHandler,
        DinnerHandler,
        YesHandler,
        AttractionHandler,
        GoOutHandler,
        HelpHandler,
        StopHandler,
        FallbackHandler,
        SessionEndedHandler
    )
    .addRequestInterceptors(LocalizationInterceptor)
    .addErrorHandlers(ErrorHandler)
    .lambda();
