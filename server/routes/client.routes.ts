import { Application, Router } from "express";

import App from '../app';

class ClientRoutes {

  constructor(app: App, server: Application) {

    const router: Router = Router();

    router.get('/client/close', async (req, res) => {
      const response = await app.getServices()!.getClientService()!.clientClose();
      res.sendStatus(200);
    });

    router.post('/client/open', async (req, res) => {
      const {
        body: { playerName, uid, scene, character }
      } = req;
      const response = await app.getServices()!.getClientService()!.clientOpen(playerName, uid, scene, character);
      res.sendStatus(201);
    });

    router.get('/client/token', async (req, res) => {
      const token = await app.getServices()!.getClientService()!.getToken();
      res.json(token);
    });

    router.post('/client/configuration', async (req, res) => {
      const {
        body: { configuration }
      } = req;
      const character = await app.getServices()!.getClientService()!.setConfiguration(configuration);
      res.json(character);
    });

    router.get('/client/status', async (req, res) => {
      const isActive = await app.getServices()!.getClientService()!.getIsActive();
      res.json(isActive);
    });

    router.post('/client/username', async (req, res) => {
      const {
        body: { name }
      } = req;
      const character = await app.getServices()!.getClientService()!.setUsername(name);
      res.json(character);
    });

    server.use(router);

    console.log('   Client Routes Success');

  }

}

export default ClientRoutes;
