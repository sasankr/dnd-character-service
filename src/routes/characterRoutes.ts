import { Router } from 'express';
import { CharacterController } from '../controllers/characterController';

export function createCharacterRouter(controller: CharacterController): Router {
  const router = Router();

  router.get('/:id', controller.getCharacter);
  router.post('/:id/damage', controller.dealDamage);
  router.post('/:id/heal', controller.heal);
  router.post('/:id/temp-hp', controller.setTempHp);

  return router;
}
