import { Application, Router } from "express";

import App from '../app';

class SceneRoutes {

  constructor(app: App, server: Application) {

    const router: Router = Router();

    router.get('/scene', async (req, res) => {
      const response = await app.getServices()!.getSceneService()!.getScene();
      res.json(response);
    });

    router.post('/scene', async (req, res) => {
      const {
        body: { id }
      } = req;
      const response = await app.getServices()!.getSceneService()!.setScene(id);
      res.json(response);
    });

    router.get('/scene/character', async (req, res) => {
      const character = await app.getServices()!.getSceneService()!.getCharacter();
      res.json(character);
    });

    router.post('/scene/character', async (req, res) => {
      const {
        body: { id }
      } = req;
      const character = await app.getServices()!.getSceneService()!.setCharacter(id);
      if (character)
        res.json(character);
      else
        res.sendStatus(404);
    });

    router.get('/scene/characters', async (req, res) => {
      const characters = await app.getServices()!.getSceneService()!.getCharacters();
      res.json(characters);
    });

    router.get('/scene/events', async (req, res) => {
      const events = await app.getServices()!.getSceneService()!.getEvents();
      res.json(events);
    });

    router.post('/scene/sendtext', async (req, res) => {
      const {
        body: { message }
      } = req;
      const response = await app.getServices()!.getSceneService()!.sendText(message);
      res.sendStatus(202);
    });

    server.use(router);

    console.log('   Scene Routes Success');

  }

}

export default SceneRoutes;
