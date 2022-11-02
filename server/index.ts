import cors from 'cors';
import express from 'express';

import App  from './app';
import Config from './config';
import Routes from './routes';

async function main() {

  try {

    const server: express.Application = express();
    server.use(cors());
    server.use(express.json());
    server.use((req, res, next) => {
      console.log('Request', req.path);
      next();
    });

    const app = new App();

    const routes = new Routes(app, server);

    const port: number = Config.PORT;
    server.listen(port, () => {
        console.log(`Inworld.AI NodeJS Proxy http://localhost:${port}/`);
    });

  } catch (err) {

    console.error(err);
    process.exit(1);

  }
}

main();
