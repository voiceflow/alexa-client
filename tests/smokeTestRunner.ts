/* eslint-disable promise/always-return, no-await-in-loop */

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import fetch from 'cross-fetch';
import fs from 'fs';
import path from 'path';
import yargs from 'yargs';

import { Config } from '../types';
import { SessionRecording } from './types';

const SERVER_CONFIG: Config = {
  NODE_ENV: 'test',
  PORT: '4040',

  AWS_ACCESS_KEY_ID: null,
  AWS_SECRET_ACCESS_KEY: null,
  AWS_REGION: null,
  AWS_ENDPOINT: null,

  DYNAMO_ENDPOINT: null,

  // Secrets configuration
  SECRETS_PROVIDER: 'test',
  API_KEYS_SECRET: null,

  // Release information
  GIT_SHA: null,
  BUILD_NUM: null,
  SEM_VER: null,
  BUILD_URL: null,

  SESSIONS_DYNAMO_TABLE: 'foo',

  VF_DATA_SECRET: 'foo',
  VF_DATA_ENDPOINT: 'foo',
};

const { argv } = yargs.option('f', {
  alias: 'file',
  demandOption: true,
  type: 'string',
});

const awaitServerHealthy = async (url: string) => {
  let count = 10;
  while (count-- > 0) {
    try {
      const data = await (await fetch(`${url}/health`)).text();

      if (data === 'Healthy') {
        break;
      }
    } catch (e) {
      if (count === 0) {
        throw e;
      }
    }

    if (count === 0) {
      throw new Error('server is failing health check');
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
};

// eslint-disable-next-line promise/catch-or-return
fs.promises
  .readFile(argv.f, 'utf-8')
  .then(async (rawData) => {
    const { requests, fixtures }: SessionRecording = JSON.parse(rawData);

    const mock = new MockAdapter(axios);

    Object.keys(fixtures.diagrams).forEach((diagramID) => {
      const diagram = fixtures.diagrams[diagramID];

      mock.onGet(`/diagrams/${diagramID}`).reply(200, diagram);
    });

    await import('../envSetup');
    const { default: Server } = await import('../server');
    const { ServiceManager } = await import('../backend');

    const serviceManager = new ServiceManager(SERVER_CONFIG);
    const server = new Server(serviceManager, SERVER_CONFIG);

    await server.start();

    const serverURL = `http://localhost:${SERVER_CONFIG.PORT}`;

    await awaitServerHealthy(serverURL);

    // eslint-disable-next-line no-restricted-syntax
    for (const { request, response } of requests) {
      try {
        console.log(request);

        const actualResponse = await fetch(`${serverURL}/state/skill/${path.basename(request.url)}`, {
          method: 'post',
          body: JSON.stringify(request.body),
          headers: {
            'content-type': 'application/json',
          },
        });

        console.log(response, actualResponse);
      } catch (e) {
        console.error(e);
      }
    }
  })
  .catch((e) => console.error(e));
