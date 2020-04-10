import { HandlerFactory } from '@voiceflow/client';

import { S, T } from '@/lib/constants';

import { ResponseBuilder } from '../types';

export type PermissionCard = {
  permission_card?: string;
  nextId: string;
};

export const PermissionCardResponseBuilder: ResponseBuilder = (context, builder) => {
  // check permissions card
  const permissionCard = context.turn.get(T.PERMISSION_CARD);
  if (permissionCard) {
    const permissions = Array.isArray(permissionCard) ? permissionCard : context.storage.get(S.ALEXA_PERMISSIONS);
    if (permissions?.length) builder.withAskForPermissionsConsentCard(permissions);
  }
};

const PermissionCardHandler: HandlerFactory<PermissionCard> = () => ({
  canHandle: (block) => {
    return !!block.permission_card;
  },
  handle: (block, context) => {
    context.turn.set(T.PERMISSION_CARD, block.permission_card);

    context.trace.debug('__Permissions__ - entered');

    if (block.nextId) {
      context.trace.debug('Permissions - redirecting to the next block');
    }

    return block.nextId ?? null;
  },
});

export default PermissionCardHandler;
