// @ts-check
import 'dotenv/config';

const config = {

  port: Number(process.env.PORT) || 3000,

  inworld: {
    key: process.env.INWORLD_KEY,
    secret: process.env.INWORLD_SECRET,
    scene: process.env.INWORLD_SCENE
  }

}

export default config
