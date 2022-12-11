import { Application, Router } from "express";

import App from '../app';

class Routes {

  constructor(props: { app: App, server: Application }) {

    const router: Router = Router();

    router.get('/', (req, res) => {
      res.send("Inworld.AI NodeJS Proxy");
    });

    router.get('/status', (req, res) => {
      res.sendStatus(200);
    });

    router.get('/session/:sessionId/character', async (req, res) => {
      const {
        params: { sessionId }
      } = req;
      const response = await props.app.getService().getCharacter(sessionId);
      if (response)
        res.json(response);
      else
        res.sendStatus(404);
    });

    router.post('/session/:sessionId/character/:characterId', async (req, res) => {
      const {
        params: { sessionId, characterId }
      } = req;
      const response = await props.app.getService().getCharacter(sessionId);
      if (response)
        res.json(response);
      else
        res.sendStatus(404);
    });

    router.get('/session/:sessionId/characters', async (req, res) => {
      const {
        params: { sessionId }
      } = req;
      const response = await props.app.getService().getCharacters(sessionId);
      if (response)
        res.json(response);
      else
        res.sendStatus(404);
    });

    router.get('/session/:sessionId/close', async (req, res) => {
      const {
        params: { sessionId }
      } = req;
      const response = props.app.getService().clientClose(sessionId);
      if(response) {
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    });

    router.get('/session/closeall/:uid', async (req, res) => {
      const {
        params: { uid }
      } = req;
      const response = props.app.getService().closeAll(uid);
      if(response) {
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    });

    router.get('/session/closeall/:uid/server/:serverId', async (req, res) => {
      const {
        params: { uid, serverId }
      } = req;
      const response = props.app.getService().closeAll(uid, serverId);
      if(response) {
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    });

    router.post('/session/:sessionId/custom', async (req, res) => {
      const {
        body: { customId },
        params: { sessionId }
      } = req;
      const response = await props.app.getService().sendCustom(sessionId, customId);
      if (response)
        res.sendStatus(202);
      else
        res.sendStatus(404);
    });

    router.post('/session/:sessionId/message', async (req, res) => {
      const {
        body: { message },
        params: { sessionId }
      } = req;
      // console.log(sessionId, message)
      const response = await props.app.getService().sendMessage(sessionId, message);
      if (response)
        res.sendStatus(202);
      else
        res.sendStatus(404);
    });

    router.post('/session/open', async (req, res) => {
      const {
        body: { uid, sceneId, characterId, playerName, serverId }
      } = req;
      const response = await props.app.getService().clientOpen(uid, sceneId, characterId, playerName, serverId);
      if (response)
        res.json(response);
      else
        res.sendStatus(409);
    });

    router.get('/session/:sessionId/status', async (req, res) => {
      const {
        params: { sessionId }
      } = req;
      const response = await props.app.getService().getStatus(sessionId);
      if (response)
        res.json(response);
      else
        res.sendStatus(404);
    });

    // Note: This route is not displayed in logging output
    router.get('/events', async (req, res) => {
      const events = props.app.getService().getEvents();
      res.json(events);
    });

    // Note: This route is not displayed in logging output
    router.get('/events/:serverId', async (req, res) => {
      const {
        params: { serverId }
      } = req;
      const events = await props.app.getService().getEvents(serverId);
      res.json(events);
    });

    props.server.use(router);

    props.server.use((req, res) => {
      res.status(404).json('Not Found');
    });

    console.log('✔️ Routes Success');

  }

}

export default Routes;
