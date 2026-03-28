import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Menu from '../../components/menu/menu';
import styles from './learning.module.css';

interface LessonListItem {
  id: number;
  title: string;
  description: string;
  topic: string;
  order_index: number;
  xp_reward: number;
  coin_reward: number;
}

type LearningUser = {
  fullname: string;
  age: number;
  parentName?: string;
};

const Learning = () => {
  const location = useLocation();

  const user: LearningUser = location.state?.user || {
    fullname: 'Μαρία Κ.',
    age: 14,
    parentName: 'Γιώργος Π.',
  };

  const [lessons, setLessons] = useState<LessonListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const ageGroup = useMemo(() => {
    // Απλός “κανόνας” για demo μέχρι να συνδεθεί πλήρως το auth/user profile.
    if (user.age <= 10) return 'junior';
    if (user.age <= 13) return 'intermediate';
    return 'senior';
  }, [user.age]);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        // Τα lessons έρχονται από το backend router: backend/app/routers/lessons.py
        // Χρησιμοποιούμε public endpoint για dev (χωρίς auth), μέσω Vite proxy.
        const response = await fetch(`/api/lessons/public?age_group=${ageGroup}`);
        if (!response.ok) throw new Error('Αποτυχία φόρτωσης');
        const data = (await response.json()) as LessonListItem[];
        setLessons(data);
      } catch {
        setLessons([
          {
            id: 1,
            title: 'Τι είναι ανάγκη και τι επιθυμία;',
            description: 'Μάθε να ξεχωρίζεις τις ανάγκες από τις επιθυμίες στις αγορές σου.',
            topic: 'needs-vs-wants',
            order_index: 1,
            xp_reward: 20,
            coin_reward: 10,
          },
          {
            id: 2,
            title: 'Βασικές έννοιες αποταμίευσης',
            description: 'Μικρά βήματα που σε βοηθούν να φτάσεις στους στόχους σου.',
            topic: 'saving-basics',
            order_index: 2,
            xp_reward: 20,
            coin_reward: 10,
          },
          {
            id: 3,
            title: 'Προϋπολογισμός χαρτζιλικιού',
            description: 'Πώς να οργανώνεις τα εβδομαδιαία σου έξοδα χωρίς να ξεφεύγεις.',
            topic: 'pocket-money-budget',
            order_index: 3,
            xp_reward: 20,
            coin_reward: 10,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [ageGroup]);

  const quizzes = useMemo(() => {
    // Για τώρα, παρουσιάζουμε 1 quiz ανά μάθημα.
    return lessons.map((lesson) => ({
      id: lesson.id,
      title: `Quiz: ${lesson.title}`,
      description: 'Απάντησε σε ερωτήσεις πολλαπλής επιλογής για να κερδίσεις XP.',
      xp_reward: Math.max(10, Math.round(lesson.xp_reward / 2)),
    }));
  }, [lessons]);

  return (
    <div className={styles.learningContainer}>
      <Menu user={user} />

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>Μάθηση</h1>
          <p>Επίλεξε μάθημα ή quiz και ξεκίνα!</p>
        </header>

        <section className={styles.columns} aria-label="Μαθήματα και Quizzes">
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Lessons 📚</h2>
              <span className={styles.counter}>{lessons.length}</span>
            </div>

            {loading ? (
              <p className={styles.loading}>Φόρτωση μαθημάτων...</p>
            ) : (
              <div className={styles.list}>
                {lessons.map((lesson) => (
                  <article key={lesson.id} className={styles.item}>
                    <div className={styles.itemTitleRow}>
                      <h3 className={styles.itemTitle}>{lesson.title}</h3>
                      <span className={styles.itemMeta}>+{lesson.xp_reward} XP</span>
                    </div>
                    <div className={styles.itemDesc}>{lesson.description}</div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Quizzes 🧠</h2>
              <span className={styles.counter}>{quizzes.length}</span>
            </div>

            {loading ? (
              <p className={styles.loading}>Φόρτωση quizzes...</p>
            ) : (
              <div className={styles.list}>
                {quizzes.map((quiz) => (
                  <article key={quiz.id} className={styles.item}>
                    <div className={styles.itemTitleRow}>
                      <h3 className={styles.itemTitle}>{quiz.title}</h3>
                      <span className={styles.itemMeta}>+{quiz.xp_reward} XP</span>
                    </div>
                    <div className={styles.itemDesc}>{quiz.description}</div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Learning;
