import { CodeHandler, HandlerFactory } from '@voiceflow/general-runtime/build/runtime';
import { Node } from '@voiceflow/general-types/build/nodes/code';

const CodeHandlerWrapper: HandlerFactory<Node, { endpoint: string | null }> = ({ endpoint }) => {
  const codeHandler = CodeHandler({ endpoint });

  return {
    canHandle: (...args) => {
      return codeHandler.canHandle(...args);
    },
    handle: async (node, runtime, variables, program) => {
      // eval/debug statements here

      return codeHandler.handle(node, runtime, variables, program) as any;
    },
  };
};

export default CodeHandlerWrapper;
