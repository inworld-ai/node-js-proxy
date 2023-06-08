/**
 * This module defines a single Inworld session.
 *
 * @module
 */

import {
  Character,
  ClientConfiguration,
  InworldClient,
  InworldConnectionService,
  InworldPacket,
  ServiceError,
} from '@inworld/nodejs-sdk';

/**
 * Class for maintaining and setting the state of a Session
 */
export class Session {

  private _client: InworldClient;
  private _connection: InworldConnectionService | null = null;
  private _characterId: string;
  private _sceneId: string;
  private _sessionId: string | undefined;
  private _serverId: string | undefined;
  private _uid: string;

  /**
   * Session class
   *
   * @param {Object} props - Constructor properties
   * @param {ClientConfiguration} props.config - The configuration for the client
   * @param {string} props.key - The Inworld API key
   * @param {string} props.secret - The Inworld API secret
   * @param {string} props.uid - The id unique to a single user but not sessions
   * @param {string} props.sceneId - The Inworld scene id
   * @param {string} props.characterId - The Inworld character id
   * @param {string} [props.playerName] - The display name of the user
   * @param {string} [props.serverId] - The id unique to a single server
   * @param {function} [props.onDisconnect] - The callback if the connection disconnects
   * @param {function} [props.onError] - The callback if the connection throws and error
   * @param {function} [props.onMessage] - The callback when a message is received
   */
  constructor(props: {
    config: ClientConfiguration;
    key: string;
    secret: string;
    uid: string;
    sceneId: string;
    characterId: string;
    playerName?: string | undefined;
    serverId?: string | undefined;
    onDisconnect?: () => void | undefined;
    onError?: (err: ServiceError) => void | undefined;
    onMessage?: (packet: InworldPacket) => void | undefined;
  }) {

    this._client = new InworldClient();
    this._client.setApiKey({ key: props.key, secret: props.secret });
    this._uid = props.uid;
    this._sceneId = props.sceneId;
    this._characterId = props.characterId;
    this._serverId = props.serverId;

    if (props.config) this._client.setConfiguration(props.config);
    if (props.sceneId) this._client.setScene(props.sceneId);
    if (props.playerName) this._client.setUser({ fullName: props.playerName });
    if (props.onError) this._client.setOnError(props.onError);
    if (props.onDisconnect) this._client.setOnDisconnect(props.onDisconnect);
    if (props.onMessage) this._client.setOnMessage(props.onMessage);

  }

  /**
   * Closes a connection
   *
   * @returns {void}
   */
  close(): void {
    // console.log('Close', this._sessionId, this._connection)
    if (this._connection)
      this._connection.close();
  }

  /**
   * Gets the scene's current active character
   *
   * @returns {Promise<Character>} Promise representing a Character or a false there is no connection
   */
  async getCharacter(): Promise<Character> {
    if (!this._connection) throw new Error("No Inworld Connection")
    return await this._connection.getCurrentCharacter();
  }

  /**
   * Gets the current characterId
   *
   * @returns {string>} The scene's character id
   */
  getCharacterId(): string {
    return this._characterId;
  }

  /**
   * Gets the scene's list of characters
   *
   * @returns {Promise<Character[]>} Promise representing Characters or a false there is no connection
   */
  async getCharacters(): Promise<Character[]> {
    if (!this._connection) throw new Error("No Inworld Connection")
    return await this._connection.getCharacters();
  }

  /**
   * Gets the session client
   *
   * @returns {InworldClient} The session client
   */
  getClient(): InworldClient {
    return this._client;
  }

  /**
   * Gets the session client
   *
   * @returns {InworldConnectionService} The session client
   */
  getConnection(): InworldConnectionService {
    if (!this._connection)
      this._connection = this._client.build();
    return this._connection;
  }

  /**
   * Gets the session's scene id
   *
   * @returns {string} The session's scene id
   */
  getSceneId(): string {
    return this._sceneId;
  }

  /**
   * Gets the session id
   *
   * @returns {(string | undefined)} The session id
   */
  getSessionId(): (string | undefined) {
    return this._sessionId;
  }

  /**
   * Gets the server id
   *
   * @returns {(string | undefined)} The server id
   */
  getServerId(): (string | undefined) {
    return this._serverId;
  }

  /**
   * Gets the user id
   *
   * @returns {(string | undefined)} The user id
   */
  getUID(): (string | undefined) {
    return this._uid;
  }

  /**
   * Generates a unique session token
   *
   * @returns {void}
   */
  async generateSessionToken() {
    const token = await this._client.generateSessionToken();
    this._sessionId = token.getSessionId();
  }

  /**
   * Sends a custom id for scene triggers to Inworld
   *
   * @returns {Promise<boolean>}
   */
  async sendCustom(customId: string): Promise<boolean> {
    if (this._connection) {
      await this._connection.sendCustom(customId);
      return true;
    }
    return false;
  }

  /**
   * Sends a session text message to Inworld
   *
   * @returns {Promise<boolean>}
   */
  async sendText(message: string): Promise<boolean> {
    if (this._connection) {
      await this._connection.sendText(message);
      return true;
    }
    return false;
  }

  /**
   * Sets the Session's current scene character
   *
   * Note: If the character is not found within the scene it returns the current character
   *
   * @returns {Promise<(boolean | Character)>}
   */
  async setCharacter(characterId: string): Promise<(boolean | Character)> {
    if (this._connection) {
      const characters = await this._connection.getCharacters();
      const character = characters.find(character => character.getResourceName() === characterId);
      if (character) {
        this._characterId = character.getResourceName();
        await this._connection.setCurrentCharacter(character);
        return await this._connection.getCurrentCharacter();
      }
      else return await this._connection.getCurrentCharacter();
    }
    return false;
  }

  /**
   * Sets the Session's serverId
   *
   * @returns {Promise<(boolean)>}
   */
  async setServer(serverId: string): Promise<boolean> {
    this._serverId = serverId;
    return true;
  }

}
