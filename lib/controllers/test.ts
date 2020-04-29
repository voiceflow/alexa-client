import { State } from '@voiceflow/client';

import { AbstractController } from './utils';

class TestController extends AbstractController {
  async handler(req: { body: { state: State; request?: any } }) {
    const { test, metrics } = this.services;

    metrics.increment('test.request');

    return test.invoke(req.body.state, req.body.request);
  }
}

export default TestController;
