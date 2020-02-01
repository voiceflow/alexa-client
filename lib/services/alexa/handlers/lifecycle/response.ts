import { HandlerInput } from 'ask-sdk';
import { Response } from 'ask-sdk-model';

import { S, T } from '@/lib/constants';
import { responseHandlers } from '@/lib/services/voiceflow/handlers';
import { Context } from '@/lib/services/voiceflow/types';

const response = async (context: Context, input: HandlerInput): Promise<Response> => {
  const builder = input.responseBuilder;

  const { storage, turn } = context;

  // store access token
  storage.set(S.ACCESS_TOKEN, input.requestEnvelope.context.System.user.accessToken);

  if (context.stack.isEmpty()) {
    turn.set(T.END, true);
  }

  builder
    .speak(storage.get(S.OUTPUT))
    .reprompt(turn.get('reprompt') || storage.get(S.OUTPUT))
    .withShouldEndSession(!!turn.get(T.END));

  // eslint-disable-next-line no-restricted-syntax
  for (const handler of responseHandlers) {
    // eslint-disable-next-line no-await-in-loop
    await handler(context, builder);
  }

  input.attributesManager.setPersistentAttributes(context.getFinalState());

  return builder.getResponse();
};

export default response;
