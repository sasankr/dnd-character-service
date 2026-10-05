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

    test('rejects missing or invalid damage payload with 400 Bad Request', async () => {
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
