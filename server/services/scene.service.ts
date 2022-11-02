import App from '../app'
import InworldConnector from '../connectors/inworld.connector';

class SceneService {

  private inworld: InworldConnector | null = null;

  constructor(inworld: InworldConnector | null) {
    console.log('---> Create SceneService');
    this.inworld = inworld;
  }

  async setScene(id: string) {
    this.inworld!.getClient().getClient().setScene(id);
    const response = this.inworld!.getClient().getConnection();
    console.log('setScene', response);
    return response;
  }

  async sendText(text: string) {
    await this.inworld!.getConnection().sendText(text);
  }

}

export default SceneService
