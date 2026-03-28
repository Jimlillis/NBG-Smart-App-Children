import { useMemo, useState } from 'react';
import styles from './dailyChallenges.module.css';

type ChallengeQuestion = {
  id: string;
  question: string;
  options: string[];
};

interface DailyChallengesProps {
  pointsPerQuestion?: number;
  onCompleted: (earnedPoints: number) => void;
}

const DailyChallenges = ({ pointsPerQuestion = 30, onCompleted }: DailyChallengesProps) => {
  const questions: ChallengeQuestion[] = useMemo(
    () => [
      {
        id: 'q1',
        question: 'Ποια είναι η διαφορά ανάμεσα σε μια ανάγκη και μια επιθυμία;',
        options: [
          'Ανάγκη είναι κάτι απαραίτητο (π.χ. φαγητό), επιθυμία είναι κάτι “έξτρα”',
          'Η επιθυμία είναι πάντα πιο φθηνή από την ανάγκη',
          'Δεν υπάρχει διαφορά',
        ],
      },
      {
        id: 'q2',
        question: 'Τι σημαίνει αποταμιεύω;',
        options: [
          'Κρατάω ένα μέρος των χρημάτων μου για το μέλλον',
          'Ξοδεύω όλα τα χρήματα μου άμεσα',
          'Δανείζομαι χρήματα από φίλους',
        ],
      },
      {
        id: 'q3',
        question: 'Ποια κίνηση βοηθάει περισσότερο να πετύχεις έναν στόχο;',
        options: [
          'Βάζω μικρά ποσά συχνά',
          'Περιμένω να μου περισσέψει κάτι τυχαία',
          'Σταματάω να παρακολουθώ τα έξοδα μου',
        ],
      },
    ],
    [],
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [completed, setCompleted] = useState(false);

  const current = questions[currentIndex];
  const total = questions.length;
  const totalEarned = answeredCount * pointsPerQuestion;

  const handleSubmit = () => {
    if (!selected || completed) return;

    const nextAnsweredCount = answeredCount + 1;

    if (currentIndex === total - 1) {
      setAnsweredCount(nextAnsweredCount);
      setCompleted(true);
      onCompleted(nextAnsweredCount * pointsPerQuestion);
      return;
    }

    setAnsweredCount(nextAnsweredCount);
    setCurrentIndex((i) => i + 1);
    setSelected(null);
  };

  return (
    <section className={styles.card} aria-label="Καθημερινές Προκλήσεις">
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>Καθημερινές Προκλήσεις</h3>
        </div>
        <div className={styles.badge}>+{pointsPerQuestion} πόντοι</div>
      </div>

      {completed ? (
        <div className={styles.completed}>
          <p className={styles.completedTitle}>Ολοκληρώθηκε! ✅</p>
          <p className={styles.completedText}>Προστέθηκαν συνολικά +{totalEarned} πόντοι.</p>
        </div>
      ) : (
        <>
          <p className={styles.question}>{current.question}</p>

          <div className={styles.options} role="radiogroup" aria-label="Επιλογές">
            {current.options.map((opt) => (
              <label key={opt} className={styles.option}>
                <input
                  type="radio"
                  name={current.id}
                  value={opt}
                  checked={selected === opt}
                  onChange={() => setSelected(opt)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>

          <div className={styles.footer}>
            <div className={styles.progress}>
              Ερώτηση {currentIndex + 1}/{total} • Κερδισμένοι πόντοι: {totalEarned}
            </div>
            <button className={styles.button} onClick={handleSubmit} disabled={!selected}>
              Απάντησε
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default DailyChallenges;
