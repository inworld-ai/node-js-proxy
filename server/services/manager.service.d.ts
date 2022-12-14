import { ServiceError } from '@grpc/grpc-js';
import { InworldPacket, InworldConnectionService } from '@inworld/nodejs-sdk';
import Client from '../client';
import config from '../config';
import { getBehavior, getStrength, renderActor, renderEventRouting } from '../common/helpers';

export declare class ServiceManager {

  private clients: Client[];
  private queue: any[];
  constructor();
  checkClient(uid: string, sceneId: string, characterId: string, serverId: String);
  flushServerQueue(serverId: string);
  flushQueue();
  getClient(sessionId: string);
  getUsersClients(userId: string);
  async testService();
  
}
