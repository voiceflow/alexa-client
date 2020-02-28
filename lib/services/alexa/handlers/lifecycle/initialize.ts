import { Context, Frame, Store } from '@voiceflow/client';
import { HandlerInput } from 'ask-sdk';

import { F, S } from '@/lib/constants';
import { addSpeakTrace } from '@/lib/services/test/utils';
import { createResumeFrame, RESUME_DIAGRAM_ID } from '@/lib/services/voiceflow/diagrams/resume';
import { StreamAction } from '@/lib/services/voiceflow/handlers/stream';

import { SkillMetadata } from '../../types';

const VAR_VF = 'voiceflow';

const initialize = async (context: Context, input: HandlerInput): Promise<void> => {
  const { requestEnvelope } = input;

  // fetch the metadata for this version (project)
  const meta = (await context.fetchMetadata()) as SkillMetadata;

  const { stack, storage, variables } = context;

  storage.delete(S.STREAM_TEMP);

  // increment user sessions by 1 or initialize
  if (!storage.get(S.SESSIONS)) {
    storage.set(S.SESSIONS, 1);
  } else {
    storage.produce((draft) => {
      draft[S.SESSIONS] += 1;
    });
  }

  // set based on input
  storage.set(S.LOCALE, requestEnvelope.request.locale);
  storage.set(S.USER, requestEnvelope.context.System.user.userId);
  storage.set(S.SUPPORTED_INTERFACES, requestEnvelope.context.System.device?.supportedInterfaces);

  // set based on metadata
  storage.set(S.ALEXA_PERMISSIONS, meta.alexa_permissions ?? []);
  storage.set(S.REPEAT, meta.repeat ?? 100);

  // default global variables
  variables.merge({
    timestamp: Math.floor(Date.now() / 1000),
    locale: storage.get(S.LOCALE),
    user_id: storage.get(S.USER),
    sessions: storage.get(S.SESSIONS),
    platform: 'alexa',

    // hidden system variables (code block only)
    [VAR_VF]: {
      // TODO: implement all exposed voiceflow variables
      permissions: storage.get(S.ALEXA_PERMISSIONS),
      capabilities: storage.get(S.SUPPORTED_INTERFACES),
      events: [],
    },
    _system: input.requestEnvelope.context.System,
  });

  // initialize all the global variables
  Store.initialize(variables, meta.global, 0);

  // end any existing stream
  if (storage.get(S.STREAM_PLAY)) {
    storage.produce((draft) => {
      draft[S.STREAM_PLAY].action = StreamAction.END;
    });
  }

  // restart logic
  const shouldRestart = stack.isEmpty() || meta.restart || context.variables.get(VAR_VF)?.resume === false;
  if (shouldRestart) {
    // start the stack with just the root flow
    stack.flush();
    stack.push(new Frame({ diagramID: meta.diagram }));
  } else if (meta.resume_prompt) {
    // resume prompt flow - use command flow logic
    stack.top().storage.set(F.CALLED_COMMAND, true);

    // if there is an existing resume flow, remove itself and anything above it
    const resumeStackIndex = stack.getFrames().findIndex((frame) => frame.getDiagramID() === RESUME_DIAGRAM_ID);
    if (resumeStackIndex >= 0) {
      stack.popTo(resumeStackIndex);
    }

    stack.push(createResumeFrame(meta.resume_prompt));
  } else {
    // give context to where the user left off with last speak block
    stack.top().storage.delete(F.CALLED_COMMAND);
    const lastSpeak = stack.top().storage.get(F.SPEAK) ?? '';

    storage.set(S.OUTPUT, lastSpeak);
    addSpeakTrace(context, lastSpeak);
  }
};

export default initialize;
