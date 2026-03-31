import { useCallback, useState } from 'react';
import styles from '../card/card.module.css';

interface JuniorCardProps {
  holderName: string;
  last4?: string;
  expiry?: string;
}

const JuniorCard = ({ holderName, last4 = '4829', expiry = '09/28' }: JuniorCardProps) => {
  const displayName = holderName.toLocaleUpperCase('el-GR');
  const [flipped, setFlipped] = useState(false);

  const toggleFlip = useCallback(() => {
    setFlipped((v) => !v);
  }, []);

  const handleKeyDown: React.KeyboardEventHandler<HTMLElement> = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleFlip();
    }
  };

  return (
    <section
      className={`${styles.card} ${styles.juniorCard} ${styles.flipCard}`}
      aria-label="PocketWise Junior Card"
      role="button"
      tabIndex={0}
      onClick={toggleFlip}
      onKeyDown={handleKeyDown}
      aria-pressed={flipped}
      title="Πάτησε για να γυρίσει"
    >
      <div className={`${styles.flipInner} ${flipped ? styles.flipped : ''}`}>
        <div className={`${styles.flipFace} ${styles.flipFront}`}>
          <div className={styles.juniorHeader}>
            <div className={styles.juniorBrand}>
              <div className={styles.juniorBrandName}>PocketWise</div>
              <div className={styles.juniorBrandSub}>Junior Card</div>
            </div>

            <div className={styles.contactless} aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8.2 16.3C6.7 14.8 6.7 9.2 8.2 7.7"
                  stroke="rgba(255,255,255,0.9)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M11.2 18.2C9 16 9 8 11.2 5.8"
                  stroke="rgba(255,255,255,0.9)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M14.2 20.2C11.2 17.2 11.2 6.8 14.2 3.8"
                  stroke="rgba(255,255,255,0.9)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <div className={styles.juniorNumberRow} aria-label="Αριθμός κάρτας">
            <span className={styles.juniorDots}>•••• •••• ••••</span>
            <span className={styles.juniorLast4}>{last4}</span>
          </div>

          <div className={styles.juniorFooter}>
            <div className={styles.juniorMeta}>
              <div className={styles.juniorLabel}>ΚΑΤΟΧΟΣ</div>
              <div className={styles.juniorValue}>{displayName}</div>
            </div>

            <div className={styles.juniorMeta}>
              <div className={styles.juniorLabel}>ΛΗΞΗ</div>
              <div className={styles.juniorValue}>{expiry}</div>
            </div>

            <div className={styles.mastercard} aria-hidden="true">
              <span className={styles.mcCircle1} />
              <span className={styles.mcCircle2} />
            </div>
          </div>
        </div>

        <div className={`${styles.flipFace} ${styles.flipBack}`} aria-label="Πίσω πλευρά κάρτας">
          <div className={styles.backStripe} aria-hidden="true" />

          <div className={styles.signatureRow}>
            <div className={styles.signatureBox} aria-label="Υπογραφή">
              <div className={styles.signatureLabel}>AUTHORIZED SIGNATURE</div>
              <div className={styles.signatureLine} aria-hidden="true" />
            </div>

            <div className={styles.cvvBox} aria-label="CVV">
              <div className={styles.cvvLabel}>CVV</div>
              <div className={styles.cvvValue}>123</div>
            </div>
          </div>

          <div className={styles.backInfo}>
            <div className={styles.backInfoItem}>
              <div className={styles.juniorLabel}>CARD ID</div>
              <div className={styles.juniorValue}>PW-{last4}-2026</div>
            </div>

            <div className={styles.backInfoItem}>
              <div className={styles.juniorLabel}>DAILY LIMIT</div>
              <div className={styles.juniorValue}>€20,00</div>
            </div>

            <div className={styles.backInfoItem}>
              <div className={styles.juniorLabel}>STATUS</div>
              <div className={styles.juniorValue}>ACTIVE</div>
            </div>
          </div>

          <div className={styles.backFooter}>
            <div className={styles.backSmallText}>
              Mock card • for demo use only
            </div>
            <div className={styles.mastercard} aria-hidden="true">
              <span className={styles.mcCircle1} />
              <span className={styles.mcCircle2} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JuniorCard;
