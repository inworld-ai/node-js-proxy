import { Application, Router } from "express";
import * as Joi from 'joi'
import { ContainerTypes,
  ValidatedRequest,
  ValidatedRequestSchema,
  createValidator } from 'express-joi-validation'
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
  GetSessionEventsByServerRequestSchema
} from './interfaces.routes'

import App from '../app';

class Routes {

  constructor(props: { app: App, server: Application }) {

    const router: Router = Router();
    const validate = createValidator();

    router.get('/', (req, res) => {
      res.send("Inworld.AI NodeJS Proxy");
    });

    router.get('/status', (req, res) => {
      res.sendStatus(200);
    });

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
      const response = await props.app.getService().getCharacter(sessionId);
      if (response)
        res.json(response);
      else
        res.status(404).json('Session ' + sessionId + ' Not Found');
    });

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
      const response = await props.app.getService().setCharacter(sessionId, characterId);
      if (response)
        res.json(response);
      else
        res.status(404).json('Session ' + sessionId + ' Not Found');
    });

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
        const response = await props.app.getService().getCharacters(sessionId);
        if (response)
          res.json(response);
        else
          res.status(404).json('Session ' + sessionId + ' Not Found');
      }
    );

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
        const response = props.app.getService().clientClose(sessionId);
        if(response) {
          res.sendStatus(200);
        } else {
          res.status(404).json('Session ' + sessionId + ' Not Found');
        }
      }
    );

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
        const response = props.app.getService().closeAll(uid);
        if(response) {
          res.sendStatus(200);
        } else {
          res.status(404).json('User ' + uid + ' Not Found');
        }
      }
    );

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
        const response = props.app.getService().closeAll(uid, serverId);
        if(response) {
          res.sendStatus(200);
        } else {
          res.status(404).json('User ' + uid + ' or Server ' + serverId + ' Not Found');
        }
      }
    );

    router.post('/session/:sessionId/custom/:customId',
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
        const response = await props.app.getService().sendCustom(sessionId, customId);
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
        const response = await props.app.getService().sendMessage(sessionId, message);
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
          playerName: Joi.string().required(),
          serverId: Joi.string().optional()
        })
      ),
      async (req: ValidatedRequest<OpenSessionsRequestSchema>, res) => {
        const {
          body: { uid, sceneId, characterId, playerName, serverId }
        } = req;
        const response = await props.app.getService().clientOpen(uid, sceneId, characterId, playerName, serverId);
        if (response)
          res.json(response);
        else
          res.status(409).json('Unable to create session');
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
        const response = await props.app.getService().getStatus(sessionId);
        if (response)
          res.json(response);
        else
          res.sendStatus(404);
      }
    );

    // Note: This route is not displayed in logging output
    router.get('/events',
      async (req, res) => {
      const events = props.app.getService().getEvents();
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
        const events = await props.app.getService().getEvents(serverId);
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

export default Routes;
