import { expect } from 'chai';
import sinon from 'sinon';

import { S } from '@/lib/constants';
import { EMPTY_AUDIO_STRING, NoMatchHandler } from '@/lib/services/voiceflow/handlers/noMatch';

describe('noMatch handler unit tests', () => {
  describe('canHandle', () => {
    it('false', () => {
      expect(NoMatchHandler().canHandle({} as any, { storage: { get: sinon.stub().returns(null) } } as any)).to.eql(false);
    });
    it('true', () => {
      expect(NoMatchHandler().canHandle({ noMatches: ['speak1', 'speak2'] } as any, { storage: { get: sinon.stub().returns(1) } } as any)).to.eql(
        true
      );
      expect(NoMatchHandler().canHandle({ noMatches: ['speak1', 'speak2'] } as any, { storage: { get: sinon.stub().returns(null) } } as any)).to.eql(
        true
      );
    });
  });

  describe('handle', () => {
    it('with noMatch', () => {
      const node = {
        id: 'node-id',
        noMatches: ['the counter is {counter}'],
      };
      const context = {
        storage: {
          produce: sinon.stub(),
          get: sinon.stub().returns(1),
        },
        trace: {
          addTrace: sinon.stub(),
        },
      };
      const variables = {
        getState: sinon.stub().returns({ counter: 5.2345 }),
      };

      const noMatchHandler = NoMatchHandler();
      expect(noMatchHandler.handle(node as any, context as any, variables as any)).to.eql(node.id);
      expect(context.trace.addTrace.args).to.eql([[{ type: 'speak', payload: { message: 'the counter is 5.23' } }]]);

      // assert produce
      const cb1 = context.storage.produce.args[0][0];
      // sets counter
      const draft1 = {};
      cb1(draft1);
      expect(draft1).to.eql({ [S.NO_MATCHES_COUNTER]: 1 });
      // increases counter
      const draft2 = { [S.NO_MATCHES_COUNTER]: 2 };
      cb1(draft2);
      expect(draft2).to.eql({ [S.NO_MATCHES_COUNTER]: 3 });
      // adds output
      const cb2 = context.storage.produce.args[1][0];
      const draft3 = { [S.OUTPUT]: 'msg: ' };
      cb2(draft3);
      expect(draft3).to.eql({ [S.OUTPUT]: 'msg: the counter is 5.23' });
    });

    it('without noMatch', () => {
      const node = {
        id: 'node-id',
      };
      const context = {
        storage: {
          produce: sinon.stub(),
          get: sinon.stub().returns(1),
        },
        trace: {
          addTrace: sinon.stub(),
        },
      };
      const variables = {
        getState: sinon.stub().returns({}),
      };

      const noMatchHandler = NoMatchHandler();
      expect(noMatchHandler.handle(node as any, context as any, variables as any)).to.eql(node.id);
      expect(context.trace.addTrace.args).to.eql([[{ type: 'speak', payload: { message: '' } }]]);
    });

    it('with noMatch randomized', () => {
      const node = {
        id: 'node-id',
        noMatches: ['A', 'B', 'C'],
        randomize: true,
      };
      const context = {
        storage: {
          produce: sinon.stub(),
          get: sinon.stub().returns(1),
        },
        trace: {
          addTrace: sinon.stub(),
        },
      };
      const variables = {
        getState: sinon.stub().returns({}),
      };

      const noMatchHandler = NoMatchHandler();
      expect(noMatchHandler.handle(node as any, context as any, variables as any)).to.eql(node.id);
      expect(node.noMatches.includes(context.trace.addTrace.args[0][0].payload.message)).to.eql(true);
    });

    it('with noMatch null speak string', () => {
      const NON_NULL_STRING = 'Josh was here';
      const node = {
        id: 'node-id',
        noMatches: [null, NON_NULL_STRING],
      };
      const context = {
        storage: {
          produce: sinon.stub(),
          get: sinon.stub().returns(1),
        },
        trace: {
          addTrace: sinon.stub(),
        },
      };
      const variables = {
        getState: sinon.stub().returns({}),
      };

      const noMatchHandler = NoMatchHandler();
      expect(noMatchHandler.handle(node as any, context as any, variables as any)).to.eql(node.id);
      expect(context.trace.addTrace.args[0][0].payload.message).to.eql(NON_NULL_STRING);
    });

    it('with noMatch empty audio', () => {
      const NON_NULL_STRING = 'Josh was here';
      const node = {
        id: 'node-id',
        noMatches: [EMPTY_AUDIO_STRING, NON_NULL_STRING],
      };
      const context = {
        storage: {
          produce: sinon.stub(),
          get: sinon.stub().returns(1),
        },
        trace: {
          addTrace: sinon.stub(),
        },
      };
      const variables = {
        getState: sinon.stub().returns({}),
      };

      const noMatchHandler = NoMatchHandler();
      expect(noMatchHandler.handle(node as any, context as any, variables as any)).to.eql(node.id);
      expect(context.trace.addTrace.args[0][0].payload.message).to.eql(NON_NULL_STRING);
    });
  });
});
