/**
 * This module manages the open sessions for the server.
 *
 * @module
 */

import { ServiceError } from '@grpc/grpc-js';
import { Character, InworldPacket } from '@inworld/nodejs-sdk';

import { TYPE_DISCONNECTED } from '../common/types';
import { config } from '../config';
import { Session } from '../entities/session';
import { EventFactory, IEvent } from '../factories/event';

export interface ISessionResponse {
  sessionId: string | undefined,
  character: Character,
  characters: Character[]
}

/**
 * Manager service for creation, deletion and updating of sessions.
 */
export class SessionsService {

  private _sessions: Session[];
  private _queue: IEvent[];
  private _key: string;
  private _secret: string;
  private _scene: string;

  /**
   * Create an instance of `SessionsService`.
   */
  constructor() {
    this._sessions = [];
    this._queue = []
    this._key = config.INWORLD.KEY;
    this._secret = config.INWORLD.SECRET;
    this._scene = config.INWORLD.SCENE;
  }

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
      session = this._sessions.find(
        session => session.getUID() == uid
        && session.getSceneId() == sceneId
        && session.getCharacterId() == characterId
        && session.getServerId() == serverId
      );
    } else {
      session = this._sessions.find(
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
      console.log('flushServerQueue', serverId)
      const events = this._queue.filter(event => event.serverId == serverId);
      this._queue = this._queue.filter(event => event.serverId != serverId);
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
    return this._queue.splice(0, this._queue.length);
  } // flushQueue

  /**
   * Retrieves a session by a session id
   *
   * @returns {(Session | boolean)} Session or false if non is found
   *
   */
  getSession(sessionId: string) {
    const session = this._sessions.find(session => session.getSessionId() == sessionId);
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
      return this._sessions.filter(session => session.getUID() == userId && session.getServerId() == serverId);
    } else {
      return this._sessions.filter(session => session.getUID() == userId);
    }
  }

  /**
   * Closes an open session session
   *
   * @param {string} sessionId - The unqiue identifer for a session
   * @returns {boolean} true if the session was successfully closed
   *
   */
  sessionClose(sessionId: string): boolean {
    const session = this.getSession(sessionId);
    if (session) {
      console.log('Closing Session', session.getSessionId());
      session.close();
      const index = this._sessions.indexOf(session);
      if (index != -1) this._sessions.splice(index, 1);
      return true;
    } else return false;
  }

  /**
   * Closes all open session sessions opened using a unique id and optionally a server id
   *
   * @param {string} uid - The unqiue identifer for a session
   * @param {string} serverId - The unqiue identifer for a session
   * @returns {boolean} true if the sessions were successfully closed
   *
   */
  closeAll(uid: string, serverId?: string): boolean {
    const sessions = this.getUsersSessions(uid, serverId);
    if (sessions) {
      sessions.forEach(session => {
        console.log('Closing Session', session.getSessionId());
        session.close();
        const index = this._sessions.indexOf(session);
        if (index != -1) this._sessions.splice(index, 1);
      });
      return true;
    } else return false;
  }

  /**
   * Open an Inworld session
   *
   * @param {Object} props - Constructor properties
   * @param {string} props.uid - The unqiue identifer for a user
   * @param {string} props.sceneId - The Inworld scene id
   * @param {string} props.characterId - The Inworld character id
   * @param {string} props.[playerName] - The unqiue identifer for a user
   * @param {string} props.[serverId] - The unqiue identifer for a server
   * @returns {Promise<ISessionResponse | boolean>} Promise representing ISessionResponse or false if and error is thrown
   *
   */
  async sessionOpen( props : {
    uid: string,
    sceneId: string,
    characterId: string,
    playerName?: string,
    serverId?: string,
  }): Promise<ISessionResponse | boolean> {

    try {

      const session = new Session({
        config: {
          capabilities: { audio: false, emotions: false },
          connection: {
            autoReconnect: true,
            disconnectTimeout: config.INWORLD.DISCONNECT_TIMEOUT,
          },
        },
        key: this._key,
        secret: this._secret,
        uid: props.uid,
        sceneId: props.sceneId,
        characterId: props.characterId,
        playerName: props.playerName,
        serverId: props.serverId,
        onDisconnect: onDisconnect,
        onError: onError,
        onMessage: onMessage
      });
      this._sessions.push(session);

      const parent = this;

      await session.generateSessionToken();

      session.getConnection();

      await session.setCharacter(props.characterId);

      const response: ISessionResponse = {
        sessionId: session.getSessionId(),
        character: await session.getCharacter(),
        characters: await session.getCharacters()
      };

      return response;

      function onDisconnect(): void {
        // console.log('Session Disconnected', session.getSessionId());
      }

      function onError(err: ServiceError) {
        // console.log('err', err)
        if (err.code != 10) {
          const error: IEvent | undefined = EventFactory.buildError(err, session.getSessionId(), props.uid, props.serverId);
          if (error) parent._queue.push(error);
          session.close();
          const index = parent._sessions.indexOf(session);
          if (index != -1) parent._sessions.splice(index, 1);
        }
      }

      function onMessage(packet: InworldPacket) {
        // console.log('Packet', packet)
        const event: IEvent | undefined = EventFactory.buildEvent(packet, session.getSessionId(), props.uid, props.serverId);
        if (event) parent._queue.push(event);
      }

    } catch (e: unknown) {
      console.error(e);
      return false;
    }


  } // sessionOpen


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
          key: this._key,
          secret: this._secret,
          uid: '0',
          sceneId: this._scene,
          characterId: '',
          onError: onFail,
          onMessage: onSuccess
        });

        const connection = session.getConnection();

        function onFail( err: ServiceError ) {
          if (!pass) {
            throw Error("❗Unable to connect to Inworld" + err);
            reject();
          }
        }

        function onSuccess( packet: InworldPacket ): void {
          if (!pass) {
            console.log('✔️ Inworld Connection Test Success');
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
