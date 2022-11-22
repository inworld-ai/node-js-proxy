import App from '../app'
import Connectors from '../connectors';
import InworldConnector from '../connectors/inworld.connector';

export declare class ClientService {
  private connectors: Connectors;
  constructor(connectors: Connectors);
  async clientClose(uid: number, characterId: string)
  async clientOpen(playerName: string, uid: number, sceneId: string, characterId: string);
  async getCharacters(uid: number, sceneId: string);
  async getEvents();
  async getStatus(uid: number, sceneId: string, characterId: string);
  async getToken();
  async sendMessage(uid: number, sceneId: string, characterId: string, text: string);
}
