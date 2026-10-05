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

  app.use('/characters', createCharacterRouter(characterController));

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  return app;
}
