/**
 * This module handles processing the session requests coming from the router.
 *
 * @module
 */

import { Character } from '@inworld/nodejs-sdk';

import { IEvent } from '../factories/event';
import { SessionsService } from './sessions.service';

/**
 * Session service for managing a session.
 */
export class RouterService {

  private _sessions: SessionsService;

  constructor() {
    this._sessions = new SessionsService();
    console.log('✔️ Services Success');
  }

  /**
   * Closes an open session session
   *
   * @param {string} sessionId - The unqiue identifer for a session
   * @returns {boolean} true if the session was successfully closed
   *
   */
  sessionClose(sessionId: string): boolean {
    return this._sessions.sessionClose(sessionId);
  }

  /**
   * Opens a session session and returns the session id
   *
   * @param {string} uid - The unqiue identifer for a user
   * @param {string} sceneId - The Inworld scene id
   * @param {string} characterId - The Inworld character id
   * @param {string} [playerName] - The unqiue identifer for a user
   * @param {string} [serverId] - The unqiue identifer for a server
   * @returns {Promise<object | boolean>} Promise representing true if the session was successfully closed
   *
   */
  async sessionOpen(
      uid: string,
      sceneId: string,
      characterId: string,
      playerName?: string,
      serverId?: string): Promise<object | boolean> {
    console.log('sessionOpen', { uid, sceneId, characterId, playerName, serverId });
    const session = this._sessions.checkSession(uid, sceneId, characterId, serverId);
    if (!session)
      return await this._sessions.sessionOpen({ uid, sceneId, characterId, playerName, serverId });
    else return false;
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
    console.log('closeAll', uid, serverId)
    return this._sessions.closeAll(uid, serverId);
  }

  /**
   * Gets the current active character in the scene
   *
   * @param {string} sessionId - The unqiue identifer for a session
   * @returns {Promise<boolean>} Promise representing the session return object or false if the session id isn't found
   *
   */
  async getCharacter(sessionId: string): Promise<Character | boolean> {
    const session = this._sessions.getSession(sessionId);
    if (session)
      return await session.getCharacter();
    else return false;
  }

  /**
   * Gets a list of characters in the scene
   *
   * @param {string} sessionId - The unqiue identifer for a session
   * @returns {Promise<Character[] | boolean>} Promise representing the session return object or false if the session id isn't found
   *
   */
  async getCharacters(sessionId: string): Promise<Character[] | boolean> {
    const session = this._sessions.getSession(sessionId);
    if (session)
      return await session.getCharacters();
    else return false;
  }

  /**
   * Gets a list of characters in the scene
   *
   * @param {string} [sessionId] - The unqiue identifer for a session
   * @returns {} An array of the events received by sessions
   *
   */
  getEvents(serverId?: string | undefined ): IEvent[] {
    if (serverId) {
      return this._sessions.flushServerQueue(serverId);
    } else {
      return this._sessions.flushQueue();
    }
  }

  /**
   * Checks if a session id exists
   *
   * @param {string} sessionId - The unqiue identifer for a session
   * @returns {boolean} true of the session id exists
   *
   */
  getStatus(sessionId: string): boolean {
    if (this._sessions.getSession(sessionId))
      return true;
    else return false;
  }

  /**
   * Sends a scene trigger
   *
   * @param {string} sessionId - The unqiue identifer for a session
   * @returns {Promise<boolean>} Promise representing true if sending the trigger was successful
   *
   */
  async sendCustom(sessionId: string, customId: string): Promise<boolean> {
    const session = this._sessions.getSession(sessionId);
    if (session) {
      await session.sendCustom(customId);
      return true;
    }
    else return false;
  }

  /**
   * Sends a message to a session
   *
   * @param {string} sessionId - The unqiue identifer for a session
   * @param {string} message - The message to send
   * @returns {Promise<boolean>} Promise representing true if sending the message was successful
   *
   */
  async sendMessage(sessionId: string, message: string): Promise<boolean> {
    const session = this._sessions.getSession(sessionId);
    if (session) {
      await session.sendText(message);
      return true;
    }
    else return false;
  }

  /**
   * Changes the current character within a session's scene
   *
   * @param {string} sessionId - The unqiue identifer for a session
   * @param {string} characterId - The character to change to
   * @returns {Promise<Character | boolean>} Promise representing the Character that was changed to or false
   *
   */
  async setCharacter(sessionId: string, characterId: string): Promise<Character | boolean> {
    const session = this._sessions.getSession(sessionId);
    if (session)
      return await session.setCharacter(characterId);
    else return false;
  }

  /**
   * Changes an active session's server id
   *
   * @param {string} sessionId - The unqiue identifer for a session
   * @param {string} serverId - The serverId to change to
   * @returns {Promise<boolean>} Promise representing the Session's serverId was changed to or false if the session was not found
   *
   */
  async setServer(sessionId: string, serverId: string): Promise<boolean> {
    const session = this._sessions.getSession(sessionId);
    if (session)
      return await session.setServer(serverId);
    else return false;
  }

  /**
   * Test if a connection can be made to Inworlds
   *
   * @returns {Promise<void>} Promise representing the successful Inworld connection test
   *
   */
  async testConnection(): Promise<void> {
    await this._sessions.testConnection();
  }

}
