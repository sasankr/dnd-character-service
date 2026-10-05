import express, { Express } from 'express';
import cors from 'cors';
import { CharacterRepository } from './services/characterRepository';
import { CharacterController } from './controllers/characterController';
import { createCharacterRouter } from './routes/characterRoutes';

export function createApp(repo?: CharacterRepository): Express {
  const app = express();
  
  app.use(cors());
  app.use(express.json());

  const characterRepository = repo || new CharacterRepository();
  const characterController = new CharacterController(characterRepository);

  // Character routes
  app.use('/characters', createCharacterRouter(characterController));

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // Root endpoint info
  app.get('/', (_req, res) => {
    res.status(200).json({
      service: 'D&D Character Hit Point Management Service',
      version: '1.0.0',
      endpoints: {
        character: 'GET /characters/:id (e.g. /characters/briv)',
        damage: 'POST /characters/:id/damage',
        heal: 'POST /characters/:id/heal',
        tempHp: 'POST /characters/:id/temp-hp',
        health: 'GET /health'
      }
    });
  });

  return app;
}