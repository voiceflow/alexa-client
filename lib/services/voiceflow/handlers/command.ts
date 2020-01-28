import { extractFrameCommand, Frame, Store } from '@voiceflow/client';

import { T } from '@/lib/constants';

import { Context, IntentRequest, Mapping, RequestType } from '../types';
import { mapSlots } from '../utils';

/**
 * The Command Handler is meant to be used inside other handlers, and should never handle blocks directly
 */
const CommandHandler = {
  handle: (context: Context, variables: Store) => {
    const request = context.turn.get(T.REQUEST) as IntentRequest;

    if (request?.type !== RequestType.INTENT) {
      return null;
    }

    const { intent } = request.payload;
    let intentName = intent.name;

    let nextId: string;
    let variableMap: Mapping[];

    if (intentName === 'VoiceFlowIntent') return null;

    const matcher = (command) => command?.intent === intentName;

    // If AMAZON.CancelIntent is not handled turn it into AMAZON.StopIntent
    // This first loop is AMAZON specific, if cancel intent is not explicitly used anywhere at all, map it to stop intent
    if (intentName === 'AMAZON.CancelIntent') {
      const found = context.stack.getFrames().some((frame) => frame.getCommands().some(matcher));
      if (!found) intentName = 'AMAZON.StopIntent';
    }

    const { index, command } = extractFrameCommand(context.stack, matcher);
    if (command) {
      variableMap = command.mappings;

      if (command.diagram_id) {
        // Reset state to beginning of new diagram and store current line to the stack
        // TODO: use last_speak
        const newFrame = new Frame({ diagramID: command.diagram_id });
        context.stack.push(newFrame);
      } else if (command.next) {
        if (command.return) {
          // Reset state to beginning of new diagram and store current line to the stack
          // TODO: use last_speak
          context.stack.push(context.stack.get(index));
          context.stack.top().setBlockID(command.next);
        } else if (index < context.stack.getSize() - 1) {
          // otherwise destructive and pop off everything before the command
          context.stack.popTo(index + 1);
          context.stack.top().setBlockID(command.next);
        } else if (index === context.stack.getSize() - 1) {
          // jumping to an intent within the same flow
          nextId = command.next;
        }
      }
    }

    if (!(nextId || context.hasEnded())) return null;

    if (variableMap) {
      // map request mappings to variables
      variables.merge(mapSlots(variableMap, intent.slots));
    }
    context.turn.set(T.REQUEST, null);
    return nextId;
  },
};

export default CommandHandler;
