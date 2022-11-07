import App from '../app'
import Connectors from '../connectors';
import InworldConnector from '../connectors/inworld.connector';

export declare class SceneService {
  private connectors: Connectors;
  constructor(connectors: Connectors);
  async getCharacter();
  async setCharacter(id: string);
  async getCharacters();
  async getScene();
  async setScene(id: string);
  async getEvents();
  async sendText(text: string);
}
