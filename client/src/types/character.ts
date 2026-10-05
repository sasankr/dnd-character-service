export type DamageType =
  | 'bludgeoning'
  | 'piercing'
  | 'slashing'
  | 'fire'
  | 'cold'
  | 'acid'
  | 'thunder'
  | 'lightning'
  | 'poison'
  | 'radiant'
  | 'necrotic'
  | 'psychic'
  | 'force';

export interface Defense {
  type: string;
  defense: 'immunity' | 'resistance' | string;
}

export interface CharacterStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface CharacterClass {
  name: string;
  hitDiceValue: number;
  classLevel: number;
}

export interface CharacterState {
  id: string;
  name: string;
  level: number;
  hitPoints: number;
  maxHitPoints: number;
  currentHitPoints: number;
  temporaryHitPoints: number;
  classes: CharacterClass[];
  stats: CharacterStats;
  defenses: Defense[];
}
