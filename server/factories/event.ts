/**
 * This module involves the building of events and errors into a common type that
 * can be added to the event queue.
 *
 * @module
 */

import { ServiceError } from '@grpc/grpc-js';
import { InworldPacket } from '@inworld/nodejs-sdk';

import { getBehavior, getStrength } from '../common/helpers';
import { TYPE_CUSTOM, TYPE_DISCONNECTED, TYPE_EMOTION, TYPE_PAUSED, TYPE_TEXT } from '../common/types';

export interface IEvent {
  type: string,
  serverId?: string | undefined,
  sessionId: string | undefined,
  uid?: string | undefined
}

export interface IEventCustom extends IEvent {
  name: string
}

export interface IEventEmotion extends IEvent {
  joy: number,
  fear: number,
  trust: number,
  surprise: number,
  behavior: string | undefined,
  strength: string | undefined
}

export interface IEventText extends IEvent {
  final: boolean,
  text: string
}

export class EventFactory {

  static buildError(err: ServiceError, sessionId: string | undefined, uid: string | undefined, serverId: string | undefined): IEvent | undefined {

    let event: IEvent;

    switch (err.code) {

      case 1: // Session closed
        console.error('Client closed session', sessionId);
        event = {
          type: TYPE_DISCONNECTED,
          sessionId: sessionId,
          uid: uid,
          serverId: serverId };
        return event;
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
        event = {
          type: TYPE_DISCONNECTED,
          sessionId: sessionId,
          uid: uid,
          serverId: serverId };
        return event;
        break;

      case 10: // Conversation paused due to inactivity
        console.error('❗ Inworld paused', sessionId, uid, sessionId);
        event = {
          type: TYPE_PAUSED,
          sessionId: sessionId,
          uid: uid,
          serverId: serverId };
        return event;
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
        event = {
          type: TYPE_DISCONNECTED,
          sessionId: sessionId,
          uid: uid,
          serverId: serverId };
        return event;
        break;

    }

    return

  }

  static buildEvent(packet: InworldPacket, sessionId: string | undefined, uid?: string | undefined, serverId?: string | undefined): IEvent | undefined {

    // TEXT
    if (packet.isText()) {
      const event: IEventText = {
        type: TYPE_TEXT,
        sessionId: sessionId,
        uid: uid,
        serverId: serverId,
        final: packet.text.final,
        text: packet.text.text
      };
      return event;
    }

    // EMOTION
    if (packet.isEmotion()) {
      const event: IEventEmotion = {
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
      };
      return event;
    }

    // CUSTOM
    if (packet.isCustom()) {
      const event: IEventCustom = {
        type: TYPE_CUSTOM,
        sessionId: sessionId,
        uid: uid,
        serverId: serverId,
        name: packet.custom.name
      };
      return event;
    }

    return;

  }

}
