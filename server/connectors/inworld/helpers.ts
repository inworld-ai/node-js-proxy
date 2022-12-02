import {
  Actor,
  EmotionBehavior,
  EmotionStrength,
  InworldPacket,
} from '@inworld/nodejs-sdk';

function getBehavior(behavior: EmotionBehavior) {
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

function getStrength(strength: EmotionStrength) {
  switch (true) {
    case strength.isWeak():
    return 'Weak';
    case strength.isStrong():
    return 'Strong';
  }
};

function renderActor(actor: Actor) {
  if (actor.isPlayer) return 'Player';
  else if (actor.isCharacter) return `Character(${actor.name})`;
  else return 'Unknown';
};

function renderEventRouting(packet: InworldPacket) {
  return `${renderActor(packet.routing.source)} to ${renderActor(
    packet.routing.target,
  )}`;
};

export { getBehavior, getStrength, renderActor, renderEventRouting }
