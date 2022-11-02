
import { changeCharacter, characterInfo, listAll } from './helpers';

import { Client } from './client';
const config = require('../config');

async function inworldConnector(service: any) {

  const client = new Client({
    config: {
      capabilities: { emotions: true },
    },
    onDisconnect: () => {
      console.error('❗ Inworld disconnected')
    },
  });
  service.connectors.inworld.client = client;

  const connection = client.getConnection();
  service.connectors.inworld.connection = connection;

  console.log('✔️ Inworld connected');

  return;

}

export default inworldConnector
