/**
 * This module defines the RESTful routes the server can receive and validation
 * of the incoming requests.
 *
 * @module
 */

import { Application, Router as ExpressRouter } from "express";
import { ValidatedRequest, createValidator } from 'express-joi-validation';
import * as Joi from 'joi';

import { GetCharacterRequestSchema,
  SetCharacterRequestSchema,
  GetCharactersRequestSchema,
  CloseSessionRequestSchema,
  CloseAllUserSessionsRequestSchema,
  CloseAllUserSessionsByServerRequestSchema,
  SendCustomRequestSchema,
  SendMessageRequestSchema,
  OpenSessionsRequestSchema,
  GetSessionStatusRequestSchema,
  GetSessionEventsByServerRequestSchema,
  SetSessionServerRequestSchema
} from './router.interfaces';
import { RouterService } from '../services/router.service';


/**
 * Router loads and processes the RESTful routes
 */
export class Router {

  /**
   * Router class for loading the RESTful routes
   *
   * @param {Object} props - Constructor properties
   * @param {RouterService} props.service - The router service
   * @param {Application} props.server - The Express Application server
   */
  constructor(props: { service: RouterService, server: Application }) {

    /**
     * Express router to mount HTTP requests to related functions.
     * @type {object}
     * @const
     */
    const router: ExpressRouter = ExpressRouter();
    const validate = createValidator();

    // Home Route - Used for checking if the server is running
    router.get('/', (req, res) => {
      res.send('Inworld.AI RESTful Server');
    });

    /**
     * Route serving login form.
     * @name get/login
     * @function
     * @memberof module:routers/users~usersRouter
     * @inner
     * @param {string} path - Express path
     * @param {callback} middleware - Express middleware.
     */
    // Status Route - An API friendly version of checking if the server is running
    router.get('/status', (req, res) => {
      res.sendStatus(200);
    });

    // Get Current Character Route - Returns the character information for an active session
    router.get('/session/:sessionId/character',
    validate.params(
      Joi.object({
        sessionId: Joi.string().required()
      })
    ),
    async (req: ValidatedRequest<GetCharacterRequestSchema>, res) => {
      const {
        params: { sessionId }
      } = req;
      const response = await props.service.getCharacter(sessionId);
      if (response)
        res.json(response);
      else
        res.status(404).json('Session ' + sessionId + ' Not Found');
    });

    // Set Character In Scene Route - Changes the current character in the scene for an active session
    router.post('/session/:sessionId/character/:characterId',
    validate.params(
      Joi.object({
        sessionId: Joi.string().required(),
        characterId: Joi.string().required()
      })
    ),
    async (req: ValidatedRequest<SetCharacterRequestSchema>, res) => {
      const {
        params: { sessionId, characterId }
      } = req;
      const response = await props.service.setCharacter(sessionId, characterId);
      if (response)
        res.json(response);
      else
        res.status(404).json('Session ' + sessionId + ' Not Found');
    });

    // Get All Characters In Scene Route - Returns a list of all the characters in the scene for an active session
    router.get('/session/:sessionId/characters',
      validate.params(
        Joi.object({
          sessionId: Joi.string().required()
        })
      ),
      async (req: ValidatedRequest<GetCharactersRequestSchema>, res) => {
        const {
          params: { sessionId }
        } = req;
        const response = await props.service.getCharacters(sessionId);
        if (response)
          res.json(response);
        else
          res.status(404).json('Session ' + sessionId + ' Not Found');
      }
    );

    // Close Active Session Route - Terminates an active session
    router.get('/session/:sessionId/close',
      validate.params(
        Joi.object({
          sessionId: Joi.string().required()
        })
      ),
      async (req: ValidatedRequest<CloseSessionRequestSchema>, res) => {
        const {
          params: { sessionId }
        } = req;
        const response = props.service.sessionClose(sessionId);
        if(response) {
          res.sendStatus(200);
        } else {
          res.status(404).json('Session ' + sessionId + ' Not Found');
        }
      }
    );

    // Close Players Active Sessions Route - Terminates all active sessions for a player 
    router.get('/session/closeall/:uid',
      validate.params(
        Joi.object({
          uid: Joi.string().required()
        })
      ),
      async (req: ValidatedRequest<CloseAllUserSessionsRequestSchema>, res) => {
        const {
          params: { uid }
        } = req;
        const response = props.service.closeAll(uid);
        if(response) {
          res.sendStatus(200);
        } else {
          res.status(404).json('User ' + uid + ' Not Found');
        }
      }
    );

    // Close Players Active Sessions On Server Route - Terminates all active sessions for a player on a server
    router.get('/session/closeall/:uid/server/:serverId',
      validate.params(
        Joi.object({
          uid: Joi.string().required(),
          serverId: Joi.string().required()
        })
      ),
      async (req: ValidatedRequest<CloseAllUserSessionsByServerRequestSchema>, res) => {
        const {
          params: { uid, serverId }
        } = req;
        const response = props.service.closeAll(uid, serverId);
        if(response) {
          res.sendStatus(200);
        } else {
          res.status(404).json('User ' + uid + ' or Server ' + serverId + ' Not Found');
        }
      }
    );

    router.get('/session/:sessionId/custom/:customId',
      validate.params(
        Joi.object({
          sessionId: Joi.string().required(),
          customId: Joi.string().required()
        })
      ),
      async (req: ValidatedRequest<SendCustomRequestSchema>, res) => {
        const {
          params: { sessionId, customId }
        } = req;
        const response = await props.service.sendCustom(sessionId, customId);
        if (response)
          res.sendStatus(202);
        else
          res.sendStatus(404);
      }
    );

    router.post('/session/:sessionId/message',
      validate.params(
        Joi.object({
          sessionId: Joi.string().required()
        })
      ),
      validate.body(
        Joi.object({
          message: Joi.string().required()
        }
      )),
      async (req : ValidatedRequest<SendMessageRequestSchema>, res) => {
        const {
          body: { message },
          params: { sessionId }
        } = req;
        const response = await props.service.sendMessage(sessionId, message);
        if (response)
          res.sendStatus(202);
        else
          res.status(404).json('Session ' + sessionId + ' Not Found');
      }
    );

    router.post('/session/open',
      validate.body(
        Joi.object({
          uid: Joi.string().required(),
          sceneId: Joi.string().required(),
          characterId: Joi.string().required(),
          playerName: Joi.string().optional(),
          serverId: Joi.string().optional()
        })
      ),
      async (req: ValidatedRequest<OpenSessionsRequestSchema>, res) => {
        const {
          body: { uid, sceneId, characterId, playerName, serverId }
        } = req;
        const response = await props.service.sessionOpen(uid, sceneId, characterId, playerName, serverId);
        if (response)
          res.json(response);
        else
          res.status(409).json('Unable to create session');
      }
    );

    router.get('/session/:sessionId/server/:serverId',
      validate.params(
        Joi.object({
          sessionId: Joi.string().required(),
          serverId: Joi.string().required()
        })
      ),
      async (req: ValidatedRequest<SetSessionServerRequestSchema>, res) => {
        const {
          params: { sessionId, serverId }
        } = req;
        const response = await props.service.setServer(sessionId, serverId);
        if (response)
          res.sendStatus(202);
        else
          res.status(404).json('Session ' + sessionId + ' Not Found');
      }
    );

    router.get('/session/:sessionId/status',
      validate.params(
        Joi.object({
          sessionId: Joi.string().required()
        })
      ),
      async (req: ValidatedRequest<GetSessionStatusRequestSchema>, res) => {
        const {
          params: { sessionId }
        } = req;
        const response = await props.service.getStatus(sessionId);
        if (response)
          res.json(response);
        else
          res.status(404).json('Session ' + sessionId + ' Not Found');
      }
    );

    // Note: This route is not displayed in logging output
    router.get('/events',
      async (req, res) => {
      const events = props.service.getEvents();
      res.json(events);
    });

    // Note: This route is not displayed in logging output
    router.get('/events/:serverId',
      validate.params(
        Joi.object({
          serverId: Joi.string().required()
        })
      ),
      async (req: ValidatedRequest<GetSessionEventsByServerRequestSchema>, res) => {
        const {
          params: { serverId }
        } = req;
        const events = await props.service.getEvents(serverId);
        res.json(events);
      }
    );

    props.server.use(router);

    props.server.use((req, res) => {
      res.status(404).json('Route Not Found');
    });

    console.log('✔️ Routes Success');

  }

}
