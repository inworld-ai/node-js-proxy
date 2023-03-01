/**
 * This module parses the enviornment variables defined in .env file into a configuration
 * object.
 *
 * @module
 */
 
import 'dotenv/config';

/**
 * The configuration settings for the server and Inworld sessions
 *
 * @typedef {Object} config
 * @property {object} SERVER - The server configuration data
 * @property {number} SERVER.PORT - The port the server will run on
 * @property {object} INWORLD - The Inworld configuration data
 * @property {string} INWORLD.KEY - The Inworld API key
 * @property {string} INWORLD.SECRET - The Inworld API secret
 * @property {string} INWORLD.SCENE - The default Inworld scene
 * @property {number} INWORLD.DISCONNECT_TIMEOUT - The Inworld session inactivity timeout
 * @property {boolean} INWORLD.EMOTIONS - Configures the enabled state of emotions for the Inworld sessions
 */
export const config = {
  SERVER: {
    PORT: Number(process.env.PORT) || 3000,
  },
  INWORLD: {
    KEY: process.env.INWORLD_KEY || '',
    SECRET: process.env.INWORLD_SECRET || '',
    SCENE: process.env.INWORLD_SCENE || '',
    DISCONNECT_TIMEOUT: Number(process.env.DISCONNECT_TIMEOUT) || 30 * 60 * 1000,
    EMOTIONS: (process.env.EMOTIONS == "true" ? true : false),
  } 
};
