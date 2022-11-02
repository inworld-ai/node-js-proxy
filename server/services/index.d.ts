import ClientService from './services/client.service';
import InworldConnector from '../connectors/inworld.connector';
import SceneService from './services/scene.service';

export declare class Services {
  private clientService: ClientService | null = null;
  private sceneService: SceneService | null = null;
  constructor(inworld: InworldConnector);
  getClientService(): ClientService | null;
  getSceneService(): SceneService | null;
}
