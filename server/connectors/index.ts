import InworldConnector from './inworld.connector';

class Connectors {

  private inworldConnector: InworldConnector | null = null;

  constructor() {
    this.inworldConnector = new InworldConnector();
  }

  getInworldConnector(): InworldConnector | null {
    return this.inworldConnector;
  }

}

export default Connectors;