import { ServiceError } from '@grpc/grpc-js';
import { InworldPacket, InworldConnectionService } from '@inworld/nodejs-sdk';

import Client from '../client';
import { buildError } from '../common/errors';
import { buildEvent } from '../common/events';
import { TYPE_DISCONNECTED } from '../common/types';

import config from '../config';

class ServiceManager {

  private clients: Client[];
  private queue: any[];
  private key: string = config.INWORLD.KEY!
  private secret: string = config.INWORLD.SECRET!
  private scene: string = config.INWORLD.SCENE!

  constructor() {
    if (!this.key) throw Error("Inworld API Key Undefined");
    if (!this.secret) throw Error("Inworld API Secret Undefined");
    if (!this.scene) throw Error("Inworld API Default Scene Undefined");
    this.clients = [];
    this.queue = [];
  }

  async clientOpen( configuration : {
    uid: string;
    sceneId: string;
    characterId: string;
    playerName: string;
    serverId: string;
  }) {

    try {

      const client = new Client({
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
        scene: configuration.sceneId,
        character: configuration.characterId,
        playerName: configuration.playerName,
        serverId: configuration.serverId,
        onDisconnect: onDisconnect,
        onError: onError,
        onMessage: onMessage
      });
      this.clients.push(client);

      var parent = this;

      await client.generateSessionToken();

      const connection = client.getConnection();

      await client.setCharacter(configuration.characterId);

      return {
        sessionId: client.getSessionId(),
        character: await client.getCharacter(),
        characters: await client.getCharacters()
      };

      function onDisconnect() {
      }

      function onError(err: ServiceError) {
        const error = buildError(err, client.getSessionId(), configuration.uid, configuration.serverId)
        if ( error && error.type == TYPE_DISCONNECTED ) {
          parent.clients.splice(parent.clients.indexOf(client), 1);
        }
        if (error) parent.queue.push(error)
      }

      function onMessage(packet: InworldPacket) {
        // console.log('Packet', packet)
        const event = buildEvent(packet, client.getSessionId(), configuration.uid, configuration.serverId)
        if (event) parent.queue.push(event)
      }

    } catch (e) {
      console.error(e);
      return false;
    }


  } // clientOpen

  checkClient(uid: string, sceneId: string, characterId: string, serverId: String) {
    let client
    if ( serverId ) {
      client = this.clients.find(
        client => client.getUID() == uid
        && client.getScene() == sceneId
        && client.getCharacterId() == characterId
        && client.getServerId() == serverId
      );
    } else {
      client = this.clients.find(
        client => client.getUID() == uid
        && client.getScene() == sceneId
        && client.getCharacterId() == characterId
      );
    }
    if (client) return client;
    else return false;
  } // checkClient

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

  flushQueue() {
    return this.queue.splice(0, this.queue.length);
  } // flushQueue

  getClient(sessionId: string) {
    const client = this.clients.find(client => client.getSessionId() == sessionId);
    if (client) return client;
    else return false;
  } // getClient

  getUsersClients(userId: string, serverId?: string) {
    if (serverId) {
      return this.clients.filter(client => client.getUID() == userId && client.getServerId() == serverId);
    } else {
      return this.clients.filter(client => client.getUID() == userId);
    }
  }

  async testService() {

    await new Promise<void>((resolve, reject) => {

      try {

        let pass = false;

        const client = new Client({
          config: {
            capabilities: { audio: false, emotions: true },
          },
          key: this.key!,
          secret: this.secret!,
          uid: '0',
          scene: this.scene!,
          character: '',
          onError: onFail,
          onMessage: onSuccess
        });

        const connection = client.getConnection();

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
            client.getClient().setOnError(() => {});
            client.closeConnection()
            resolve();
          }
        }

        connection.sendText('Hello World');

      } catch (e) {
        console.error(e);
        reject(e);
      }

    })

  } // testService

}

export default ServiceManager
