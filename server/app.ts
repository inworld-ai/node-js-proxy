import Service from './service';

class App {

  private service: Service;

  constructor() {
    this.service = new Service();
  }

  getService(): Service {
    return this.service;
  }

}

export default App
