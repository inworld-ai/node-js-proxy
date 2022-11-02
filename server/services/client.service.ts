import App from '../app'
import InworldConnector from '../connectors/inworld.connector';

class ClientService {

  private inworld: InworldConnector | null = null;

  constructor(inworld: InworldConnector | null) {
    console.log('---> Create ClientService');
    this.inworld = inworld;
  }

  async getCharacter() {
    const character = await this.inworld!.getConnection().getCurrentCharacter();
    return character
  }

  async getCharacters() {
    const characters = await this.inworld!.getConnection().getCharacters();
    return characters
  }

}

export default ClientService
