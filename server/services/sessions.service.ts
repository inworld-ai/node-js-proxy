import { ServiceError } from '@grpc/grpc-js';
import { InworldPacket, InworldConnectionService } from '@inworld/nodejs-sdk';

import Session from '../entities/session';
import { buildError } from '../common/errors';
import { buildEvent } from '../common/events';
import { TYPE_DISCONNECTED } from '../common/types';

import config from '../config';

/**
 * Manager service for creation, deletion and updating of sessions.
 */
class SessionsService {

  private sessions: Session[];
  private queue: any[];
  private key: string = config.INWORLD.KEY!
  private secret: string = config.INWORLD.SECRET!
  private scene: string = config.INWORLD.SCENE!

  /**
   * Create an instance of `SessionsService`.
   */
  constructor() {
    if (!this.key) throw Error("Inworld API Key Undefined");
    if (!this.secret) throw Error("Inworld API Secret Undefined");
    if (!this.scene) throw Error("Inworld API Default Scene Undefined");
    this.sessions = [];
    this.queue = [];
  }

  /**
   * Open an Inworld session
   *
   * @param {string} uid - The unqiue identifer for a user
   * @param {string} sceneId - The Inworld scene id
   * @param {string} characterId - The Inworld character id
   * @param {string} [playerName] - The unqiue identifer for a user
   * @param {string} [serverId] - The unqiue identifer for a server
   * @returns {Promise<any | boolean>} Promise representing true if the session was successfully closed
   *
   */
  async sessionOpen( configuration : {
    uid: string;
    sceneId: string;
    characterId: string;
    playerName?: string;
    serverId?: string;
  }): Promise<any | boolean> {

    try {

      const session = new Session({
        config: {
          capabilities: { audio: false, emotions: false },
          connection: {
            autoReconnect: true,
            disconnectTimeout: config.INWORLD.DISCONNECT_TIMEOUT,
          },
        },
        key: this.key,
        secret: this.secret,
        uid: configuration.uid,
        sceneId: configuration.sceneId,
        characterId: configuration.characterId,
        playerName: configuration.playerName,
        serverId: configuration.serverId,
        onDisconnect: onDisconnect,
        onError: onError,
        onMessage: onMessage
      });
      this.sessions.push(session);

      var parent = this;

      await session.generateSessionToken();

      const connection = session.getConnection();

      await session.setCharacter(configuration.characterId);

      return {
        sessionId: session.getSessionId(),
        character: await session.getCharacter(),
        characters: await session.getCharacters()
      };

      function onDisconnect() {
      }

      function onError(err: ServiceError) {
        const error = buildError(err, session.getSessionId(), configuration.uid, configuration.serverId)
        if ( error && error.type == TYPE_DISCONNECTED ) {
          parent.sessions.splice(parent.sessions.indexOf(session), 1);
        }
        if (error) parent.queue.push(error)
      }

      function onMessage(packet: InworldPacket) {
        // console.log('Packet', packet)
        const event = buildEvent(packet, session.getSessionId(), configuration.uid, configuration.serverId)
        if (event) parent.queue.push(event)
      }

    } catch (e) {
      console.error(e);
      return false;
    }


  } // sessionOpen

  /**
   * Checks if an Inworld session exists
   *
   * @param {string} uid - The unqiue identifer for a user
   * @param {string} sceneId - The Inworld scene id
   * @param {string} characterId - The Inworld character id
   * @param {string} [serverId] - The unqiue identifer for a server
   * @returns {Session | boolean} A session or false if a session wasn't found
   *
   */
  checkSession(uid: string, sceneId: string, characterId: string, serverId?: string): Session | boolean {
    let session
    if ( serverId ) {
      session = this.sessions.find(
        session => session.getUID() == uid
        && session.getSceneId() == sceneId
        && session.getCharacterId() == characterId
        && session.getServerId() == serverId
      );
    } else {
      session = this.sessions.find(
        session => session.getUID() == uid
        && session.getSceneId() == sceneId
        && session.getCharacterId() == characterId
      );
    }
    if (session) return session;
    else return false;
  } // checkSession

  /**
   * Retrieves all events associated with a unique server id
   *
   * @param {string} sceneId - The Inworld scene id
   * @returns {any[]} An array of events
   *
   */
  flushServerQueue(serverId: string) {
    try {
      // console.log('flushServerQueue', serverId)
      const events = this.queue.filter(event => event.serverId == serverId);
      this.queue = this.queue.filter(event => event.serverId != serverId);
      return events;
    } catch (e) {
      console.error(e);
      return [];
    }
  } // flushServerQueue

  /**
   * Retrieves all events
   *
   * @returns {any[]} An array of events
   *
   */
  flushQueue() {
    return this.queue.splice(0, this.queue.length);
  } // flushQueue

  /**
   * Retrieves a session by a session id
   *
   * @returns {(Session | boolean)} Session or false if non is found
   *
   */
  getSession(sessionId: string) {
    const session = this.sessions.find(session => session.getSessionId() == sessionId);
    if (session) return session;
    else return false;
  } // getSession

  /**
   * Retrieves all sessions associated by a user id and optionally a server id
   *
   * @param {string} userId - A unique id associated to a user or player
   * @param {string} [serverId] - A unique id associated to a server
   * @returns {Session[]} All the user's sessions
   *
   */
  getUsersSessions(userId: string, serverId?: string) {
    if (serverId) {
      return this.sessions.filter(session => session.getUID() == userId && session.getServerId() == serverId);
    } else {
      return this.sessions.filter(session => session.getUID() == userId);
    }
  }

  /**
   * Test if a connection can be made to Inworlds
   *
   * @returns {Promise<void>} Promise representing the successful Inworld connection test
   *
   */
  async testConnection() {

    await new Promise<void>((resolve, reject) => {

      try {

        let pass = false;

        const session = new Session({
          config: {
            capabilities: { audio: false, emotions: true },
          },
          key: this.key!,
          secret: this.secret!,
          uid: '0',
          sceneId: this.scene!,
          characterId: '',
          onError: onFail,
          onMessage: onSuccess
        });

        const connection = session.getConnection();

        function onFail( err: ServiceError ) {
          if (!pass) {
            throw Error("❗Unable to connect to Inworld");
            reject();
          }
        }

        function onSuccess( packet: InworldPacket ) {
          if (!pass) {
            console.log('✔️ Inworld Connection Successful');
            pass = true;
            session.getClient().setOnError(() => {});
            session.close()
            resolve();
          }
        }

        connection.sendText('Hello World');

      } catch (e) {
        console.error(e);
        reject(e);
      }

    })

  } // testConnection

}

export default SessionsService
