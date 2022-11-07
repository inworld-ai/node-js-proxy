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

  close() {
    return this.connectors!.getInworldConnector()!.getClient().closeConnection();
  }

  getToken() {
    const client = new InworldClient().setApiKey({
      key: process.env.INWORLD_KEY!,
      secret: process.env.INWORLD_SECRET!,
    });
    return client.generateSessionToken();
  }

  getIsActive() {
    return this.connectors!.getInworldConnector()!.getClient().getConnection().isActive();
  }

  setConfiguration(configuration: Object) {
    return this.connectors!.getInworldConnector()!.getClient().getClient().setConfiguration(configuration);
  }

  setUsername(name: string) {
    return this.connectors!.getInworldConnector()!.getClient().getClient().setUser({ fullName: name });
  }

}

export default ClientService
