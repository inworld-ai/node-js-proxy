import { Application, Router } from "express";

import App from '../app';
import ClientRoutes from './client.routes';
import SceneRoutes from './scene.routes';

class Routes {

  private clientRoutes: ClientRoutes | null = null;
  private sceneRoutes: SceneRoutes | null = null;

  constructor(app: App, server: Application) {

    const router: Router = Router();

    router.get('/status', (req, res) => {
      res.sendStatus(200);
    });

    router.get('/', (req, res) => {
      res.send("Inworld.AI NodeJS Proxy");
    });

    server.use(router);

    this.clientRoutes = new ClientRoutes(app, server);
    this.sceneRoutes = new SceneRoutes(app, server);

    console.log('✔️ Routes Success');

    server.use((req, res) => {
      res.status(404).json('Not Found');
    });

    // Fix 404
    // server.use((err, req, res, next) => {
    //   console.error(err)
    //   res.status(err.output.statusCode).json(err.output.payload)
    // })

  }

}

export default Routes;
