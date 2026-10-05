export const VALID_DAMAGE_TYPES = [
  'bludgeoning',
  'piercing',
  'slashing',
  'fire',
  'cold',
  'acid',
  'thunder',
  'lightning',
  'poison',
  'radiant',
  'necrotic',
  'psychic',
  'force'
] as const;

export type DamageType = typeof VALID_DAMAGE_TYPES[number];

export function isValidDamageType(type: string): type is DamageType {
  return VALID_DAMAGE_TYPES.includes(type.toLowerCase() as DamageType);
}

export type DefenseType = 'immunity' | 'resistance';

export interface Defense {
  type: DamageType | string;
  defense: DefenseType | string;
}