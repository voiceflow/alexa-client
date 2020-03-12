import express from 'express';

import { ControllerMap, MiddlewareMap } from '@/lib';

import AlexaRouter from './routers/alexa';
import TestRouter from './routers/test';

export default (middlewares: MiddlewareMap, controllers: ControllerMap) => {
  const router = express.Router();

  router.get('/health', (_, res) => res.send('Healthy'));
  router.use('/state/skill', AlexaRouter(middlewares, controllers));
  router.use('/state/test', TestRouter(middlewares, controllers));

  return router;
};
