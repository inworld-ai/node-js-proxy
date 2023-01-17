/**
 * This module defines interfaces types used in validation of the incoming requests.
 *
 * @module
 */

import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';

export interface GetCharacterRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    sessionId: string
  }
}

export interface SetCharacterRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    sessionId: string,
    characterId: string
  }
}

export interface GetCharactersRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    sessionId: string
  }
}

export interface CloseSessionRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    sessionId: string
  }
}

export interface CloseAllUserSessionsRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    uid: string
  }
}

export interface CloseAllUserSessionsByServerRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    uid: string,
    serverId: string
  }
}

export interface SendCustomRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    sessionId: string,
    customId: string
  }
}

export interface SendMessageRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    sessionId: string
  },
  [ContainerTypes.Body]: {
    message: string
  }
}

export interface OpenSessionsRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    uid: string,
    sceneId: string,
    characterId: string,
    playerName: string,
    serverId?: string
  }
}

export interface GetSessionStatusRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    sessionId: string
  }
}

export interface GetSessionEventsByServerRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    serverId: string
  }
}

export interface SetSessionServerRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    sessionId: string,
    serverId: string
  }
}
