import axios, { AxiosInstance } from 'axios';

import { Config } from '@/types';

export type Display = { document?: string };

class ServerDataApi {
  private client: AxiosInstance;

  constructor(config: Config) {
    this.client = axios.create({
      baseURL: config.SERVER_DATA_API_URL,
      headers: { authorization: `Bearer ${config.SERVER_DATA_API_KEY}` },
    });
  }

  public fetchDisplayById = async (displayId: number): Promise<null | Display> => {
    const { data }: { data: undefined | null | Display } = await this.client.get(`/metadata/displays/${displayId}`);

    return data ?? null;
  };
}

const ServerDataApiClient = (config: Config): ServerDataApi => new ServerDataApi(config);

export type ServerDataApiType = ServerDataApi;

export default ServerDataApiClient;
