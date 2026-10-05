import React from 'react';
import styles from './StatBlock.module.css';
import { CharacterStats } from '../../types/character';

interface StatBlockProps {
  stats: CharacterStats;
}

const STAT_CONFIG = [
  { key: 'strength', label: 'STR' },
  { key: 'dexterity', label: 'DEX' },
  { key: 'constitution', label: 'CON' },
  { key: 'intelligence', label: 'INT' },
  { key: 'wisdom', label: 'WIS' },
  { key: 'charisma', label: 'CHA' }
] as const;

export const StatBlock: React.FC<StatBlockProps> = ({ stats }) => {
  const getModifier = (score: number): string => {
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  return (
    <section className={styles.container} aria-label="Character Ability Scores">
      <h2 className={styles.heading}>Ability Scores</h2>
      <div className={styles.grid}>
        {STAT_CONFIG.map(({ key, label }) => {
          const score = stats[key as keyof CharacterStats];
          const modifier = getModifier(score);

          return (
            <div key={key} className={styles.statCard}>
              <span className={styles.statLabel}>{label}</span>
              <span className={styles.score}>{score}</span>
              <span className={styles.modifier} aria-label={`${label} modifier ${modifier}`}>
                {modifier}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
