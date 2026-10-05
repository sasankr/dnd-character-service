# D&D Character Hit Point Management Service

A full-stack TypeScript application for managing player character Hit Points (HP) according to the D&D 5e hit point rules required by the challenge. Built for the D&D Beyond Take-Home Challenge.

---

## Table of Contents
- [Overview](#overview)
- [Architecture & Design](#architecture--design)
- [D&D 5e Rules Implementation](#dd-5e-rules-implementation)
- [API Documentation](#api-documentation)
- [Frontend Dashboard](#frontend-dashboard)
- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)

---

## Overview

This application provides a RESTful API and responsive web interface for managing character health throughout combat encounters. It tracks:
- Current Hit Points (`currentHitPoints`)
- Maximum Hit Points (`maxHitPoints`)
- Temporary Hit Points (`temporaryHitPoints`)
- Character Defenses (Immunities & Resistances across all 13 D&D damage types)
- Stats & Ability Score modifiers

Character data is seeded from JSON files located in the `data/` directory (e.g., `briv.json`) and persists in memory during the application lifetime.

---

## Architecture & Design

The project is structured with clean separation of concerns:

- **Domain Layer (`src/services/hpService.ts`)**: Pure calculation engine responsible for applying damage mitigations, healing ceilings, and temporary HP replacement rules. Independent of HTTP/Express logic for 100% testability.
- **Persistence Layer (`src/services/characterRepository.ts`)**: In-memory repository loaded from disk at server startup. Automatically parses character fixtures, strips UTF-8 BOM encoding for Windows compatibility, and maps character states.
- **Presentation / API Layer (`src/controllers/`, `src/routes/`)**: Express controllers with strict request validation (rejecting negative numbers, empty strings, missing fields with `400 Bad Request`).
- **Frontend Client (`client/`)**: Modern React 18 + TypeScript client built with Vite and CSS Modules, fully accessible and responsive.

---

## D&D 5e Rules Implementation

1. **Damage Mitigation**:
   - **Immunity**: Character takes `0` damage if immune to the incoming damage type.
   - **Resistance**: Damage is halved and rounded down (`Math.floor(damage / 2)`).
   - **Neutral**: Damage is applied unmitigated.
2. **Temporary Hit Points (Temp HP)**:
   - Temp HP absorbs incoming damage before the primary HP pool is affected.
   - Damage exceeding Temp HP overflows into the regular HP pool.
   - Temp HP is non-additive: when gaining new Temp HP, the character retains whichever amount is higher.
   - Temp HP is never restored by healing spells/actions.
3. **Healing**:
   - Increases `currentHitPoints` up to the character's `maxHitPoints`.
   - Never exceeds `maxHitPoints`.
4. **Hit Point Floor**:
   - Current Hit Points cannot drop below `0`.

---

## API Documentation

Base URL: `http://localhost:3000`

### 1. Get Character
`GET /characters/:id`

**Response (`200 OK`):**
```json
{
  "id": "briv",
  "name": "Briv",
  "level": 5,
  "hitPoints": 25,
  "maxHitPoints": 25,
  "currentHitPoints": 25,
  "temporaryHitPoints": 0,
  "classes": [
    { "name": "fighter", "hitDiceValue": 10, "classLevel": 5 }
  ],
  "stats": {
    "strength": 15,
    "dexterity": 12,
    "constitution": 14,
    "intelligence": 13,
    "wisdom": 10,
    "charisma": 8
  },
  "defenses": [
    { "type": "fire", "defense": "immunity" },
    { "type": "slashing", "defense": "resistance" }
  ]
}
```

---

### 2. Deal Damage
`POST /characters/:id/damage`

**Request Body:**
```json
{
  "amount": 14,
  "damageType": "piercing"
}
```

**Response (`200 OK`):**
```json
{
  "id": "briv",
  "name": "Briv",
  "currentHitPoints": 11,
  "maxHitPoints": 25,
  "temporaryHitPoints": 0
}
```

---

### 3. Heal Character
`POST /characters/:id/heal`

**Request Body:**
```json
{
  "amount": 8
}
```

**Response (`200 OK`):**
```json
{
  "id": "briv",
  "name": "Briv",
  "currentHitPoints": 19,
  "maxHitPoints": 25,
  "temporaryHitPoints": 0
}
```

---

### 4. Set Temporary Hit Points
`POST /characters/:id/temp-hp`

**Request Body:**
```json
{
  "amount": 10
}
```

**Response (`200 OK`):**
```json
{
  "id": "briv",
  "name": "Briv",
  "currentHitPoints": 19,
  "maxHitPoints": 25,
  "temporaryHitPoints": 10
}
```

---

## Frontend Dashboard

The frontend application (`client/`) provides an interactive interface for dungeon masters and players:

- **Character Card**: Name, class, level, and defense badges (Immunities & Resistances).
- **Interactive HP Tracker**: Visual health bar that dynamically shifts color (Green → Yellow → Red) as health drops, plus a dedicated temporary HP badge.
- **Ability Scores**: Displays STR, DEX, CON, INT, WIS, CHA with calculated modifiers (e.g., `+2`, `-1`).
- **Combat Controls**:
  - Deal Damage (amount input + damage type dropdown + action button)
  - Heal (amount input + action button)
  - Set Temporary HP (amount input + action button)
- **Accessibility & Responsiveness**:
  - Full keyboard navigability with visible focus indicators.
  - Screen reader friendly with semantic HTML (`header`, `main`, `section`), ARIA progress bar (`aria-valuenow`), and `aria-live` regions.
  - Mobile-responsive grid that collapses from 3 columns to 1 column on smaller viewports.

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation
Clone the repository and install dependencies for both the root backend and client:

```bash
# Clone the repository
git clone https://github.com/sasankr/dnd-character-service.git
cd dnd-character-service

# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install && cd ..
```

### Running the Application

#### Option A: Run Full-Stack (Backend + Frontend concurrently)
```bash
npm run dev:all
```
- Backend API: `http://localhost:3000`
- Frontend UI: `http://localhost:5173`

#### Option B: Run Services Individually
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
npm run dev:client
```

---

## Running Tests

The test suite includes 22 automated tests covering core domain math, damage types, resistances, immunities, temp HP edge cases, and API integration.

```bash
# Run test suite
npm test

# Run tests in watch mode
npm run test:watch
```

---

## Project Structure

```text
dnd-character-service/
├── client/                     # React + TypeScript Frontend
│   ├── src/
│   │   ├── components/         # Modular CSS Module components
│   │   │   ├── CharacterHeader/
│   │   │   ├── CombatControls/
│   │   │   ├── HpDisplay/
│   │   │   └── StatBlock/
│   │   ├── services/           # Frontend API client
│   │   ├── types/              # Frontend TypeScript models
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── vite.config.ts
├── data/                       # Character seed fixtures
│   └── briv.json
├── src/                        # Backend REST API
│   ├── controllers/            # Request handlers & validation
│   ├── routes/                 # Express route definitions
│   ├── services/               # HpService & CharacterRepository
│   ├── types/                  # Domain interfaces & damage types
│   ├── app.ts                  # Express application setup
│   └── index.ts                # Server entry point
├── tests/                      # Automated test suite
│   ├── api.test.ts             # Supertest API integration tests
│   └── hpService.test.ts       # Domain logic unit tests
├── jest.config.js
├── package.json
└── tsconfig.json
```