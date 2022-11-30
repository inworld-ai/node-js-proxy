import App from '../app'
import Connectors from '../connectors';
import InworldConnector from '../connectors/inworld.connector';

export declare class ClientService {
  private connectors: Connectors;
  constructor(connectors: Connectors);
  async clientClose(uid: string, characterId: string)
  async clientOpen(playerName: string, uid: number, sceneId: string, characterId: string);
  async getCharacters(uid: string, sceneId: string);
  async getEvents();
  async getStatus(uid: string, sceneId: string, characterId: string);
  async getToken();
  async sendMessage(uid: string, sceneId: string, characterId: string, text: string);
}
