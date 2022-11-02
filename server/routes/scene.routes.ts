import { Application, Router } from "express";

import App from '../app'

class SceneRoutes {

  private app: App | null = null;

  constructor(app: App, server: Application) {

    console.log('---> Creating Scene Routes')

    this.app = app;

    const router: Router = Router();

    router.post('/scene', async (req, res) => {
      const {
        body: { id }
      } = req;
      const response = await this.app!.getServices()!.getSceneService()!.setScene(id);
      res.json(response);
    });

    router.post('/scene/sendtext', async (req, res) => {
      const {
        body: { message }
      } = req;
      const response = await this.app!.getServices()!.getSceneService()!.sendText(message);
      res.sendStatus(200);
    });

    server.use(router);

  }

}

export default SceneRoutes;
