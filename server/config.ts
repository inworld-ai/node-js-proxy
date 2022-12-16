import 'dotenv/config';

// The configuration settings for the server and Inworld sessions
const config = {
  SERVER: {
    PORT: Number(process.env.PORT) || 3000,
  },
  INWORLD: {
    KEY: process.env.INWORLD_KEY || null,
    SECRET: process.env.INWORLD_SECRET || null,
    SCENE: process.env.INWORLD_SCENE || null,
    DISCONNECT_TIMEOUT: Number(process.env.DISCONNECT_TIMEOUT) || 30 * 60 * 1000
  }
};

export default config
