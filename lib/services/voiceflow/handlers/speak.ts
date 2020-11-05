import { HandlerFactory, replaceVariables, sanitizeVariables } from '@voiceflow/client';
import { TraceType } from '@voiceflow/general-types';
import { Node, TraceFrame } from '@voiceflow/general-types/build/nodes/speak';
import _ from 'lodash';

import { F, S } from '@/lib/constants';

const SpeakHandler: HandlerFactory<Node> = () => ({
  canHandle: (node) => {
    return ('random_speak' in node ? !!node.random_speak : !!node.speak) || (_.isString(node.prompt) && node.prompt !== 'true');
  },
  handle: (node, context, variables) => {
    let speak = '';

    // Pick a random part to speak
    if ('random_speak' in node && Array.isArray(node.random_speak)) {
      speak = _.sample(node.random_speak) ?? '';
    } else if ('speak' in node) {
      ({ speak } = node);
    }

    const sanitizedVars = sanitizeVariables(variables.getState());

    if (_.isString(speak)) {
      const output = replaceVariables(speak, sanitizedVars);

      context.storage.produce((draft) => {
        draft[S.OUTPUT] += output;
      });

      context.stack.top().storage.set(F.SPEAK, output);
      context.trace.addTrace<TraceFrame>({
        type: TraceType.SPEAK,
        payload: { message: output },
      });
    }

    return node.nextId ?? null;
  },
});

export default SpeakHandler;
