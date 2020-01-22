import { SkillBuilders } from 'ask-sdk';

import { Config } from '@/types';

import { FullServiceMap } from '..';
import { ErrorHandler, IntentHandler, LaunchHandler, PlaybackControllerHandler } from './handlers';

const ResponseInterceptor = {
  async process(handlerInput) {
    // save session attributes to persistent attributes
    await handlerInput.attributesManager.savePersistentAttributes();
  },
};

const Alexa = (services: FullServiceMap, config: Config) =>
  SkillBuilders.standard()
    .addRequestHandlers(LaunchHandler, IntentHandler, PlaybackControllerHandler)
    .addErrorHandlers(ErrorHandler)
    // .addRequestInterceptors(RequestInterceptor)
    .addResponseInterceptors(ResponseInterceptor)
    .withDynamoDbClient(services.dynamo)
    .withTableName(config.SESSIONS_DYNAMO_TABLE)
    .withAutoCreateTable(false)
    .create();

export default Alexa;
