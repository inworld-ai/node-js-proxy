import App from '../app'
import Connectors from '../connectors';
import InworldConnector from '../connectors/inworld.connector';

class SceneService {

  private connectors: Connectors | null = null;

  constructor(connectors: Connectors | null) {
    this.connectors = connectors;
    console.log('   Scene Service Success')
  }

  async getCharacter() {
    const character = await this.connectors!.getInworldConnector()!.getConnection().getCurrentCharacter();
    return character
  }

  async getCharacters() {
    const characters = await this.connectors!.getInworldConnector()!.getConnection().getCharacters();
    return characters
  }

  async setScene(id: string) {
    this.connectors!.getInworldConnector()!.getClient().getClient().setScene(id);
    const response = this.connectors!.getInworldConnector()!.getClient().getConnection();
    return response;
  }

  async getEvents() {
    const events = this.connectors!.getInworldConnector()!.flushQueue();
    return events;
  }

  async sendText(text: string) {
    await this.connectors!.getInworldConnector()!.getConnection().sendText(text);
  }

}

export default SceneService
