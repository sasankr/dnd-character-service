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

export type DefenseType = 'immunity' | 'resistance';

export interface Defense {
  type: DamageType | string;
  defense: DefenseType | string;
}
