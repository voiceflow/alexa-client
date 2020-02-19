import { HandlerInput, RequestHandler } from 'ask-sdk';
import { interfaces } from 'ask-sdk-model';

import { S } from '@/lib/constants';
import { DOCUMENT_VIDEO_TYPE, ENDED_EVENT_PREFIX } from '@/lib/services/voiceflow/handlers/display/constants';
import { DisplayInfo } from '@/lib/services/voiceflow/handlers/display/responseBuilder';

import { updateContext } from '../utils';
import IntentHandler from './intent';

enum Request {
  APL_USER_EVENT = 'Alexa.Presentation.APL.UserEvent',
}

enum SourceHandler {
  END = 'End',
  PLAY = 'Play',
}

const APLUserEventHandler: RequestHandler = {
  canHandle(input: HandlerInput): boolean {
    const { type } = input.requestEnvelope.request;

    return type === Request.APL_USER_EVENT;
  },
  async handle(input: HandlerInput) {
    const request = input.requestEnvelope.request as interfaces.alexa.presentation.apl.UserEvent;

    let hasDisplayInfo = false;
    await updateContext(input, (context) => {
      const source = request.source as undefined | { id: string; type: string; handler: string };

      context.storage.produce((state) => {
        let displayInfo = state[S.DISPLAY_INFO] as DisplayInfo | undefined;

        if (source?.type === DOCUMENT_VIDEO_TYPE && source?.handler === SourceHandler.END && displayInfo?.playingVideos) {
          delete displayInfo.playingVideos[source.id];
        } else if (source?.type === DOCUMENT_VIDEO_TYPE && source.handler === SourceHandler.PLAY) {
          const videoId = source.id;

          if (!displayInfo) {
            displayInfo = {};
          }

          if (!displayInfo.playingVideos) {
            displayInfo.playingVideos = {};
          }

          displayInfo.playingVideos[videoId] = { started: Date.now() };

          state[S.DISPLAY_INFO] = displayInfo;
        }

        if (state[S.DISPLAY_INFO]) hasDisplayInfo = true;
      });
    });

    if (hasDisplayInfo && request.arguments?.includes?.(ENDED_EVENT_PREFIX)) {
      return IntentHandler.handle(input);
    }

    return input.responseBuilder.getResponse();
  },
};

export default APLUserEventHandler;
