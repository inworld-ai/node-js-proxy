import {
  Actor,
  ClientConfiguration,
  EmotionBehavior,
  EmotionStrength,
  InworldClient,
  InworldConnectionService,
  InworldPacket,
  ServiceError,
} from '@inworld/nodejs-sdk';
import { ChildProcess, fork } from 'child_process';
export class Client {
  private client: InworldClient;
  private connection: InworldConnectionService | null = null;

  constructor(props: {
    config?: ClientConfiguration;
    onDisconnect: () => void;
  }) {
    this.client = new InworldClient()
      .setApiKey({
        key: process.env.INWORLD_KEY!,
        secret: process.env.INWORLD_SECRET!,
      })
      .setScene(process.env.INWORLD_SCENE!)
      .setOnError((err: ServiceError) => console.error(`Error: ${err.message}`))
      .setOnDisconnect(() => {
        console.log('Disconnected');
        props.onDisconnect();
      })
      .setOnMessage((packet: InworldPacket) => {
        const { packetId } = packet;
        const i = packetId.packetId;
        const u = packetId.utteranceId;

        // TEXT
        if (packet.isText()) {
          const textEvent = packet.text;

          if (packet.routing.source.isPlayer) {
            if (textEvent.final) {
              console.log(
                `Recognized: ${textEvent.text}, final=${textEvent.final}`,
              );
            }
          } else {
            console.log(
              `${this.renderEventRouting(packet)} (i=${i}, u=${u}): ${
                textEvent.text
              }`,
            );
          }
        }

        // EMOTION
        if (packet.isEmotion()) {
          console.log(`Emotions:
            joy = ${packet.emotions.joy},
            fear = ${packet.emotions.fear},
            trust = ${packet.emotions.trust},
            surprise = ${packet.emotions.surprise},
            behavior = ${this.getBehavior(packet.emotions.behavior)},
            strength = ${this.getStrength(packet.emotions.strength)}
          `);
        }

        // TRIGGER
        if (packet.isCustom()) {
          console.log(`Trigger: ${packet.custom.name}`);
        }
      });

    if (props.config) {
      this.client.setConfiguration(props.config);
    }
  }

  closeConnection() {
  }

  getConnection() {
    this.connection = this.client.build();

    return this.connection;
  }

  private renderEventRouting = (packet: InworldPacket) => {
    return `${this.renderActor(packet.routing.source)} to ${this.renderActor(
      packet.routing.target,
    )}`;
  };

  private renderActor = (actor: Actor) => {
    if (actor.isPlayer) return 'Player';
    else if (actor.isCharacter) return `Character(${actor.name})`;
    else return 'Unknown';
  };

  private getBehavior = (behavior: EmotionBehavior) => {
    switch (true) {
      case behavior.isNeutral():
        return 'Neutral';
      case behavior.isDisgust():
        return 'Disgust';
      case behavior.isContempt():
        return 'Contempt';
      case behavior.isBelligerence():
        return 'Belligerence';
      case behavior.isDomineering():
        return 'Domineering';
      case behavior.isCriticism():
        return 'Criticism';
      case behavior.isAnger():
        return 'Anger';
      case behavior.isTension():
        return 'Tension';
      case behavior.isTenseHumor():
        return 'TenseHumor';
      case behavior.isDefensiveness():
        return 'Defensiveness';
      case behavior.isWhining():
        return 'Whining';
      case behavior.isSadness():
        return 'Sadness';
      case behavior.isStonewalling():
        return 'Stonewalling';
      case behavior.isInterest():
        return 'Interest';
      case behavior.isValidation():
        return 'Validation';
      case behavior.isAffection():
        return 'Affection';
      case behavior.isHumor():
        return 'Humor';
      case behavior.isSurprise():
        return 'Surprise';
      case behavior.isJoy():
        return 'Joy';
    }
  };

  private getStrength = (strength: EmotionStrength) => {
    switch (true) {
      case strength.isWeak():
        return 'Weak';
      case strength.isStrong():
        return 'Strong';
    }
  };
}
