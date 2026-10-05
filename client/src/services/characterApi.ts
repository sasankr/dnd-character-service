import { CharacterState } from '../types/character';

const BASE_URL = 'http://localhost:3000';

export class CharacterApi {
  public static async getCharacter(id: string): Promise<CharacterState> {
    const res = await fetch(`${BASE_URL}/characters/${id}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch character: ${res.statusText}`);
    }
    return res.json();
  }

  public static async dealDamage(
    id: string,
    amount: number,
    damageType: string
  ): Promise<CharacterState> {
    const res = await fetch(`${BASE_URL}/characters/${id}/damage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, damageType })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to deal damage');
    }
    return res.json();
  }

  public static async heal(id: string, amount: number): Promise<CharacterState> {
    const res = await fetch(`${BASE_URL}/characters/${id}/heal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to heal');
    }
    return res.json();
  }

  public static async setTempHp(id: string, amount: number): Promise<CharacterState> {
    const res = await fetch(`${BASE_URL}/characters/${id}/temp-hp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to set temporary HP');
    }
    return res.json();
  }
}
