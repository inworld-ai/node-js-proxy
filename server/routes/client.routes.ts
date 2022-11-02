import { Application, Router } from "express";

import App from '../app'

class ClientRoutes {

  constructor(app: App, server: Application) {

    console.log('---> Creating Client Routes')

    const router: Router = Router();

    router.get('/client', (req, res) => {
      res.send("Client");
    });

    router.get('/client/character', async (req, res) => {
      const character = await app.getServices()!.getClientService()!.getCharacter();
      res.json(character);
    });

    router.get('/client/characters', async (req, res) => {
      const characters = await app.getServices()!.getClientService()!.getCharacters();
      res.json(characters);
    });

    server.use(router);

  }

}

export default ClientRoutes;
