import { Application, Router } from "express";

import App from '../app';

class ClientRoutes {

  constructor(app: App, server: Application) {

    const router: Router = Router();

    router.post('/client/close', async (req, res) => {
      const {
        body: { uid, sceneId, characterId }
      } = req;
      const response = await app.getServices()!.getClientService()!.clientClose(uid, sceneId, characterId);
      if(response) {
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    });

    router.post('/client/open', async (req, res) => {
      const {
        body: { uid, sceneId, characterId, playerName }
      } = req;
      console.log('/client/open', uid, sceneId, characterId, playerName)
      const response = await app.getServices()!.getClientService()!.clientOpen(uid, sceneId, characterId, playerName);
      if (response)
        res.sendStatus(201);
      else
        res.sendStatus(404);
    });

    // TODO Make sure only one instance is returned
    router.post('/client/characters', async (req, res) => {
      const {
        body: { uid, sceneId }
      } = req;
      const response = await app.getServices()!.getClientService()!.getCharacters(uid, sceneId);
      if (response)
        res.json(response);
      else
        res.sendStatus(404);
    });

    router.post('/client/message', async (req, res) => {
      const {
        body: { uid, sceneId, characterId, message }
      } = req;
      const response = await app.getServices()!.getClientService()!.sendMessage(uid, sceneId, characterId, message);
      if (response)
        res.sendStatus(202);
      else
        res.sendStatus(404);
    });

    router.post('/client/status', async (req, res) => {
      const {
        body: { uid, sceneId, characterId }
      } = req;
      const response = await app.getServices()!.getClientService()!.getStatus(uid, sceneId, characterId);
      if (response)
        res.json(response);
      else
        res.sendStatus(404);
    });

    // router.post('/client/token', async (req, res) => {
    //   const {
    //     body: { uid, sceneId, characterId }
    //   } = req;
    //   const response = await app.getServices()!.getClientService()!.getToken(uid, sceneId, characterId);
    //   if (response)
    //     res.json(response);
    //   else
    //     res.sendStatus(404);
    // });

    router.get('/events', async (req, res) => {
      const events = await app.getServices()!.getClientService()!.getEvents();
      res.json(events);
    });


    // TODO Review if this is still feasible
    // router.post('/client/username', async (req, res) => {
    //   const {
    //     body: { uid, sceneId, name }
    //   } = req;
    //
    //   const character = await app.getServices()!.getClientService()!.setUsername(name);
    //
    //   res.json(character);
    // });

    // TODO Review if this is still feasible
    // router.post('/client/configuration', async (req, res) => {
    //   const {
    //     body: { configuration }
    //   } = req;
    //   const character = await app.getServices()!.getClientService()!.setConfiguration(configuration);
    //   res.json(character);
    // });

    server.use(router);

    console.log('   Client Routes Success');

  }

}

export default ClientRoutes;
