import 'dotenv/config';

const config = {
  PORT: Number(process.env.PORT) || 3000,
  INWORLD: {
    KEY: process.env.INWORLD_KEY,
    SECRET: process.env.INWORLD_SECRET,
    SCENE: process.env.INWORLD_SCENE,
    DISCONNECT_TIMEOUT: 30 * 60 * 1000
  }
};

export default config
