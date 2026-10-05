import React from 'react';
import styles from './CharacterHeader.module.css';
import { CharacterClass, Defense } from '../../types/character';

interface CharacterHeaderProps {
  name: string;
  level: number;
  classes: CharacterClass[];
  defenses: Defense[];
}

export const CharacterHeader: React.FC<CharacterHeaderProps> = ({
  name,
  level,
  classes,
  defenses
}) => {
  const classSummary = classes
    .map((c) => `${c.name.charAt(0).toUpperCase() + c.name.slice(1)} ${c.classLevel}`)
    .join(', ');

  return (
    <header className={styles.header}>
      <div className={styles.profile}>
        <div className={styles.avatar} aria-hidden="true">
          {name.charAt(0)}
        </div>
        <div>
          <h1 className={styles.name}>{name}</h1>
          <p className={styles.subtitle}>
            Level {level} &bull; {classSummary}
          </p>
        </div>
      </div>

      <div className={styles.defenses} aria-label="Character Defenses">
        {defenses.map((d, idx) => (
          <span
            key={idx}
            className={
              d.defense === 'immunity' ? styles.badgeImmunity : styles.badgeResistance
            }
          >
            {d.defense.toUpperCase()}: {d.type}
          </span>
        ))}
      </div>
    </header>
  );
};
