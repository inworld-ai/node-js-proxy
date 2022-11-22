import App from '../app'
import Connectors from '../connectors';
import InworldConnector from '../connectors/inworld.connector';

class SceneService {

  private connectors: Connectors | null = null;

  constructor(connectors: Connectors | null) {
    this.connectors = connectors;
    console.log('   Scene Service Success')
  }

  // async setCharacter(uid: number, character: string, id: string) {
  //   const characters = await this.connectors!.getInworldConnector()!.getConnection()!.getCharacters();
  //   const character = characters.find(character => character.getId() === id);
  //   // await this.connectors!.getInworldConnector()!.getConnection()!.setCharacter(character)
  //   return character || null;
  // }
  //
  // async getScene(uid: number, character: string) {
  //   const scene = this.connectors!.getInworldConnector()!.getScene();
  //   return scene
  // }
  //
  // async getSceneCharacters(uid: number, scene: string) {
  //   const characters = await this.connectors!.getInworldConnector()!.getConnection()!.getCharacters();
  //   return characters;
  // }
  //
  // async setScene(uid: number, character: string, scene: string) {
  //   return this.connectors!.getInworldConnector()!.setScene(scene );
  // }


}

export default SceneService
