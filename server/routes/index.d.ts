import { Application, Router } from "express";

import App from '../app''
import ClientRoutes from './client.routes'
import SceneRoutes from './scene.routes'

export declare class Routes {
  private clientRoutes: ClientRoutes;
  private sceneRoutes: SceneRoutes;
  constructor(app: App, server: Application);
}