import { Application, Router } from "express";

import App from '../app'

class ClientRoutes {

  constructor(app: App, server: Application) {

    const router: Router = Router();

    router.get('/client/token', async (req, res) => {
      const token = await app.getServices()!.getClientService()!.getToken();
      res.json(token);
    });

    server.use(router);

    console.log('   Client Routes Success')

  }

}

export default ClientRoutes;
