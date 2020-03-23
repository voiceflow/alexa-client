import { Command, Context, extractFrameCommand, Frame, Store } from '@voiceflow/client';

import { F, T } from '@/lib/constants';

import { IntentName, IntentRequest, Mapping, RequestType } from '../types';
import { mapSlots } from '../utils';

const getCommand = (context: Context) => {
  const request = context.turn.get(T.REQUEST) as IntentRequest;

  if (request?.type !== RequestType.INTENT) return null;

  const { intent } = request.payload;
  let intentName = intent.name;

  // don't act on a catchall intent
  if (intentName === IntentName.VOICEFLOW) return null;

  const matcher = (command: Command | null) => command?.intent === intentName;

  // If Cancel Intent is not handled turn it into Stop Intent
  // This first loop is AMAZON specific, if cancel intent is not explicitly used anywhere at all, map it to stop intent
  if (intentName === IntentName.CANCEL) {
    const found = context.stack.getFrames().some((frame) => frame.getCommands().some(matcher));

    if (!found) {
      intentName = IntentName.STOP;
    }
  }

  const res = extractFrameCommand(context.stack, matcher);
  if (!res) return null;

  return {
    ...res,
    intent,
  };
};

/**
 * The Command Handler is meant to be used inside other handlers, and should never handle blocks directly
 */
const CommandHandler = {
  canHandle: (context: Context): boolean => {
    return !!getCommand(context);
  },
  handle: (context: Context, variables: Store): string | null => {
    const res = getCommand(context);
    if (!res) return null;

    let nextId: string | null = null;
    let variableMap: Mapping[] | undefined;

    if (res.command) {
      const { index, command } = res;

      variableMap = command.mappings;

      if (command.diagram_id) {
        context.trace.debug(`matched command **${command.intent}** - adding command flow`);

        context.stack.top().storage.set(F.CALLED_COMMAND, true);

        // Reset state to beginning of new diagram and store current line to the stack
        const newFrame = new Frame({ diagramID: command.diagram_id });
        context.stack.push(newFrame);
      } else if (command.next) {
        if (index < context.stack.getSize() - 1) {
          // otherwise destructive and pop off everything before the command
          context.stack.popTo(index + 1);
          context.stack.top().setBlockID(command.next);

          context.trace.debug(`matched intent **${command.intent}** - exiting flows and jumping to block`);
        } else if (index === context.stack.getSize() - 1) {
          // jumping to an intent within the same flow
          nextId = command.next;

          context.trace.debug(`matched intent **${command.intent}** - jumping to block`);
        }
      }
    }

    context.turn.set(T.REQUEST, null);

    if (variableMap && res.intent.slots) {
      // map request mappings to variables
      variables.merge(mapSlots(variableMap, res.intent.slots));
    }

    return nextId;
  },
};

export default CommandHandler;
