import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import config from './config';

import App  from './app';
import Routes from './routes';

async function main() {

  try {

    console.log(`Inworld.AI NodeJS Proxy`);

    const server: express.Application = express();
    server.use(cors());
    server.use(express.json());

    // // Uncomment the below to enable route logging
    server.use(
      morgan('tiny', {
        skip(req, res) {
          if (req.url === '/status' || req.url.startsWith('/events')) {
            return true
          }
          return false
        }
      })
    )

    const app = new App();
    await app.getService().testService();

    const routes = new Routes({app, server});

    const port: number = config.PORT;
    server.listen(port, () => {
      console.log(`Server Running at http://localhost:${port}/`);
    });

  } catch (err) {

    console.error(err);
    process.exit(1);

  }

}

main();
