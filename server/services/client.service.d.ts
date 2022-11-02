import App from '../app'
import Connectors from '../connectors';
import InworldConnector from '../connectors/inworld.connector';

export declare class ClientService {
  private connectors: Connectors;
  constructor(connectors: Connectors);
  getToken();
}
