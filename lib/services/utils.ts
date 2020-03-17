import { Config } from '@/types';

import { FullServiceMap } from '.';

// eslint-disable-next-line import/prefer-default-export
export abstract class AbstractManager<T = {}> {
  public services: FullServiceMap & T;

  constructor(services: FullServiceMap, public config: Config) {
    this.services = services as FullServiceMap & T;
  }
}
