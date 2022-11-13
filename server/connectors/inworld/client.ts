import {
  ClientConfiguration,
  InworldClient,
  InworldConnectionService,
  InworldPacket,
  ServiceError,
} from '@inworld/nodejs-sdk';
import { ChildProcess, fork } from 'child_process';

class Client {

  private client: InworldClient;
  private connection: InworldConnectionService | null = null;

  constructor(props: {
    config?: ClientConfiguration;
    key: string;
    secret: string;
    scene: string;
    playerName?: string | undefined;
    onDisconnect?: () => void | undefined;
    onError?: (err: ServiceError) => void | undefined;
    onMessage?: (packet: InworldPacket) => void | undefined;
  }) {

    this.client = new InworldClient();
    this.client.setApiKey({ key: props.key, secret: props.secret });

    if (props.config) this.client.setConfiguration(props.config);
    if (props.scene) this.client.setScene(props.scene);
    if (props.playerName) this.client.setUser({ fullName: props.playerName });
    if (props.onError) this.client.setOnError(props.onError);
    if (props.onDisconnect) this.client.setOnDisconnect(props.onDisconnect);
    if (props.onMessage) this.client.setOnMessage(props.onMessage);

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

export default Client
