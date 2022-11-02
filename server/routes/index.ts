import { Router } from "express";

import clientRouter from './client'

const router: Router = Router();

router.get('/status', (_req, _res) => {
  _res.sendStatus(200);
});

router.get('/', (_req, _res) => {
  _res.send("Inworld.AI NodeJS Proxy");
});

export default [router, clientRouter];
