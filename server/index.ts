
import cors from 'cors';
import express from 'express';
import { NextFunction, Request, Response, Router } from "express";
import {
  InworldClient,
  InworldConnectionService
} from '@inworld/nodejs-sdk';

import config from './config';
import connectors from './connectors';
import loaders from './loaders';
import routes from './routes';

const app: express.Application = express();

const port: number = Number(config.port);


async function main() {

  try {

    const service = {
      connectors: {
        inworld: {
          client: InworldClient,
          connection: InworldConnectionService
        }
      },
      services: {
        client: null
      }
    };

    await connectors(service);
    await loaders(service);

    app.use(cors());

    app.use(express.json());

    for (let router of routes) {
      app.use(router);
    }

    app.listen(port, () => {
        console.log(`Inworld.AI NodeJS Proxy http://localhost:${port}/`);
    });

  } catch (err) {

    console.error(err);
    process.exit(1);

  }
}

main();
