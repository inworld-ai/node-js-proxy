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


  async clientClose(uid: string, sceneId: string, characterId: string) {
    const client = this.connectors!.getInworldConnector()!.getClient(uid, sceneId, characterId);
    if (client) {
      client.closeConnection();
      return true;
    } else return false;
  }

  async clientOpen(uid: string, sceneId: string, characterId: string, playerName: string) {
    console.log('create client', { uid, sceneId, characterId, playerName })
    const client = this.connectors!.getInworldConnector()!.getClient(uid, sceneId, characterId);
    if (!client)
      return this.connectors!.getInworldConnector()!.clientOpen({ uid, sceneId, characterId, playerName });
    else return true;
  }

  async getCharacters(uid: number, sceneId: string) {
    // const character = await this.connectors!.getInworldConnector()!.getConnection()!.getCurrentCharacter();
    // return character
    return false;
  }

  async getEvents() {
    return this.connectors!.getInworldConnector()!.flushQueue();
  }

  async getStatus(uid: string, sceneId: string, characterId: string) {
    if (this.connectors!.getInworldConnector()!.getClient(uid, sceneId, characterId))
      return this.connectors!.getInworldConnector()!.getStatus(uid, sceneId, characterId);
    else return false;
  }

  async getToken(uid: string, sceneId: string, characterId: string) {
    // TODO Integrate this with existing clients
    // const client = new InworldClient().setApiKey({
    //   key: process.env.INWORLD_KEY!,
    //   secret: process.env.INWORLD_SECRET!,
    // });
    // return client.generateSessionToken();
  }

  async sendMessage(uid: string, sceneId: string, characterId: string, message: string) {
    if (this.connectors!.getInworldConnector()!.getConnection(uid, sceneId, characterId)) {
      const connection = this.connectors!.getInworldConnector()!.getConnection(uid, sceneId, characterId);
      if (connection) {
        await connection.sendText(message);
        return true;
      }
    }
    else return false;
  }

  // async setConfiguration(uid: string, sceneId: string, characterId: string, configuration: Object) {
  //
  //   if (this.connectors!.getInworldConnector()!.getClient())
  //   return this.connectors!.getInworldConnector()!.getClient()!.getClient().setConfiguration(configuration);
  //
  // }
  //
  // async setUsername(uid: string, sceneId: string, characterId: string, name: string) {
  //
  //   if (this.connectors!.getInworldConnector()!.getClient())
  //   return this.connectors!.getInworldConnector()!.getClient()!.getClient().setUser({ fullName: name });
  //
  // }

}

export default ClientService
