import { HandlerInput } from 'ask-sdk';
import { interfaces } from 'ask-sdk-model';

import { Commands, NewContextStack, NewContextStorage, NewContextVariables, OldCommands, OldContextRaw } from './types';

export const commandAdapter = (oldCommands: OldCommands): Commands =>
  Object.keys(oldCommands).reduce((commandsAcc, key) => {
    const oldCommand = oldCommands[key];
    const command = {
      mappings: oldCommand.mappings,
      intent: key,
      ...(oldCommand.diagram_id && { diagram_id: oldCommand.diagram_id }), // command
      ...(oldCommand.next && { next: oldCommand.next }), // intent
    };
    commandsAcc.push(command);

    return commandsAcc;
  }, [] as Commands);

export const stackAdapter = (oldContext: OldContextRaw): NewContextStack =>
  oldContext.diagrams?.reduce((acc, d, index) => {
    const frame = {
      blockID: d.line === false ? null : d.line,
      diagramID: d.id,
      variables: d.variable_state,
      storage: {
        // speak is only added in the old server during commands
        ...(d.speak && { speak: d.speak, calledCommand: true }),
        // output map is stored in previous frame in old server
        ...(oldContext.diagrams[index - 1]?.output_map && { outputMap: oldContext.diagrams[index - 1].output_map }),
      } as any,
      commands: commandAdapter(d.commands),
    };

    // blockID for top of the stack frame is kept in line_id in old context
    if (index === oldContext.diagrams.length - 1) {
      frame.blockID = oldContext.line_id;
      // old server only keeps what the last diagram spoke
      if (oldContext.last_speak) frame.storage.speak = oldContext.last_speak;
    }

    acc.push(frame);

    return acc;
  }, [] as NewContextStack) || [];

export const storageAdapter = (oldContext: OldContextRaw, input: HandlerInput): NewContextStorage => ({
  output: oldContext.output,
  sessions: oldContext.sessions,
  repeat: oldContext.repeat,
  locale: oldContext.locale,
  user: oldContext.user,
  alexa_permissions: oldContext.alexa_permissions,
  supported_interfaces: oldContext.supported_interfaces,
  // conditionally add attributes
  ...(input.requestEnvelope.context.System.user.accessToken && { accessToken: input.requestEnvelope.context.System.user.accessToken }),
  ...(oldContext.randoms && { randoms: oldContext.randoms }),
  ...(oldContext.permissions && { permissions: oldContext.permissions }),
  ...(oldContext.payment && {
    payment: {
      productId: oldContext.payment.productId,
      successPath: oldContext.payment.success,
      failPath: oldContext.payment.fail,
      status: oldContext.payment.result || null,
    },
  }),
  ...(oldContext.cancel_payment && {
    cancelPayment: {
      productId: oldContext.cancel_payment.productId,
      successPath: oldContext.cancel_payment.success,
      failPath: oldContext.cancel_payment.fail,
      status: oldContext.cancel_payment.result || null,
    },
  }),
  ...(oldContext.display_info && {
    displayInfo: {
      playingVideos: oldContext.display_info.playing_videos,
      dataSource: oldContext.display_info.datasource,
      commands: oldContext.display_info.commands,
      shouldUpdate: oldContext.display_info.should_update,
      currentDisplay: oldContext.display_info.current_display,
      lastDataSource: oldContext.display_info.last_datasource,
      dataSourceVariables: oldContext.display_info.datasource_variables,
      shouldUpdateOnResume: oldContext.display_info.should_update_on_resume,
      // lastVariables -> to populate with variables
    },
  }),
  ...(oldContext.play && {
    streamPlay: {
      action: oldContext.play.action,
      url: oldContext.play.url,
      loop: oldContext.play.loop,
      offset: oldContext.play.offset,
      nextId: oldContext.play.nextId,
      token: oldContext.play.token,
      PAUSE_ID: oldContext.play.PAUSE_ID,
      NEXT: oldContext.play.NEXT,
      PREVIOUS: oldContext.play.PREVIOUS,
      title: oldContext.play.title,
      description: oldContext.play.description,
      regex_title: oldContext.play.regex_title,
      regex_description: oldContext.play.regex_description,
      icon_img: oldContext.play.icon_img,
      background_img: oldContext.play.background_img,
    },
  }),
  ...(oldContext.pause && {
    streamPause: {
      id: oldContext.pause.id,
      offset: oldContext.pause.offset,
    },
  }),
  ...(oldContext.finished !== undefined && {
    streamFinished: oldContext.finished,
  }),
});

export const variablesAdapter = (oldContext: OldContextRaw, system: interfaces.system.SystemState): NewContextVariables =>
  oldContext.globals[0]
    ? { ...oldContext.globals[0], _system: system }
    : { voiceflow: { events: [], permissions: [], capabilities: {} }, _system: system };
