import Connectors from './connectors';
import Services from './services';

class App {

  private connectors: Connectors | null = null
  private services: Services | null = null

  constructor() {
    this.connectors = new Connectors();
    this.services = new Services();
  }

  async init() {
    await this.connectors!.init();
    await this.services!.init(this.connectors!);
  }

  getConnectors(): Connectors | null  {
    return this.connectors;
  }

  getServices(): Services | null {
    return this.services;
  }

}

export default App
