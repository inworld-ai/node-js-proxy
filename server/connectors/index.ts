import InworldConnector from './inworld.connector';

class Connectors {

  private inworldConnector: InworldConnector | null = null;

  constructor() {
    this.inworldConnector = new InworldConnector();
  }

  async init() {
    await this.inworldConnector!.init();
    console.log('✔️ Connectors Success');
    return;
  }

  getInworldConnector(): InworldConnector | null {
    return this.inworldConnector;
  }

}

export default Connectors;
