import {
  ClientConfiguration,
  InworldClient,
  InworldConnectionService,
  InworldPacket,
  ServiceError,
} from '@inworld/nodejs-sdk';
import { ChildProcess, fork } from 'child_process';
export class Client {

  private client: InworldClient;
  private connection: InworldConnectionService | null = null;

  constructor(props: {
    config?: ClientConfiguration;
    onDisconnect: () => void;
    onMessage: (packet: InworldPacket) => void
  }) {
    this.client = new InworldClient()
      .setApiKey({
        key: process.env.INWORLD_KEY!,
        secret: process.env.INWORLD_SECRET!,
      })
      .setScene(process.env.INWORLD_SCENE!)
      .setOnError((err: ServiceError) => console.error(`Error: ${err.message}`))
      .setOnDisconnect(() => {
        console.log('Disconnected');
        props.onDisconnect();
      })
      .setOnMessage(props.onMessage);

    if (props.config) {
      this.client.setConfiguration(props.config);
    }
  }

  closeConnection() {
    console.log('Inworld closeConnection')
  }

  getClient() {
    return this.client;
  }

  getConnection() {
    this.connection = this.client.build();
    return this.connection;
  }

}
