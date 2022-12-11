import ServiceManager from './manager.service';

import Client from '../client';

class Service {

  private manager: ServiceManager;

  constructor() {
    this.manager = new ServiceManager();
    console.log('✔️ Service Success');
  }

  clientClose(sessionId: string) {
    const client = this.manager.getClient(sessionId);
    if (client) {
      client.closeConnection();
      return true;
    } else return false;
  }

  async clientOpen( uid: string, sceneId: string, characterId: string, playerName: string, serverId: string) {
    console.log('clientOpen', { uid, sceneId, characterId, playerName, serverId });
    const client = this.manager.checkClient(uid, sceneId, characterId, serverId);
    if (!client)
      return await this.manager.clientOpen({ uid, sceneId, characterId, playerName, serverId });
    else return false;
  }

  closeAll(uid: string, serverId?: string) {
    const clients = this.manager.getUsersClients(uid, serverId);
    if (clients) {
      clients.forEach(client => client.closeConnection());
      return true;
    } else return false;
  }

  async getCharacter(sessionId: string) {
    const client = this.manager.getClient(sessionId);
    if (client)
      return await client.getCharacter();
    else return false;
  }

  async getCharacters(sessionId: string) {
    const client = this.manager.getClient(sessionId);
    if (client)
      return await client.getCharacters();
    else return false;
  }

  getEvents(serverId?: string | undefined ) {
    if (serverId) {
      return this.manager.flushServerQueue(serverId);
    } else {
      return this.manager.flushQueue();
    }
  }

  getStatus(sessionId: string) {
    if (this.manager.getClient(sessionId))
      return true;
    else return false;
  }

  async sendCustom(sessionId: string, customId: string) {
    const client = this.manager.getClient(sessionId);
    if (client) {
      await client.sendCustom(customId);
      return true;
    }
    else return false;
  }

  async sendMessage(sessionId: string, message: string) {
    const client = this.manager.getClient(sessionId);
    if (client) {
      await client.sendText(message);
      return true;
    }
    else return false;
  }

  async setCharacter(sessionId: string, characterId: string) {
    const client = this.manager.getClient(sessionId);
    if (client)
      return await client.setCharacter(characterId);
    else return false;
  }

  async testService() {
    await this.manager.testService();
  }

}

export default Service;
