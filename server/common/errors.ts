import { ServiceError } from '@grpc/grpc-js';
import { TYPE_DISCONNECTED, TYPE_PAUSED } from './types';

function buildError(err: ServiceError, sessionId: string | undefined, uid: string, serverId?: string) {

  switch (err.code) {

    case 1: // Session closed
      console.error('Client closed session', sessionId);
      return {
        type: TYPE_DISCONNECTED,
        sessionId: sessionId,
        uid: uid,
        serverId: serverId };
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
      return {
        type: TYPE_DISCONNECTED,
        sessionId: sessionId,
        uid: uid,
        serverId: serverId };
      break;

    case 10: // Conversation paused due to inactivity
      // console.error('❗ Inworld paused', sessionId, uid, sessionId);
      return {
        type: TYPE_PAUSED,
        sessionId: sessionId,
        uid: uid,
        serverId: serverId };
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
      return {
        type: TYPE_DISCONNECTED,
        sessionId: sessionId,
        uid: uid,
        serverId: serverId };
      break;

  }

}

export { buildError }
