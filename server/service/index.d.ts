import ServiceManager from './manager.service';

export declare class Services {
  private manager: ServiceManager;
  constructor();
  clientClose(sessionId: string);
  async clientOpen( uid: string, sceneId: string, characterId: string, playerName: string, serverId: string);
  async getCharacter(sessionId: string);
  async getCharacters(sessionId: string);
  getEvents(serverId?: string | undefined);
  getStatus(sessionId: string);
  async sendCustom(sessionId: string, customId: string);
  async sendMessage(sessionId: string, message: string);
  async setCharacter(sessionId: string, characterId: string);
  async testService();
}
