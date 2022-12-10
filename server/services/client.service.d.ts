import App from '../app'
import Connectors from '../connectors';
import InworldConnector from '../connectors/inworld.connector';

export declare class ClientService {
  private connectors: Connectors;
  constructor(connectors: Connectors);
  async clientClose(sessionId: string);
  async clientOpen(uid: string, sceneId: string, characterId: string, playerName: string);
  async getCharacters(sessionId: string);
  async getEvents();
  async getStatus(sessionId: string);
  async getToken();
  async sendCustom(sessionId: string, customId: string);
  async sendMessage(sessionId: string, message: string);
}
