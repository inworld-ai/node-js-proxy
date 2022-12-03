import ClientService from './client.service';
import Connectors from '../connectors';

class Services {

  private clientService: ClientService | null = null;

  constructor() {}

  async init(connectors: Connectors) {
    this.clientService = new ClientService(connectors);
    console.log('✔️ Services Success');
  }

  getClientService(): ClientService | null  {
    return this.clientService;
  }

}

export default Services;
