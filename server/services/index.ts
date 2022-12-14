import ServiceManager from './manager.service';

import Client from '../client';

/**
 * Client service for managing a session.
 */
class Service {

  private manager: ServiceManager;

  constructor() {
    this.manager = new ServiceManager();
    console.log('✔️ Service Success');
  }

  /**
   * Closes an open client session
   *
   * @param {string} sessionId - The unqiue identifer for a session
   * @returns {boolean} true if the client was successfully closed
   *
   */
  clientClose(sessionId: string): boolean {
    const client = this.manager.getClient(sessionId);
    if (client) {
      client.closeConnection();
      return true;
    } else return false;
  }

  /**
   * Opens a client session and returns the session id
   *
   * @param {string} uid - The unqiue identifer for a user
   * @param {string} sceneId - The Inworld scene id
   * @param {string} characterId - The Inworld character id
   * @param {string} playerName - The unqiue identifer for a user
   * @param {string} serverId - The unqiue identifer for a server
   * @returns {boolean} true if the client was successfully closed
   *
   */
  async clientOpen(
      uid: string,
      sceneId: string,
      characterId: string,
      playerName: string,
      serverId?: string): Promise<boolean | Object> {
    console.log('clientOpen', { uid, sceneId, characterId, playerName, serverId });
    const client = this.manager.checkClient(uid, sceneId, characterId, serverId);
    if (!client)
      return await this.manager.clientOpen({ uid, sceneId, characterId, playerName, serverId });
    else return false;
  }

  /**
   * Closes all open client sessions opened using a unique id
   *
   * @param {string} uid - The unqiue identifer for a session
   * @param {string} serverId - The unqiue identifer for a session
   * @returns {boolean} true if the clients were successfully closed
   *
   */
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
