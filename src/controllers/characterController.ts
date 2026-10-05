import { Request, Response } from 'express';
import { CharacterRepository } from '../services/characterRepository';
import { HpService } from '../services/hpService';

export class CharacterController {
  constructor(private repo: CharacterRepository) {}

  public getCharacter = (req: Request, res: Response): void => {
    const { id } = req.params;
    const character = this.repo.getById(id);

    if (!character) {
      res.status(404).json({ error: `Character with id '${id}' not found` });
      return;
    }

    res.status(200).json(character);
  };

  public dealDamage = (req: Request, res: Response): void => {
    const { id } = req.params;
    const { amount, damageType } = req.body;

    const character = this.repo.getById(id);
    if (!character) {
      res.status(404).json({ error: `Character with id '${id}' not found` });
      return;
    }

    const updated = HpService.applyDamage(character, amount, damageType);
    this.repo.update(updated);

    res.status(200).json(updated);
  };

  public heal = (req: Request, res: Response): void => {
    const { id } = req.params;
    const { amount } = req.body;

    const character = this.repo.getById(id);
    if (!character) {
      res.status(404).json({ error: `Character with id '${id}' not found` });
      return;
    }

    const updated = HpService.applyHealing(character, amount);
    this.repo.update(updated);

    res.status(200).json(updated);
  };

  public setTempHp = (req: Request, res: Response): void => {
    const { id } = req.params;
    const { amount } = req.body;

    const character = this.repo.getById(id);
    if (!character) {
      res.status(404).json({ error: `Character with id '${id}' not found` });
      return;
    }

    const updated = HpService.setTemporaryHp(character, amount);
    this.repo.update(updated);

    res.status(200).json(updated);
  };
}
