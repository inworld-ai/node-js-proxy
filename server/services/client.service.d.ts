import App from '../app'
import InworldConnector from '../connectors/inworld.connector';

export declare class ClientService {
  constructor(inworld: InworldConnector);
  async getCharacter();
  async getCharacters();
}
