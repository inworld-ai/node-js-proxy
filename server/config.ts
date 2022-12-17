/**
 * This module parses the enviornment variables defined in .env file into a config
 * object.
 *
 * @module
 */

import 'dotenv/config';

// The configuration settings for the server and Inworld sessions
export const config = {
  SERVER: {
    PORT: Number(process.env.PORT) || 3000,
  },
  INWORLD: {
    KEY: process.env.INWORLD_KEY || '',
    SECRET: process.env.INWORLD_SECRET || '',
    SCENE: process.env.INWORLD_SCENE || '',
    DISCONNECT_TIMEOUT: Number(process.env.DISCONNECT_TIMEOUT) || 30 * 60 * 1000
  }
};
