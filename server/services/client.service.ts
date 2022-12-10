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
    console.log('   Client Service Success');
  }

  async clientClose(sessionId: string) {
    const client = this.connectors!.getInworldConnector()!.getClient(sessionId);
    if (client) {
      client.closeConnection();
      return true;
    } else return false;
  }

  async clientOpen(uid: string, sceneId: string, characterId: string, playerName: string, serverId: string) {
    console.log('create client', { uid, sceneId, characterId, playerName, serverId });
    const client = this.connectors!.getInworldConnector()!.checkClient(uid, sceneId, characterId, serverId);
    if (!client)
      return this.connectors!.getInworldConnector()!.clientOpen({ uid, sceneId, characterId, playerName, serverId });
    else return false;
  }

  async getCharacters(sessionId: string) {
    if (this.connectors!.getInworldConnector()!.getClient(sessionId))
      return true; // TODO
    else return false;
  }

  async getEvents(serverId?: string | undefined ) {
    if (serverId) {
      return this.connectors!.getInworldConnector()!.flushServerQueue(serverId);
    } else {
      return this.connectors!.getInworldConnector()!.flushQueue();
    }
  }

  async getStatus(sessionId: string) {
    if (this.connectors!.getInworldConnector()!.getClient(sessionId))
      return true;
    else return false;
  }

  async getToken() {
    // TODO Integrate this with existing clients
    // const client = new InworldClient().setApiKey({
    //   key: process.env.INWORLD_KEY!,
    //   secret: process.env.INWORLD_SECRET!,
    // });
    // return client.generateSessionToken();
  }

  async sendCustom(sessionId: string, customId: string) {
    if (this.connectors!.getInworldConnector()!.getConnection(sessionId)) {
      const connection = this.connectors!.getInworldConnector()!.getConnection(sessionId);
      if (connection) {
        await connection.sendCustom(customId);
        return true;
      }
    }
    else return false;
  }

  async sendMessage(sessionId: string, message: string) {
    if (this.connectors!.getInworldConnector()!.getConnection(sessionId)) {
      const connection = this.connectors!.getInworldConnector()!.getConnection(sessionId);
      if (connection) {
        await connection.sendText(message);
        return true;
      }
    }
    else return false;
  }

}

export default ClientService
