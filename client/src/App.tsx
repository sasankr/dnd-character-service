import React, { useEffect, useState, useCallback } from 'react';
import styles from './App.module.css';
import { CharacterState, DamageType } from './types/character';
import { CharacterApi } from './services/characterApi';
import { CharacterHeader } from './components/CharacterHeader/CharacterHeader';
import { HpDisplay } from './components/HpDisplay/HpDisplay';
import { StatBlock } from './components/StatBlock/StatBlock';
import { CombatControls } from './components/CombatControls/CombatControls';

export const App: React.FC = () => {
  const [character, setCharacter] = useState<CharacterState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadCharacter = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await CharacterApi.getCharacter('briv');
      setCharacter(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load character');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCharacter();
  }, [loadCharacter]);

  const handleDealDamage = async (amount: number, damageType: DamageType) => {
    if (!character) return;
    setIsLoading(true);
    try {
      const updated = await CharacterApi.dealDamage(character.id, amount, damageType);
      setCharacter(updated);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHeal = async (amount: number) => {
    if (!character) return;
    setIsLoading(true);
    try {
      const updated = await CharacterApi.heal(character.id, amount);
      setCharacter(updated);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetTempHp = async (amount: number) => {
    if (!character) return;
    setIsLoading(true);
    try {
      const updated = await CharacterApi.setTempHp(character.id, amount);
      setCharacter(updated);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.appContainer}>
      <div className={styles.wrapper}>
        {isLoading && !character && (
          <div className={styles.loadingState} role="status">
            Loading Character...
          </div>
        )}

        {error && (
          <div className={styles.errorBanner} role="alert">
            <p>{error}</p>
            <button onClick={loadCharacter} className={styles.retryBtn}>
              Retry
            </button>
          </div>
        )}

        {character && (
          <div className={styles.dashboard}>
            <CharacterHeader
              name={character.name}
              level={character.level}
              classes={character.classes}
              defenses={character.defenses}
            />

            <HpDisplay
              currentHp={character.currentHitPoints}
              maxHp={character.maxHitPoints}
              tempHp={character.temporaryHitPoints}
            />

            <StatBlock stats={character.stats} />

            <CombatControls
              onDealDamage={handleDealDamage}
              onHeal={handleHeal}
              onSetTempHp={handleSetTempHp}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default App;
