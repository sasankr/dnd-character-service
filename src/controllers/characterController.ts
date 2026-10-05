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

    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
      res.status(400).json({ error: 'Damage amount must be a positive number' });
      return;
    }

    if (!damageType || typeof damageType !== 'string' || damageType.trim().length === 0) {
      res.status(400).json({ error: 'Damage type must be a non-empty string' });
      return;
    }

    const character = this.repo.getById(id);
    if (!character) {
      res.status(404).json({ error: `Character with id '${id}' not found` });
      return;
    }

    const updated = HpService.applyDamage(character, amount, damageType.trim());
    this.repo.update(updated);

    res.status(200).json(updated);
  };

  public heal = (req: Request, res: Response): void => {
    const { id } = req.params;
    const { amount } = req.body;

    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
      res.status(400).json({ error: 'Heal amount must be a positive number' });
      return;
    }

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

    if (typeof amount !== 'number' || isNaN(amount) || amount < 0) {
      res.status(400).json({ error: 'Temporary HP amount must be a non-negative number' });
      return;
    }

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
