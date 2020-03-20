import { EventType, State } from '@voiceflow/client';
import { StreamAction as TraceStreamAction } from '@voiceflow/client/build/lib/Context/Trace';
import { IntentRequest as AlexaIntentRequest } from 'ask-sdk-model';

import { S, T, TEST_VERSION_ID } from '@/lib/constants';
import { StreamAction, StreamPlay } from '@/lib/services/voiceflow/handlers/stream';
import { RequestType } from '@/lib/services/voiceflow/types';

import { AbstractManager } from '../utils';

type Request = { type: RequestType; payload: AlexaIntentRequest };

class TestManager extends AbstractManager {
  async invoke(state: State, request?: Request) {
    const { voiceflow } = this.services;

    const context = voiceflow.createContext(TEST_VERSION_ID, state as State, request, {
      endpoint: `${this.config?.VF_DATA_ENDPOINT}/test`,
    });

    context.setEvent(EventType.handlerWillHandle, (event) => context.trace.block(event.block.blockID));

    context.turn.set(T.REQUEST, request);

    await context.update();

    const stream = context.storage.get(S.STREAM_PLAY) as StreamPlay;
    if (stream) {
      switch (stream.action) {
        case StreamAction.START:
        case StreamAction.RESUME:
          await context.trace.stream(stream.url, stream.loop ? TraceStreamAction.LOOP : TraceStreamAction.PLAY);
          break;
        case StreamAction.PAUSE:
          await context.trace.stream(stream.url, TraceStreamAction.PAUSE);
          break;
        default:
          break;
      }
    }

    if (context.stack.isEmpty() || context.turn.get(T.END)) {
      await context.trace.end();
    }

    return {
      ...context.getRawState(),
      trace: context.trace.get(),
    };
  }
}

export default TestManager;
