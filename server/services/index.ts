import ClientService from './client.service';
import SceneService from './scene.service';
import Connectors from '../connectors';

class Services {

  private clientService: ClientService | null = null;
  private sceneService: SceneService | null = null;

  constructor(connectors: Connectors) {

    this.clientService = new ClientService(connectors);
    this.sceneService = new SceneService(connectors);

    console.log('✔️ Services Success');

  }

  getClientService(): ClientService | null  {
    return this.clientService;
  }

  getSceneService(): SceneService | null  {
    return this.sceneService;
  }

}

export default Services;
