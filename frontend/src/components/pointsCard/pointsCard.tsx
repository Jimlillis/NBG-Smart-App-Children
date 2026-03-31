import styles from '../card/card.module.css';

interface PointsCardProps {
  totalPoints: number;
}

const PointsCard = ({ totalPoints }: PointsCardProps) => {
  return (
    <section
      className={`${styles.card} ${styles.pointsCard} ${styles.pointsSmall} ${styles.pointsFunky}`}
      aria-label="Πόντοι"
    >
      <div className={styles.header}>
        <span className={styles.title}>Πόντοι</span>
        <span className={styles.emojiIcon} aria-hidden="true">
          🏆
        </span>
      </div>

      <div className={styles.balance}>{totalPoints}</div>

      <div className={styles.pointsNote}>
        <div className={styles.statBadge}>
          Στόχος: 500 πόντοι → δωρεάν κουπόνι από Everest
        </div>
      </div>
    </section>
  );
};

export default PointsCard;
