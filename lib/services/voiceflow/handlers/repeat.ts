import { RepeatType } from '@voiceflow/alexa-types';
import { Context } from '@voiceflow/client';

import { F, S, T } from '@/lib/constants';

import { IntentName, IntentRequest } from '../types';

const RepeatHandler = {
  canHandle: (context: Context): boolean => {
    const request = context.turn.get(T.REQUEST) as IntentRequest;
    const repeat = context.storage.get(S.REPEAT) as RepeatType;
    return request?.payload.intent.name === IntentName.REPEAT && [RepeatType.ALL, RepeatType.DIALOG].includes(repeat);
  },
  handle: (context: Context) => {
    const repeat = context.storage.get(S.REPEAT) as RepeatType;
    const top = context.stack.top();

    const output = (repeat === RepeatType.ALL ? context.turn.get(T.PREVIOUS_OUTPUT) : top.storage.get(F.SPEAK)) || '';

    context.storage.produce((draft) => {
      draft[S.OUTPUT] += output;
    });

    return top.getBlockID() || null;
  },
};

export default () => RepeatHandler;
