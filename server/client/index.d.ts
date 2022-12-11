import ClientService from './services/client.service';
import InworldConnector from '../connectors/inworld.connector';

export declare class Services {

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
  });

  closeConnection();
  async getCharacter();
  getCharacterId();
  async getCharacters();
  getClient();
  getConnection();
  getScene();
  getServerId();
  getSessionId();
  getUID();
  async generateSessionToken();
  async sendCustom(customId: string);
  async sendText(message: string);
  async setCharacter(characterId: string);

}
