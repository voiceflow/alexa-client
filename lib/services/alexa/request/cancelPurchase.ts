import { HandlerInput, RequestHandler } from 'ask-sdk';
import { interfaces } from 'ask-sdk-model';

import { S } from '@/lib/constants';

import { updateContext } from '../utils';
import IntentHandler from './intent';

export enum Request {
  RESPONSE_TYPE = 'Connections.Response',
  REQ_NAME = 'Cancel',
}

const utilsObj = {
  updateContext,
  IntentHandler,
};

export const CancelPurchaseHandlerGenerator = (utils: typeof utilsObj): RequestHandler => ({
  canHandle(input: HandlerInput): boolean {
    const { request } = input.requestEnvelope;

    return request.type === Request.RESPONSE_TYPE && request.name === Request.REQ_NAME;
  },
  async handle(input: HandlerInput) {
    const { payload } = input.requestEnvelope.request as interfaces.connections.ConnectionsResponse;
    const result: false | interfaces.monetization.v1.PurchaseResult = payload?.purchaseResult ?? false;

    await utils.updateContext(input, (context) => {
      context.storage.produce((draft) => {
        if (draft[S.CANCEL_PAYMENT]) draft[S.CANCEL_PAYMENT].status = result || false;
      });
    });

    return utils.IntentHandler.handle(input);
  },
});

export default CancelPurchaseHandlerGenerator(utilsObj);
