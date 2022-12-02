import { Application, Router } from "express";

import App from '../app';

class SceneRoutes {

  constructor(app: App, server: Application) {

    const router: Router = Router();

    // TODO Confirm this route still is feasible
    // router.get('/scene', async (req, res) => {
    //   const {
    //     body: { uid, sceneId, characterId }
    //   } = req;
    //
    //
    //   const response = await app.getServices()!.getSceneService()!.getScene();
    //
    //
    //   if(response) {
    //     res.json(response);
    //   } else {
    //     res.sendStatus(404);
    //   }
    //
    // });

    // router.post('/client/:uid/scene', async (req, res) => {
    //   const {
    //     body: { sceneId },
    //     params: { uid },
    //   } = req;
    //   const response = await app.getServices()!.getSceneService()!.setScene(id);
    //   res.json(response);
    // });
    //
    // router.get('/scene/character', async (req, res) => {
    //   const character = await app.getServices()!.getSceneService()!.getCharacter();
    //   res.json(character);
    // });

    // router.post('/scene/character', async (req, res) => {
    //   const {
    //     body: { id }
    //   } = req;
    //   const character = await app.getServices()!.getSceneService()!.setCharacter(id);
    //   if (character)
    //     res.json(character);
    //   else
    //     res.sendStatus(404);
    // });


    server.use(router);

    console.log('   Scene Routes Success');

  }

}

export default SceneRoutes;
