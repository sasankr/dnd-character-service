import fs from 'fs';
import path from 'path';
import { CharacterData, CharacterState } from '../types/character';

export class CharacterRepository {
  private characters: Map<string, CharacterState> = new Map();
  private dataDir: string;

  constructor(dataDir?: string) {
    this.dataDir = dataDir || path.resolve(process.cwd(), 'data');
    this.initialize();
  }

  /**
   * Loads all JSON character files from the data directory into memory.
   */
  public initialize(): void {
    if (!fs.existsSync(this.dataDir)) {
      return;
    }

    const files = fs.readdirSync(this.dataDir).filter((file) => file.endsWith('.json'));

    for (const file of files) {
      const characterId = path.basename(file, '.json').toLowerCase();
      const filePath = path.join(this.dataDir, file);
      const rawContent = fs.readFileSync(filePath, 'utf-8');
      const data: CharacterData = JSON.parse(rawContent);

      const state: CharacterState = {
        ...data,
        id: characterId,
        maxHitPoints: data.hitPoints,
        currentHitPoints: data.hitPoints,
        temporaryHitPoints: 0
      };

      this.characters.set(characterId, state);
    }
  }

  public getById(id: string): CharacterState | undefined {
    return this.characters.get(id.toLowerCase());
  }

  public update(character: CharacterState): void {
    this.characters.set(character.id.toLowerCase(), character);
  }

  public getAll(): CharacterState[] {
    return Array.from(this.characters.values());
  }
}
