import styles from '../card/card.module.css';

interface PointsCardProps {
  totalPoints: number;
}

const PointsCard = ({ totalPoints }: PointsCardProps) => {
  return (
    <section className={`${styles.card} ${styles.pointsCard}`} aria-label="Πόντοι">
      <div className={styles.header}>
        <span className={styles.title}>Πόντοι</span>
        <span className={styles.emojiIcon} aria-hidden="true">
          🏆
        </span>
      </div>

      <div className={styles.balance}>{totalPoints}</div>

      <div style={{ marginTop: '10px' }}>
        <div className={styles.statsRow}>
          <div className={styles.statBadge}>
            <span>Στόχος: 500 πόντοι → €2,50 έκπτωση από Pizza Fun</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PointsCard;
