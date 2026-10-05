import { HpService } from '../src/services/hpService';
import { CharacterState } from '../src/types/character';

describe('HpService', () => {
  let mockCharacter: CharacterState;

  beforeEach(() => {
    mockCharacter = {
      id: 'briv',
      name: 'Briv',
      level: 5,
      hitPoints: 25,
      maxHitPoints: 25,
      currentHitPoints: 25,
      temporaryHitPoints: 0,
      classes: [{ name: 'Fighter', hitDiceValue: 10, classLevel: 5 }],
      stats: {
        strength: 15,
        dexterity: 14,
        constitution: 13,
        intelligence: 12,
        wisdom: 10,
        charisma: 8
      },
      items: [],
      defenses: [
        { type: 'fire', defense: 'immunity' },
        { type: 'slashing', defense: 'resistance' }
      ]
    };
  });

  describe('Damage Calculations', () => {
    test('applies unmitigated damage directly to hit points', () => {
      const result = HpService.applyDamage(mockCharacter, 14, 'piercing');
      expect(result.currentHitPoints).toBe(11);
      expect(result.temporaryHitPoints).toBe(0);
    });

    test('halves damage (rounded down) when character has resistance', () => {
      // 15 slashing -> resistance -> floor(15/2) = 7 damage. 25 - 7 = 18
      const result = HpService.applyDamage(mockCharacter, 15, 'slashing');
      expect(result.currentHitPoints).toBe(18);
    });

    test('reduces damage to 0 when character has immunity', () => {
      const result = HpService.applyDamage(mockCharacter, 20, 'fire');
      expect(result.currentHitPoints).toBe(25);
    });

    test('absorbs damage using temporary hit points before affecting current HP', () => {
      mockCharacter.temporaryHitPoints = 10;
      const result = HpService.applyDamage(mockCharacter, 6, 'piercing');
      expect(result.temporaryHitPoints).toBe(4);
      expect(result.currentHitPoints).toBe(25);
    });

    test('overflows damage from temporary hit points into base HP', () => {
      mockCharacter.currentHitPoints = 11;
      mockCharacter.temporaryHitPoints = 10;
      // 19 damage: absorbs 10 temp HP, remaining 9 damage reduces 11 HP to 2
      const result = HpService.applyDamage(mockCharacter, 19, 'piercing');
      expect(result.temporaryHitPoints).toBe(0);
      expect(result.currentHitPoints).toBe(2);
    });

    test('clamps hit points at 0 and does not go negative', () => {
      const result = HpService.applyDamage(mockCharacter, 50, 'bludgeoning');
      expect(result.currentHitPoints).toBe(0);
    });
  });

  describe('Healing Calculations', () => {
    test('restores hit points up to maximum hit points', () => {
      mockCharacter.currentHitPoints = 10;
      const result = HpService.applyHealing(mockCharacter, 8);
      expect(result.currentHitPoints).toBe(18);
    });

    test('does not heal beyond maximum hit points', () => {
      mockCharacter.currentHitPoints = 20;
      const result = HpService.applyHealing(mockCharacter, 10);
      expect(result.currentHitPoints).toBe(25);
    });

    test('does not affect temporary hit points during healing', () => {
      mockCharacter.currentHitPoints = 15;
      mockCharacter.temporaryHitPoints = 5;
      const result = HpService.applyHealing(mockCharacter, 5);
      expect(result.currentHitPoints).toBe(20);
      expect(result.temporaryHitPoints).toBe(5);
    });
  });

  describe('Temporary Hit Points', () => {
    test('grants temporary hit points when none are present', () => {
      const result = HpService.setTemporaryHp(mockCharacter, 10);
      expect(result.temporaryHitPoints).toBe(10);
    });

    test('replaces temporary hit points when new value is higher', () => {
      mockCharacter.temporaryHitPoints = 5;
      const result = HpService.setTemporaryHp(mockCharacter, 12);
      expect(result.temporaryHitPoints).toBe(12);
    });

    test('keeps existing temporary hit points when incoming value is lower', () => {
      mockCharacter.temporaryHitPoints = 15;
      const result = HpService.setTemporaryHp(mockCharacter, 10);
      expect(result.temporaryHitPoints).toBe(15);
    });
  });
});
