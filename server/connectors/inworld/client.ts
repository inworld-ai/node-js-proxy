import {
  ClientConfiguration,
  InworldClient,
  InworldConnectionService,
  InworldPacket,
  ServiceError,
} from '@inworld/nodejs-sdk';

class Client {

  private client: InworldClient;
  private connection: InworldConnectionService | null = null;

  private character: string;
  private scene: string;
  private sessionId: string | undefined;
  private serverId: string | undefined;
  private uid: string;

  constructor(props: {
    config?: ClientConfiguration;
    key: string;
    secret: string;
    uid: string;
    scene: string;
    character: string;
    playerName?: string | undefined;
    serverId?: string | undefined;
    onDisconnect?: () => void | undefined;
    onError?: (err: ServiceError) => void | undefined;
    onMessage?: (packet: InworldPacket) => void | undefined;
  }) {

    this.client = new InworldClient();
    this.client.setApiKey({ key: props.key, secret: props.secret });
    this.uid = props.uid;
    this.scene = props.scene;
    this.character = props.character;
    this.serverId = props.serverId;

    // this.sessionToken = this.client.generateSessionToken();

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
    if (!this.connection)
      this.connection = this.client.build();
    return this.connection;
  }

  getUID() {
    return this.uid;
  }

  getCharacter() {
    return this.character;
  }

  getScene() {
    return this.scene;
  }

  getSessionId() {
    return this.sessionId;
  }

  getServerId() {
    return this.serverId;
  }

  async generateSessionToken() {
    const token = await this.client.generateSessionToken();
    this.sessionId = token.getSessionId();
  }

}

export default Client
