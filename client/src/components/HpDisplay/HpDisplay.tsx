import React from 'react';
import styles from './HpDisplay.module.css';

interface HpDisplayProps {
  currentHp: number;
  maxHp: number;
  tempHp: number;
}

export const HpDisplay: React.FC<HpDisplayProps> = ({ currentHp, maxHp, tempHp }) => {
  const hpPercentage = Math.min(100, Math.max(0, (currentHp / maxHp) * 100));

  let barColorClass = styles.healthy;
  if (hpPercentage <= 25) {
    barColorClass = styles.critical;
  } else if (hpPercentage <= 50) {
    barColorClass = styles.injured;
  }

  return (
    <section className={styles.container} aria-label="Hit Point Status">
      <div className={styles.statsRow}>
        <div className={styles.hpMain}>
          <span className={styles.label}>Hit Points</span>
          <div className={styles.values}>
            <span className={styles.current}>{currentHp}</span>
            <span className={styles.divider}>/</span>
            <span className={styles.max}>{maxHp}</span>
          </div>
        </div>

        <div className={styles.tempHpBox}>
          <span className={styles.tempLabel}>Temporary HP</span>
          <span className={styles.tempValue} aria-live="polite">
            +{tempHp}
          </span>
        </div>
      </div>

      <div
        className={styles.progressBarBg}
        role="progressbar"
        aria-valuenow={currentHp}
        aria-valuemin={0}
        aria-valuemax={maxHp}
        aria-label="Current Hit Points Progress"
      >
        <div
          className={`${styles.progressBarFill} ${barColorClass}`}
          style={{ width: `${hpPercentage}%` }}
        />
      </div>
    </section>
  );
};
