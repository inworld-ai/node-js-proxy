import Connectors from './connectors';
import Services from './services';

export declare class App {
  private connectors: Connectors | null;
  private services: Services | null;
  constructor();
  getConnectors(): Connectors | null;
  getServices(): Services | null;
}
