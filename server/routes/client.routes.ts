import { Application, Router } from "express";

import App from '../app';

class ClientRoutes {

  constructor(app: App, server: Application) {

    const router: Router = Router();

    router.post('/client/close', async (req, res) => {
      const {
        body: { sessionId }
      } = req;
      console.log('/client/close', sessionId)
      const response = await app.getServices()!.getClientService()!.clientClose(sessionId);
      if(response) {
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    });

    router.post('/client/open', async (req, res) => {
      const {
        body: { uid, sceneId, characterId, playerName, serverId }
      } = req;
      console.log('/client/open', uid, sceneId, characterId, playerName, serverId)
      const response = await app.getServices()!.getClientService()!.clientOpen(uid, sceneId, characterId, playerName, serverId);
      if (response)
        res.json(response);
      else
        res.sendStatus(409);
    });

    router.post('/client/characters', async (req, res) => {
      const {
        body: { sessionId }
      } = req;
      const response = await app.getServices()!.getClientService()!.getCharacters(sessionId);
      if (response)
        res.json(response);
      else
        res.sendStatus(404);
    });

    router.post('/client/custom', async (req, res) => {
      const {
        body: { sessionId, customId }
      } = req;
      const response = await app.getServices()!.getClientService()!.sendCustom(sessionId, customId);
      if (response)
        res.sendStatus(202);
      else
        res.sendStatus(404);
    });

    router.post('/client/message', async (req, res) => {
      const {
        body: { sessionId, message }
      } = req;
      console.log(sessionId, message)
      const response = await app.getServices()!.getClientService()!.sendMessage(sessionId, message);
      if (response)
        res.sendStatus(202);
      else
        res.sendStatus(404);
    });

    router.post('/client/status', async (req, res) => {
      const {
        body: { sessionId }
      } = req;
      const response = await app.getServices()!.getClientService()!.getStatus(sessionId);
      if (response)
        res.json(response);
      else
        res.sendStatus(404);
    });

    router.get('/events', async (req, res) => {
      const events = await app.getServices()!.getClientService()!.getEvents();
      res.json(events);
    });

    router.get('/events/:serverId', async (req, res) => {
      const {
        params: { serverId }
      } = req;
      const events = await app.getServices()!.getClientService()!.getEvents(serverId);
      res.json(events);
    });

    server.use(router);

    console.log('   Client Routes Success');

  }

}

export default ClientRoutes;
