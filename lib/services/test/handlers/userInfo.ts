import { Node } from '@voiceflow/alexa-types/build/nodes/userInfo';
import { HandlerFactory } from '@voiceflow/runtime';

const UserInfoHandler: HandlerFactory<Node> = () => ({
  canHandle: (node) => 'permissions' in node && !!node.permissions,
  handle: (node, runtime) => {
    if (!('permissions' in node)) {
      return node.nextId ?? null;
    }

    runtime.trace.debug('__user info__ - entered');

    if (node.success_id || node.fail_id) {
      runtime.trace.debug(
        node.success_id ? '__user info__ - success path triggered' : '__user info__ - success path not provided, redirecting to the fail path'
      );
    }

    return node.success_id ?? node.fail_id ?? null;
  },
});

export default UserInfoHandler;
