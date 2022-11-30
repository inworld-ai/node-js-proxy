import { ServiceError } from '@grpc/grpc-js';
import {
  InworldPacket,
  InworldConnectionService
} from '@inworld/nodejs-sdk';

import Client from './inworld/client';
import { getBehavior, getStrength, renderActor, renderEventRouting } from './inworld/helpers';

class InworldConnector {

  private client: Client | null = null;
  private clients: Client[] = [];
  // private connection: InworldConnectionService | null = null;
  private queue: any[];

  private key: string = process.env.INWORLD_KEY!
  private secret: string = process.env.INWORLD_SECRET!
  // Default scene to load for initial connection test to Inworld
  private scene: string = process.env.INWORLD_SCENE!

  constructor() {
    if (!this.key) throw Error("Inworld API Key Undefined")
    if (!this.secret) throw Error("Inworld API Secret Undefined")
    this.queue = [];
  }

  async init() {

    await new Promise<void>((resolve, reject) => {

      let pass = false;

      const client = new Client({
        config: {
          capabilities: { audio: false, emotions: true },
        },
        key: this.key!,
        secret: this.secret!,
        uid: 0,
        scene: this.scene!,
        character: '',
        onError: onFail,
        onMessage: onSuccess
      });

      const connection = client.getConnection();

      function onFail( err: ServiceError ) {
        if (!pass) {
          throw Error("❗ Unable to connect to Inworld");
          reject();
        }
      }

      function onSuccess( packet: InworldPacket ) {
        if (!pass) {
          console.log('   Inworld Connector Success');
          pass = true;
          client.getClient().setOnError(() => {});
          connection.close();
          resolve();
        }
      }

      connection.sendText('Hello World');

    })

  }

  async clientOpen( configuration : {
    uid: number;
    sceneId: string;
    characterId: string;
    playerName: string;
  }) {

    // TODO refactor queue clean up to remove events with same uid, sceneId and characterId
    // this.queue = this.queue.filter( event => event.uid != configuration.uid )

    const client = new Client({
      config: {
        capabilities: { audio: false, emotions: true },
      },
      key: this.key,
      secret: this.secret,
      uid: configuration.uid,
      scene: configuration.sceneId,
      character: configuration.characterId,
      playerName: configuration.playerName,
      onDisconnect: onDisconnect,
      onError: onError,
      onMessage: onMessage
    });
    this.clients.push(client);

    const connection = client.getConnection();

    const characters = await connection.getCharacters();
    const character = characters.find(character => character.getId() === configuration.characterId);
    if (character) connection.setCurrentCharacter(character);

    connection.sendText("Hello");

    var parent = this;

    // TODO Return false if unable to create client
    return true

    function onDisconnect() {
      console.info('❗ Inworld disconnected ' + Date.now());
      parent.clients.splice(parent.clients.indexOf(client), 1);
    }

    function onError(err: ServiceError) {

      switch (err.code) {

        case 1: // Conversation cancelled
          console.error('❗ Inworld cancelled error ', err.details);
          parent.queue.push({ type: 'disconnected' });
          break;

        case 3: // Error: 3 INVALID_ARGUMENT: Failed to interact with brain: SpeechEvent malformed: text is missing.
          // Handle this as a non-crashing
          break;

        case 7: // Unauthorized Access
          // Handle this as a crashing issue.
          break;

        case 8: // No account credits
          // Handle this as a crashing issue.
          break;

        case 9: // Session Expired
          console.error('❗ Inworld session expired ', err.details);
          parent.queue.push({ type: 'disconnected' });
          break;

        case 10: // Conversation paused due to inactivity
          console.error('❗ Inworld paused error ', err.details);
          console.log(
            client.getUID(),
            client.getScene(),
            client.getCharacter()
          )
          parent.queue.push({ type: 'disconnected' });
          break;

        case 14: // UNAVAILABLE: No connection established
          // Handle this as a non-crashing
          break;

        case 16: // Unauthenticated
          // Handle this as a crashing issue.
          break;

        default:
          console.error('onError', err.code)
          console.error('❗ Inworld default ', err);
          parent.queue.push({ type: 'disconnected' });
          break;

      }

    }

    function onMessage(packet: InworldPacket) {

      const { packetId } = packet;
      const p = packetId.packetId;
      const i = packetId.interactionId;
      const u = packetId.utteranceId;

      // TEXT
      if (packet.isText()) {
        const textEvent = packet.text;
        // console.log('Text', packet)
        if (packet.routing.source.isPlayer) {
          if (textEvent.final) {
            parent.queue.push({
              type: 'text',
              uid: configuration.uid,
              final: textEvent.final,
              text: textEvent.text,
              i,
              u,
              p
            })
          }
        } else {
          parent.queue.push({
            type: 'text',
            uid: configuration.uid,
            source: renderActor(packet.routing.source),
            target: renderActor(packet.routing.target),
            final: textEvent.final,
            text: textEvent.text,
            i,
            u,
            p
          })
        }
      }

      // EMOTION
      if (packet.isEmotion()) {
        parent.queue.push({
          type: 'emotion',
          uid: configuration.uid,
          joy: packet.emotions.joy,
          fear: packet.emotions.fear,
          trust: packet.emotions.trust,
          surprise: packet.emotions.surprise,
          behavior: getBehavior(packet.emotions.behavior),
          strength: getStrength(packet.emotions.strength)
        })
      }

      // CUSTOM
      if (packet.isCustom()) {
        parent.queue.push({
          type: 'custom',
          uid: configuration.uid,
          name: packet.custom.name
        })
      }

    } // End Client Create

  }

  flushQueue() {
    return this.queue.splice(0, this.queue.length);
  }

  getClient(uid: number, sceneId: string, characterId: string) {
    const client = this.clients.find(
      client => client.getUID() == uid
      && client.getScene() == sceneId
      && client.getCharacter() == characterId
    );
    if (client) return client;
    else return false;
  }

  getConnection(uid: number, sceneId: string, characterId: string) {
    const client = this.clients.find(
      client => client.getUID() == uid
      && client.getScene() == sceneId
      && client.getCharacter() == characterId
    );
    if (client) return client.getConnection();
    else return false;
  }

  getStatus(uid: number, sceneId: string, characterId: string) {
    // TODO
    return false;
  }

  // getScene(uid: number, character: string) {
  //   const client = this.clients.find(
  //     client => client.getUID() == uid && client.getCharacter() == character
  //   );
  //   return client.getScene();
  // }
  //
  // setScene(uid: number, character: string, id: string) {
  //   const client = this.clients.find(
  //     client => client.getUID() == uid && client.getCharacter() == character
  //   );
  //   return client.getClient().setScene(id).build()
  // }

}

export default InworldConnector
