import {
  InworldClient,
} from '@inworld/nodejs-sdk';

import App from '../app'
import Connectors from '../connectors';
import InworldConnector from '../connectors/inworld.connector';

class ClientService {

  private connectors: Connectors | null = null;

  constructor(connectors: Connectors | null) {
    this.connectors = connectors;
    console.log('   Client Service Success')
  }

  getToken() {
    // this.connectors/!.getInworldConnector()!
    const client = new InworldClient().setApiKey({
      key: process.env.INWORLD_KEY!,
      secret: process.env.INWORLD_SECRET!,
    });
    return client.generateSessionToken();
  }

}

export default ClientService
