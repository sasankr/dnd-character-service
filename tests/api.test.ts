import request from 'supertest';
import path from 'path';
import { createApp } from '../src/app';
import { CharacterRepository } from '../src/services/characterRepository';

describe('Character API Endpoints', () => {
  let app: any;
  let repo: CharacterRepository;

  beforeEach(() => {
    const dataDir = path.resolve(__dirname, '../data');
    repo = new CharacterRepository(dataDir);
    app = createApp(repo);
  });

  describe('GET /characters/:id', () => {
    test('returns character data for existing character (briv)', async () => {
      const res = await request(app).get('/characters/briv');
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Briv');
      expect(res.body.currentHitPoints).toBe(25);
      expect(res.body.maxHitPoints).toBe(25);
      expect(res.body.temporaryHitPoints).toBe(0);
    });

    test('returns 404 when character is not found', async () => {
      const res = await request(app).get('/characters/unknown_hero');
      expect(res.status).toBe(404);
      expect(res.body.error).toContain('not found');
    });
  });

  describe('POST /characters/:id/damage', () => {
    test('successfully applies piercing damage', async () => {
      const res = await request(app)
        .post('/characters/briv/damage')
        .send({ amount: 14, damageType: 'piercing' });

      expect(res.status).toBe(200);
      expect(res.body.currentHitPoints).toBe(11);
      expect(res.body.temporaryHitPoints).toBe(0);
    });

    test('applies fire damage immunity', async () => {
      const res = await request(app)
        .post('/characters/briv/damage')
        .send({ amount: 20, damageType: 'fire' });

      expect(res.status).toBe(200);
      expect(res.body.currentHitPoints).toBe(25);
    });

    test('halves damage when character has resistance to the damage type', async () => {
      // 15 slashing damage vs slashing resistance -> Math.floor(15/2) = 7 dmg -> 25 - 7 = 18
      const res = await request(app)
        .post('/characters/briv/damage')
        .send({ amount: 15, damageType: 'slashing' });

      expect(res.status).toBe(200);
      expect(res.body.currentHitPoints).toBe(18);
    });

    test('correctly chains resistance mitigation with temporary HP absorption', async () => {
      // 1. Give Briv 5 Temporary HP (HP: 25, Temp: 5)
      await request(app)
        .post('/characters/briv/temp-hp')
        .send({ amount: 5 });

      // 2. Deal 15 Slashing damage (Briv has Slashing resistance)
      // Math: 15 / 2 = 7 (rounded down). Temp HP absorbs 5, remaining 2 damage applies to base HP: 25 - 2 = 23
      const res = await request(app)
        .post('/characters/briv/damage')
        .send({ amount: 15, damageType: 'slashing' });

      expect(res.status).toBe(200);
      expect(res.body.temporaryHitPoints).toBe(0);
      expect(res.body.currentHitPoints).toBe(23);
    });

    test('handles temporary HP damage overflow scenario from challenge description', async () => {
      // Briv HP goes from 25 -> 11 after 14 damage
      await request(app)
        .post('/characters/briv/damage')
        .send({ amount: 14, damageType: 'piercing' });

      // Grants 10 Temp HP (HP: 11, Temp: 10)
      await request(app)
        .post('/characters/briv/temp-hp')
        .send({ amount: 10 });

      // Deal 19 piercing: loses all 10 temp HP and 9 from base HP (11 - 9 = 2)
      const res = await request(app)
        .post('/characters/briv/damage')
        .send({ amount: 19, damageType: 'piercing' });

      expect(res.status).toBe(200);
      expect(res.body.temporaryHitPoints).toBe(0);
      expect(res.body.currentHitPoints).toBe(2);
    });

    test('rejects unsupported damage types (e.g., banana) with 400 Bad Request', async () => {
      const res = await request(app)
        .post('/characters/briv/damage')
        .send({ amount: 10, damageType: 'banana' });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("Invalid damage type 'banana'");
    });

    test('rejects missing or invalid damage amount with 400 Bad Request', async () => {
      const res = await request(app)
        .post('/characters/briv/damage')
        .send({ amount: -5, damageType: 'piercing' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    test('rejects missing damageType with 400 Bad Request', async () => {
      const res = await request(app)
        .post('/characters/briv/damage')
        .send({ amount: 10 });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /characters/:id/heal', () => {
    test('heals a damaged character', async () => {
      // First damage Briv
      await request(app)
        .post('/characters/briv/damage')
        .send({ amount: 14, damageType: 'piercing' });

      // Then heal 8 HP (11 + 8 = 19)
      const res = await request(app)
        .post('/characters/briv/heal')
        .send({ amount: 8 });

      expect(res.status).toBe(200);
      expect(res.body.currentHitPoints).toBe(19);
    });

    test('rejects invalid heal amounts with 400 Bad Request', async () => {
      const res = await request(app)
        .post('/characters/briv/heal')
        .send({ amount: -10 });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /characters/:id/temp-hp', () => {
    test('sets temporary hit points', async () => {
      const res = await request(app)
        .post('/characters/briv/temp-hp')
        .send({ amount: 10 });

      expect(res.status).toBe(200);
      expect(res.body.temporaryHitPoints).toBe(10);
    });

    test('rejects invalid temp HP values with 400 Bad Request', async () => {
      const res = await request(app)
        .post('/characters/briv/temp-hp')
        .send({ amount: -3 });

      expect(res.status).toBe(400);
    });
  });
});