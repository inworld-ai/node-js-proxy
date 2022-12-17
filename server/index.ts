import { App } from './app';
import { config } from './config';

/**
 * The main process that confirms configuration and creates the server
 *
 * @returns {Promise<void>} Promise of the main process
 */
async function Main() {

  try {

    console.log(`Inworld.AI RESTful Server`);

    // Confirm if the Inworld enviornment variables have been set
    if (!config.INWORLD.KEY) throw Error("Inworld API Key Undefined");
    if (!config.INWORLD.SECRET) throw Error("Inworld API Secret Undefined");
    if (!config.INWORLD.SCENE) throw Error("Inworld API Default Scene Undefined");

    // Create the server application
    const app = new App();
    // Test if the server can connect to Inworld
    // await app.testConnection();
    // Start the REST server
    app.start();

  } catch (err: unknown) {

    // If any error is received log the error and close the server
    console.error(err);
    process.exit(1);

  }

}

Main();
