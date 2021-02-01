import { RequestHandler } from 'ask-sdk';
import { SessionEndedRequest } from 'ask-sdk-model';

import { S } from '@/lib/constants';
import { DisplayInfo } from '@/lib/services/runtime/handlers/display/types';
import log from '@/logger';

import { AlexaHandlerInput } from '../types';
import { updateRuntime } from '../utils';

export enum Request {
  SESSION_ENDED = 'SessionEndedRequest',
}

export enum ErrorType {
  INVALID_RESPONSE = 'INVALID_RESPONSE',
  INTERNAL_SERVICE_ERROR = 'INTERNAL_SERVICE_ERROR',
}

export enum RequestReason {
  ERROR = 'ERROR',
}

const utilsObj = {
  log: log.warn,
  updateRuntime,
};

export const SessionEndedHandlerGenerator = (utils: typeof utilsObj): RequestHandler => ({
  canHandle(input: AlexaHandlerInput): boolean {
    const { type } = input.requestEnvelope.request;

    return type === Request.SESSION_ENDED;
  },
  async handle(input: AlexaHandlerInput) {
    const request = input.requestEnvelope.request as SessionEndedRequest;
    const errorType = request.error?.type;

    await utils.updateRuntime(input, (runtime) => {
      if (errorType === ErrorType.INVALID_RESPONSE || errorType === ErrorType.INTERNAL_SERVICE_ERROR) {
        // eslint-disable-next-line no-console
        utils.log(
          'errorType=%s, versionID=%s, storage=%s, turn=%s, variables=%s, stack=%s, trace=%s',
          errorType,
          runtime.versionID,
          JSON.stringify(runtime.storage.getState()),
          JSON.stringify(runtime.turn.getState()),
          JSON.stringify(runtime.variables.getState()),
          JSON.stringify(runtime.stack.getState()),
          JSON.stringify(runtime.trace.get())
        );
      }

      if (request.reason === RequestReason.ERROR) {
        // eslint-disable-next-line no-console
        utils.log('error=%s, versionID=%s', JSON.stringify(request), runtime.versionID);
      }

      const displayInfo = runtime.storage.get<DisplayInfo | undefined>(S.DISPLAY_INFO);

      if (displayInfo?.playingVideos) {
        runtime.storage.produce<{ [S.DISPLAY_INFO]: DisplayInfo }>((state) => {
          const dInfo = state[S.DISPLAY_INFO];

          dInfo.playingVideos = {};
        });
      }
    });

    return input.responseBuilder.getResponse();
  },
});

export default SessionEndedHandlerGenerator(utilsObj);
