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
    key: string | undefined;
    secret: string | undefined;
    scene: string | undefined;
    onDisconnect: () => void;
    onError: (err: ServiceError) => void;
    onMessage: (packet: InworldPacket) => void;
  }) {

    this.client = new InworldClient()
      .setOnError(props.onError)
      .setOnDisconnect(props.onDisconnect)
      .setOnMessage(props.onMessage);

    if (props.key && props.secret)
      this.client.setApiKey({ key: props.key, secret: props.secret });

    if (props.scene) {
      this.client.setScene(props.scene);
    }

    if (props.config) {
      this.client.setConfiguration(props.config);
    }

  }

  closeConnection() {
    if (this.connection)
      this.connection.close();
  }

  getClient() {
    return this.client;
  }

  getConnection() {
    this.connection = this.client.build();
    return this.connection;
  }

}
