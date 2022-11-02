import {
  InworldConnectionService
} from '@inworld/nodejs-sdk';

import { Client } from './inworld/client';

class InworldConnector {

  private client: Client;
  private connection: InworldConnectionService;

  constructor() {

    console.log('Creating InworldConnector');

    const client = new Client({
      config: {
        capabilities: { emotions: true },
      },
      onDisconnect: () => {
        console.error('❗ Inworld disconnected');
      },
    });
    this.client = client;

    const connection = client.getConnection();
    this.connection = connection;

    console.log('✔️ Inworld connected');

  }

  getClient() {
    return this.client;
  }

  getConnection() {
    return this.client.getConnection();
  }

}

export default InworldConnector
