import { EventCallback, Store } from '@voiceflow/client';

import { S } from '@/lib/constants';

import { DisplayInfo } from './responseBuilder';
import { shouldRebuildDisplay } from './utils';

// eslint-disable-next-line import/prefer-default-export
export const stateDidExecute: EventCallback = (context, _, variables: Store) => {
  const displayInfo = context.storage.get(S.DISPLAY_INFO) as DisplayInfo | undefined;

  if (displayInfo && shouldRebuildDisplay(displayInfo.dataSourceVariables, variables.getState(), displayInfo.lastVariables)) {
    context.storage.produce((state) => {
      const dInfo = state[S.DISPLAY_INFO] as DisplayInfo;

      dInfo.shouldUpdate = true;
    });
  }
};
