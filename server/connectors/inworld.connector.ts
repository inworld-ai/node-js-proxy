import { ServiceError } from '@grpc/grpc-js';
import {
  InworldPacket,
  InworldConnectionService
} from '@inworld/nodejs-sdk';

import Client from './inworld/client';
import { getBehavior, getStrength, renderActor, renderEventRouting } from './inworld/helpers';

class InworldConnector {

  private client: Client | null = null;
  private connection: InworldConnectionService | null = null;
  private queue: any[];

  private key: string = process.env.INWORLD_KEY!
  private secret: string = process.env.INWORLD_SECRET!
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
        scene: this.scene!,
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

  async clientOpen( configuration: {
    scene: string;
    playerName: string;
    character: string;
  } ) {
    
    this.queue = [];

    const client = new Client({
      config: {
        capabilities: { audio: false, emotions: true },
      },
      key: this.key,
      secret: this.secret,
      scene: configuration.scene,
      playerName: configuration.playerName,
      onDisconnect: onDisconnect,
      onError: onError,
      onMessage: onMessage
    });
    this.client = client;

    const connection = client.getConnection();
    this.connection = connection;

    const characters = await connection.getCharacters();
    const character = characters.find(character => character.getId() === configuration.character);
    if (character) connection.setCurrentCharacter(character);

    this.connection.sendText("Hello");

    var parent = this;

    function onDisconnect() {
      console.info('❗ Inworld disconnected ' + Date.now());
    }

    function onError(err: ServiceError) {

      switch (err.code) {

        case 1: // Conversation cancelled
          console.error('❗ Inworld cancelled error ', err.details);
          parent.queue.push({ type: 'disconnected' });
          break;

        case 9: // Session Expired
          console.error('❗ Inworld session expired ', err.details);
          parent.queue.push({ type: 'disconnected' });
          break;

        case 10: // Conversation paused due to inactivity
          console.error('❗ Inworld paused error ', err.details);
          parent.queue.push({ type: 'disconnected' });
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
      const i = packetId.packetId;
      const u = packetId.utteranceId;

      // TEXT
      if (packet.isText()) {
        const textEvent = packet.text;
        // console.log('Text', textEvent.text)
        if (packet.routing.source.isPlayer) {
          if (textEvent.final) {
            parent.queue.push({
              type: 'text',
              final: textEvent.final,
              text: textEvent.text
            })
          }
        } else {
          parent.queue.push({
            type: 'text',
            source: renderActor(packet.routing.source),
            target: renderActor(packet.routing.target),
            final: textEvent.final,
            text: textEvent.text,
            i: i,
            u: u
          })
        }
      }

      // EMOTION
      if (packet.isEmotion()) {
        parent.queue.push({
          type: 'emotion',
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
          name: packet.custom.name
        })
      }

    } // End Client Create

  }

  getScene() {
    return this.scene
  }

  setScene(id : string) {
    this.scene = id
    return this.client!.getClient().setScene(this.scene).build()
  }

  flushQueue() {
    return this.queue.splice(0, this.queue.length);
  }

  getClient() {
    return this.client;
  }

  getConnection() {
    return this.connection;
  }

}

export default InworldConnector
