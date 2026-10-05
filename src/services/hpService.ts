import { CharacterState } from '../types/character';
import { DamageType } from '../types/damage';

export class HpService {
  /**
   * Applies incoming damage of a specific type to a character,
   * accounting for immunities, resistances, temporary hit points, and the base HP pool.
   */
  public static applyDamage(
    character: CharacterState,
    amount: number,
    damageType: DamageType | string
  ): CharacterState {
    if (amount <= 0) {
      return { ...character };
    }

    const normalizedDamageType = damageType.toLowerCase();

    // Check for immunity (0 damage)
    const isImmune = character.defenses.some(
      (d) =>
        d.type.toLowerCase() === normalizedDamageType &&
        d.defense.toLowerCase() === 'immunity'
    );
    if (isImmune) {
      return { ...character };
    }

    // Check for resistance (half damage, rounded down per 5e rules)
    const isResistant = character.defenses.some(
      (d) =>
        d.type.toLowerCase() === normalizedDamageType &&
        d.defense.toLowerCase() === 'resistance'
    );

    let effectiveDamage = isResistant ? Math.floor(amount / 2) : amount;

    let updatedTempHp = character.temporaryHitPoints || 0;
    let updatedCurrentHp = character.currentHitPoints;

    // Temporary hit points absorb damage first
    if (updatedTempHp > 0) {
      if (effectiveDamage <= updatedTempHp) {
        updatedTempHp -= effectiveDamage;
        effectiveDamage = 0;
      } else {
        effectiveDamage -= updatedTempHp;
        updatedTempHp = 0;
      }
    }

    // Remaining damage applies to current HP pool (bounded to minimum 0)
    if (effectiveDamage > 0) {
      updatedCurrentHp = Math.max(0, updatedCurrentHp - effectiveDamage);
    }

    return {
      ...character,
      currentHitPoints: updatedCurrentHp,
      temporaryHitPoints: updatedTempHp
    };
  }

  /**
   * Applies healing to a character, increasing current HP up to maxHitPoints.
   * Does not affect temporary hit points.
   */
  public static applyHealing(
    character: CharacterState,
    amount: number
  ): CharacterState {
    if (amount <= 0) {
      return { ...character };
    }

    const updatedCurrentHp = Math.min(
      character.maxHitPoints,
      character.currentHitPoints + amount
    );

    return {
      ...character,
      currentHitPoints: updatedCurrentHp
    };
  }

  /**
   * Sets temporary hit points according to D&D 5e rules:
   * Non-additive, always taking the higher value between existing and incoming.
   */
  public static setTemporaryHp(
    character: CharacterState,
    amount: number
  ): CharacterState {
    if (amount <= 0) {
      return { ...character };
    }

    const updatedTempHp = Math.max(
      character.temporaryHitPoints || 0,
      amount
    );

    return {
      ...character,
      temporaryHitPoints: updatedTempHp
    };
  }
}
