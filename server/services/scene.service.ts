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

  async setCharacter(id: string) {
    const characters = await this.connectors!.getInworldConnector()!.getConnection().getCharacters();
    const character = characters.find(character => character.getResourceName() === id);
    return character || null;
  }

  async getCharacters() {
    const characters = await this.connectors!.getInworldConnector()!.getConnection().getCharacters();
    return characters;
  }

  async getScene() {
    const scene = this.connectors!.getInworldConnector()!.getScene();
    return scene
  }

  async setScene(id: string) {
    return this.connectors!.getInworldConnector()!.setScene(id);
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
