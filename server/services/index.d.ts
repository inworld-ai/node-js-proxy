import ClientService from './services/client.service';
import InworldConnector from '../connectors/inworld.connector';

export declare class Services {
  private clientService: ClientService | null = null;
  constructor(inworld: InworldConnector);
  getClientService(): ClientService | null;
}
