import {
  InworldPacket,
  InworldConnectionService
} from '@inworld/nodejs-sdk';

import { Client } from './inworld/client';

export declare class InworldConnector {
  private client: Client;
  private connection: InworldConnectionService;
  private queue: string[];
  constructor();
  flushQueue();
  getClient(uid: number, sceneId: string, characterId: string);
  getConnection(uid: number, sceneId: string, characterId: string);
  getStatus(uid: number, sceneId: string, characterId: string);
}
