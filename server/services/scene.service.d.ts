import App from '../app'
import InworldConnector from '../connectors/inworld.connector';

export declare class SceneService {
  constructor(inworld: InworldConnector);
  async setScene();
  async sendText(text: string);
}
