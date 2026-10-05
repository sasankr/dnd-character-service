import React, { useState } from 'react';
import styles from './CombatControls.module.css';
import { DamageType } from '../../types/character';

interface CombatControlsProps {
  onDealDamage: (amount: number, damageType: DamageType) => Promise<void>;
  onHeal: (amount: number) => Promise<void>;
  onSetTempHp: (amount: number) => Promise<void>;
  isLoading: boolean;
}

const DAMAGE_TYPES: DamageType[] = [
  'bludgeoning',
  'piercing',
  'slashing',
  'fire',
  'cold',
  'acid',
  'thunder',
  'lightning',
  'poison',
  'radiant',
  'necrotic',
  'psychic',
  'force'
];

export const CombatControls: React.FC<CombatControlsProps> = ({
  onDealDamage,
  onHeal,
  onSetTempHp,
  isLoading
}) => {
  const [damageAmount, setDamageAmount] = useState<string>('');
  const [selectedDamageType, setSelectedDamageType] = useState<DamageType>('piercing');

  const [healAmount, setHealAmount] = useState<string>('');
  const [tempHpAmount, setTempHpAmount] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDamageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(damageAmount, 10);
    if (isNaN(val) || val <= 0) {
      setErrorMsg('Please enter a valid positive damage amount');
      return;
    }
    setErrorMsg(null);
    try {
      await onDealDamage(val, selectedDamageType);
      setDamageAmount('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to deal damage');
    }
  };

  const handleHealSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(healAmount, 10);
    if (isNaN(val) || val <= 0) {
      setErrorMsg('Please enter a valid positive healing amount');
      return;
    }
    setErrorMsg(null);
    try {
      await onHeal(val);
      setHealAmount('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to heal');
    }
  };

  const handleTempHpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(tempHpAmount, 10);
    if (isNaN(val) || val < 0) {
      setErrorMsg('Please enter a valid non-negative temporary HP amount');
      return;
    }
    setErrorMsg(null);
    try {
      await onSetTempHp(val);
      setTempHpAmount('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to set temporary HP');
    }
  };

  return (
    <section className={styles.container} aria-label="Combat Actions">
      <h2 className={styles.heading}>Combat Actions</h2>

      {errorMsg && (
        <div className={styles.errorBanner} role="alert">
          {errorMsg}
        </div>
      )}

      <div className={styles.actionsGrid}>
        {/* Deal Damage Form */}
        <form className={styles.actionCard} onSubmit={handleDamageSubmit}>
          <label htmlFor="damage-amount" className={styles.actionLabel}>
            Deal Damage
          </label>
          <div className={styles.inputGroup}>
            <input
              id="damage-amount"
              type="number"
              min="1"
              placeholder="Amount"
              value={damageAmount}
              onChange={(e) => setDamageAmount(e.target.value)}
              className={styles.input}
              disabled={isLoading}
              required
              aria-label="Damage Amount"
            />
            <select
              id="damage-type"
              value={selectedDamageType}
              onChange={(e) => setSelectedDamageType(e.target.value as DamageType)}
              className={styles.select}
              disabled={isLoading}
              aria-label="Damage Type"
            >
              {DAMAGE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className={`${styles.button} ${styles.btnDamage}`}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Deal Damage'}
          </button>
        </form>

        {/* Heal Form */}
        <form className={styles.actionCard} onSubmit={handleHealSubmit}>
          <label htmlFor="heal-amount" className={styles.actionLabel}>
            Heal Character
          </label>
          <div className={styles.inputGroup}>
            <input
              id="heal-amount"
              type="number"
              min="1"
              placeholder="Amount"
              value={healAmount}
              onChange={(e) => setHealAmount(e.target.value)}
              className={styles.input}
              disabled={isLoading}
              required
              aria-label="Heal Amount"
            />
          </div>
          <button
            type="submit"
            className={`${styles.button} ${styles.btnHeal}`}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Heal'}
          </button>
        </form>

        {/* Temporary HP Form */}
        <form className={styles.actionCard} onSubmit={handleTempHpSubmit}>
          <label htmlFor="temphp-amount" className={styles.actionLabel}>
            Add Temporary HP
          </label>
          <div className={styles.inputGroup}>
            <input
              id="temphp-amount"
              type="number"
              min="0"
              placeholder="Amount"
              value={tempHpAmount}
              onChange={(e) => setTempHpAmount(e.target.value)}
              className={styles.input}
              disabled={isLoading}
              required
              aria-label="Temporary HP Amount"
            />
          </div>
          <button
            type="submit"
            className={`${styles.button} ${styles.btnTempHp}`}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Set Temporary HP'}
          </button>
        </form>
      </div>
    </section>
  );
};
