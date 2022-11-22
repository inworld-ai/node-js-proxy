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

  clientOpen(playerName: string, uid: number, scene: string, character: string) {
    console.log('create client', { playerName, uid, scene, character })
    return this.connectors!.getInworldConnector()!.clientOpen({ playerName, uid, scene, character });
  }

  clientClose() {
    if (this.connectors!.getInworldConnector()!.getClient())
    return this.connectors!.getInworldConnector()!.getClient()!.closeConnection();
  }

  getToken() {
    const client = new InworldClient().setApiKey({
      key: process.env.INWORLD_KEY!,
      secret: process.env.INWORLD_SECRET!,
    });
    return client.generateSessionToken();
  }

  getIsActive() {
    if (this.connectors!.getInworldConnector()!.getClient())
    return this.connectors!.getInworldConnector()!.getClient()!.getConnection()!.isActive();
  }

  setConfiguration(configuration: Object) {
    if (this.connectors!.getInworldConnector()!.getClient())
    return this.connectors!.getInworldConnector()!.getClient()!.getClient().setConfiguration(configuration);
  }

  setUsername(name: string) {
    if (this.connectors!.getInworldConnector()!.getClient())
    return this.connectors!.getInworldConnector()!.getClient()!.getClient().setUser({ fullName: name });
  }

}

export default ClientService
