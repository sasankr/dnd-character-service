import { Defense } from './damage';

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

export interface ItemModifier {
  affectedObject: string;
  affectedValue: string;
  value: number;
}

export interface CharacterItem {
  name: string;
  modifier: ItemModifier;
}

export interface CharacterData {
  name: string;
  level: number;
  hitPoints: number;
  classes: CharacterClass[];
  stats: CharacterStats;
  items: CharacterItem[];
  defenses: Defense[];
}

export interface CharacterState extends CharacterData {
  id: string;
  currentHitPoints: number;
  maxHitPoints: number;
  temporaryHitPoints: number;
}
