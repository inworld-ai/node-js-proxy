import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import App  from './app';
import Config from './config';
import Routes from './routes';

async function main() {

  try {

    console.log(`Inworld.AI NodeJS Proxy`);

    const server: express.Application = express();
    server.use(cors());
    server.use(express.json());
    server.use(
      morgan('tiny', {
        skip(req, res) {
          if (req.url === '/status') {
            return true
          }
          return false
        }
      })
    )

    const app = new App();
    await app.init();

    const routes = new Routes(app, server);

    const port: number = Config.PORT;
    server.listen(port, () => {
      console.log(`Server Running at http://localhost:${port}/`);
    });

  } catch (err) {

    console.error(err);
    process.exit(1);

  }

}

main();
