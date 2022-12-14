import { InworldPacket } from '@inworld/nodejs-sdk';
import { getBehavior, getStrength, renderActor, renderEventRouting } from './helpers';
import { TYPE_CUSTOM, TYPE_EMOTION, TYPE_TEXT } from './types';

function buildEvent(packet: InworldPacket, sessionId: string | undefined, uid: string, serverId?: string) {

  const { packetId } = packet;
  const p = packetId.packetId;
  const i = packetId.interactionId;
  const u = packetId.utteranceId;

  // TEXT
  if (packet.isText()) {
    const textEvent = packet.text;
    if (packet.routing.source.isPlayer) {
      if (textEvent.final) {
        return {
          type: TYPE_TEXT,
          sessionId: sessionId,
          uid: uid,
          serverId: serverId,
          final: textEvent.final,
          text: textEvent.text,
          i,
          u,
          p
        }
      }
    } else {
      return {
        type: TYPE_TEXT,
        sessionId: sessionId,
        uid: uid,
        serverId: serverId,
        source: renderActor(packet.routing.source),
        target: renderActor(packet.routing.target),
        final: textEvent.final,
        text: textEvent.text,
        i,
        u,
        p
      }
    }
  }

  // EMOTION
  if (packet.isEmotion()) {
    return {
      type: TYPE_EMOTION,
      sessionId: sessionId,
      uid: uid,
      serverId: serverId,
      joy: packet.emotions.joy,
      fear: packet.emotions.fear,
      trust: packet.emotions.trust,
      surprise: packet.emotions.surprise,
      behavior: getBehavior(packet.emotions.behavior),
      strength: getStrength(packet.emotions.strength)
    }
  }

  // CUSTOM
  if (packet.isCustom()) {
    return {
      type: TYPE_CUSTOM,
      sessionId: sessionId,
      uid: uid,
      serverId: serverId,
      name: packet.custom.name
    }
  }

}

export { buildEvent }
