import { TraceStreamAction } from '@voiceflow/general-types/build/nodes/stream';
import { EventType } from '@voiceflow/runtime';
import { expect } from 'chai';
import sinon from 'sinon';

import { T, TEST_VERSION_ID, V } from '@/lib/constants';
import { StreamAction } from '@/lib/services/runtime/handlers/stream';
import TestManager from '@/lib/services/test';

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

      const runtime = {
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
        trace: { get: sinon.stub().returns(trace), addTrace: sinon.stub() },
      };

      const createRuntime = sinon.stub().returns(runtime);

      const services = {
        runtimeClient: { createRuntime },
        prototypeDataAPI: { getProgram: 'api' },
      };
      const utils = {
        Handlers: () => 'foo',
      };

      const config = {};

      const testManager = TestManager(services as any, config as any, utils as any);

      const state = { foo2: 'bar2' };
      const request = { foo3: 'bar3' };
      expect(await testManager.invoke(state as any, request as any)).to.eql({ ...rawState, trace });
      expect(createRuntime.args).to.eql([
        [
          TEST_VERSION_ID,
          state,
          request,
          {
            api: { getProgram: services.prototypeDataAPI.getProgram },
            handlers: 'foo',
          },
        ],
      ]);
      expect(runtime.setEvent.args[0][0]).to.eql(EventType.handlerWillHandle);
      const fn = runtime.setEvent.args[0][1];
      const event = { runtime: { foo4: 'bar3' }, node: { id: 'node-id' } };
      fn(event);
      expect(runtime.trace.addTrace.args).to.eql([[{ type: 'block', payload: { blockID: event.node.id } }]]);
      expect(runtime.turn.set.args).to.eql([[T.REQUEST, request]]);
      expect(runtime.variables.set.args).to.eql([[V.TIMESTAMP, Math.floor(clock.now / 1000)]]);
      expect(runtime.update.callCount).to.eql(1);
    });

    it('stack empty', async () => {
      const rawState = { foo: 'bar' };
      const trace = { foo1: 'bar1' };

      const runtime = {
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
        trace: { get: sinon.stub().returns(trace), addTrace: sinon.stub() },
      };

      const createRuntime = sinon.stub().returns(runtime);

      const services = {
        runtimeClient: { createRuntime },
        prototypeDataAPI: { getProgram: 'api' },
      };
      const utils = {
        Handlers: sinon.stub().returns([]),
      };

      const config = {};

      const testManager = TestManager(services as any, config as any, utils as any);

      expect(await testManager.invoke({} as any, {} as any)).to.eql({ ...rawState, trace });
      expect(utils.Handlers.callCount).to.eql(1);
      expect(runtime.trace.addTrace.args[0]).to.eql([{ type: 'end' }]);
    });

    describe('with stream', () => {
      it('StreamAction.START', async () => {
        const rawState = { foo: 'bar' };
        const trace = { foo1: 'bar1' };
        const stream = { action: StreamAction.START, url: 'url', token: 'token', loop: true };

        const runtime = {
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
          trace: { get: sinon.stub().returns(trace), addTrace: sinon.stub() },
        };

        const createRuntime = sinon.stub().returns(runtime);

        const services = {
          runtimeClient: { createRuntime },
          prototypeDataAPI: { getProgram: 'api' },
        };

        const config = {};

        const utils = {
          Handlers: sinon.stub().returns([]),
        };

        const testManager = TestManager(services as any, config as any, utils as any);

        expect(await testManager.invoke({} as any, {} as any)).to.eql({ ...rawState, trace });
        expect(utils.Handlers.callCount).to.eql(1);
        expect(runtime.trace.addTrace.args[0]).to.eql([
          {
            type: 'stream',
            payload: {
              src: stream.url,
              token: stream.token,
              action: TraceStreamAction.LOOP,
            },
          },
        ]);
      });

      it('StreamAction.RESUME', async () => {
        const rawState = { foo: 'bar' };
        const trace = { foo1: 'bar1' };
        const stream = { action: StreamAction.RESUME, url: 'url', token: 'token', loop: false };

        const runtime = {
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
          trace: { get: sinon.stub().returns(trace), addTrace: sinon.stub() },
        };

        const createRuntime = sinon.stub().returns(runtime);

        const services = {
          runtimeClient: { createRuntime },
          prototypeDataAPI: { getProgram: 'api' },
        };

        const config = {};

        const utils = {
          Handlers: sinon.stub().returns([]),
        };

        const testManager = TestManager(services as any, config as any, utils as any);

        expect(await testManager.invoke({} as any, {} as any)).to.eql({ ...rawState, trace });
        expect(utils.Handlers.callCount).to.eql(1);
        expect(runtime.trace.addTrace.args[0]).to.eql([
          {
            type: 'stream',
            payload: {
              src: stream.url,
              token: stream.token,
              action: TraceStreamAction.PLAY,
            },
          },
        ]);
      });

      it('StreamAction.PAUSE', async () => {
        const rawState = { foo: 'bar' };
        const trace = { foo1: 'bar1' };
        const stream = { action: StreamAction.PAUSE, url: 'url', token: 'token', loop: false };

        const runtime = {
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
          trace: { get: sinon.stub().returns(trace), addTrace: sinon.stub() },
        };

        const createRuntime = sinon.stub().returns(runtime);

        const services = {
          runtimeClient: { createRuntime },
          prototypeDataAPI: { getProgram: 'api' },
        };

        const config = {};

        const utils = {
          Handlers: sinon.stub().returns([]),
        };

        const testManager = TestManager(services as any, config as any, utils as any);

        expect(await testManager.invoke({} as any, {} as any)).to.eql({ ...rawState, trace });
        expect(runtime.trace.addTrace.args[0]).to.eql([
          {
            type: 'stream',
            payload: {
              src: stream.url,
              token: stream.token,
              action: TraceStreamAction.PAUSE,
            },
          },
        ]);
      });
    });
  });
});
