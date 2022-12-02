import 'dotenv/config';

const Config = {

  PORT: Number(process.env.PORT) || 3000,

  INWORLD: {
    KEY: process.env.INWORLD_KEY,
    SECRET: process.env.INWORLD_SECRET,
    SCENE: process.env.INWORLD_SCENE
  }

};

export default Config
