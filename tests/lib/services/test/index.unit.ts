import { EventType } from '@voiceflow/client';
import { StreamAction as TraceStreamAction } from '@voiceflow/client/build/lib/Context/Trace';
import { expect } from 'chai';
import sinon from 'sinon';

import { T, TEST_VERSION_ID, V } from '@/lib/constants';
import TestManager from '@/lib/services/test';
import { StreamAction } from '@/lib/services/voiceflow/handlers/stream';

describe('test manager unit tests', () => {
  let clock: sinon.SinonFakeTimers;

  beforeEach(() => {
    clock = sinon.useFakeTimers(Date.now()); // fake Date.now
  });
  afterEach(() => {
    clock.restore(); // restore Date.now
    sinon.restore();
  });

  describe('invoke', () => {
    it('works correctly', async () => {
      const rawState = { foo: 'bar' };
      const trace = { foo1: 'bar1' };

      const context = {
        setEvent: sinon.stub(),
        turn: {
          get: sinon.stub().returns(false), // T.END false
          set: sinon.stub(),
        },
        storage: {
          get: sinon.stub().returns(null), // no stream
        },
        stack: {
          isEmpty: sinon.stub().returns(false), // stack no empty
        },
        variables: { set: sinon.stub() },
        update: sinon.stub(),
        getRawState: sinon.stub().returns(rawState),
        trace: { get: sinon.stub().returns(trace), block: sinon.stub() },
      };

      const createContext = sinon.stub().returns(context);

      const services = {
        voiceflow: { client: { createContext } },
      };
      const utils = {
        Handlers: () => 'foo',
      };

      const config = {
        VF_DATA_ENDPOINT: 'random-endpoint',
      };

      const testManager = TestManager(services as any, config as any, utils as any);

      const state = { foo2: 'bar2' };
      const request = { foo3: 'bar3' };
      expect(await testManager.invoke(state as any, request as any)).to.eql({ ...rawState, trace });
      expect(createContext.args).to.eql([
        [
          TEST_VERSION_ID,
          state,
          request,
          {
            endpoint: `${config.VF_DATA_ENDPOINT}/test`,
            handlers: 'foo',
          },
        ],
      ]);
      expect(context.setEvent.args[0][0]).to.eql(EventType.handlerWillHandle);
      const fn = context.setEvent.args[0][1];
      const event = { context: { foo4: 'bar3' }, block: { blockID: 'block-id' } };
      fn(event);
      expect(context.trace.block.args).to.eql([[event.block.blockID]]);
      expect(context.turn.set.args).to.eql([[T.REQUEST, request]]);
      expect(context.variables.set.args).to.eql([[V.TIMESTAMP, Math.floor(clock.now / 1000)]]);
      expect(context.update.callCount).to.eql(1);
    });

    it('stack empty', async () => {
      const rawState = { foo: 'bar' };
      const trace = { foo1: 'bar1' };

      const context = {
        setEvent: sinon.stub(),
        turn: {
          set: sinon.stub(),
        },
        storage: {
          get: sinon.stub().returns({ action: 'random' }), // stream
        },
        stack: {
          isEmpty: sinon.stub().returns(true), // stack is empty
        },
        variables: { set: sinon.stub() },
        update: sinon.stub(),
        getRawState: sinon.stub().returns(rawState),
        trace: { get: sinon.stub().returns(trace), block: sinon.stub(), end: sinon.stub() },
      };

      const createContext = sinon.stub().returns(context);

      const services = {
        voiceflow: { client: { createContext } },
      };
      const utils = {
        Handlers: sinon.stub().returns([]),
      };

      const config = {
        VF_DATA_ENDPOINT: 'random-endpoint',
      };

      const testManager = TestManager(services as any, config as any, utils as any);

      expect(await testManager.invoke({} as any, {} as any)).to.eql({ ...rawState, trace });
      expect(utils.Handlers.callCount).to.eql(1);
      expect(context.trace.end.callCount).to.eql(1);
    });

    describe('with stream', () => {
      it('StreamAction.START', async () => {
        const rawState = { foo: 'bar' };
        const trace = { foo1: 'bar1' };
        const stream = { action: StreamAction.START, url: 'url', token: 'token', loop: true };

        const context = {
          setEvent: sinon.stub(),
          turn: {
            set: sinon.stub(),
          },
          storage: {
            get: sinon.stub().returns(stream), // with stream
          },
          stack: {
            isEmpty: sinon.stub().returns(true), // stack is empty
          },
          variables: { set: sinon.stub() },
          update: sinon.stub(),
          getRawState: sinon.stub().returns(rawState),
          trace: { get: sinon.stub().returns(trace), block: sinon.stub(), end: sinon.stub(), stream: sinon.stub() },
        };

        const createContext = sinon.stub().returns(context);

        const services = {
          voiceflow: { client: { createContext } },
        };

        const config = {
          VF_DATA_ENDPOINT: 'random-endpoint',
        };

        const utils = {
          Handlers: sinon.stub().returns([]),
        };

        const testManager = TestManager(services as any, config as any, utils as any);

        expect(await testManager.invoke({} as any, {} as any)).to.eql({ ...rawState, trace });
        expect(utils.Handlers.callCount).to.eql(1);
        expect(context.trace.stream.args).to.eql([[stream.url, stream.token, TraceStreamAction.LOOP]]);
      });

      it('StreamAction.RESUME', async () => {
        const rawState = { foo: 'bar' };
        const trace = { foo1: 'bar1' };
        const stream = { action: StreamAction.RESUME, url: 'url', token: 'token', loop: false };

        const context = {
          setEvent: sinon.stub(),
          turn: {
            set: sinon.stub(),
          },
          storage: {
            get: sinon.stub().returns(stream), // with stream
          },
          stack: {
            isEmpty: sinon.stub().returns(true), // stack is empty
          },
          variables: { set: sinon.stub() },
          update: sinon.stub(),
          getRawState: sinon.stub().returns(rawState),
          trace: { get: sinon.stub().returns(trace), block: sinon.stub(), end: sinon.stub(), stream: sinon.stub() },
        };

        const createContext = sinon.stub().returns(context);

        const services = {
          voiceflow: { client: { createContext } },
        };

        const config = {
          VF_DATA_ENDPOINT: 'random-endpoint',
        };

        const utils = {
          Handlers: sinon.stub().returns([]),
        };

        const testManager = TestManager(services as any, config as any, utils as any);

        expect(await testManager.invoke({} as any, {} as any)).to.eql({ ...rawState, trace });
        expect(utils.Handlers.callCount).to.eql(1);
        expect(context.trace.stream.args).to.eql([[stream.url, stream.token, TraceStreamAction.PLAY]]);
      });

      it('StreamAction.PAUSE', async () => {
        const rawState = { foo: 'bar' };
        const trace = { foo1: 'bar1' };
        const stream = { action: StreamAction.PAUSE, url: 'url', token: 'token', loop: false };

        const context = {
          setEvent: sinon.stub(),
          turn: {
            set: sinon.stub(),
          },
          storage: {
            get: sinon.stub().returns(stream), // with stream
          },
          stack: {
            isEmpty: sinon.stub().returns(true), // stack is empty
          },
          variables: { set: sinon.stub() },
          update: sinon.stub(),
          getRawState: sinon.stub().returns(rawState),
          trace: { get: sinon.stub().returns(trace), block: sinon.stub(), end: sinon.stub(), stream: sinon.stub() },
        };

        const createContext = sinon.stub().returns(context);

        const services = {
          voiceflow: { client: { createContext } },
        };

        const config = {
          VF_DATA_ENDPOINT: 'random-endpoint',
        };

        const utils = {
          Handlers: sinon.stub().returns([]),
        };

        const testManager = TestManager(services as any, config as any, utils as any);

        expect(await testManager.invoke({} as any, {} as any)).to.eql({ ...rawState, trace });
        expect(context.trace.stream.args).to.eql([[stream.url, stream.token, TraceStreamAction.PAUSE]]);
      });
    });
  });
});
