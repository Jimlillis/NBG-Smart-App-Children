import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Menu from '../../components/menu/menu';
import Card from '../../components/card/card';
import PointsCard from '../../components/pointsCard/pointsCard';
import SavingsBalance from '../../components/savingsBalance/savingsBalance';
import DailyChallenges from '../../components/dailyChallenges/dailyChallenges';
import Goals from '../../components/goals/goals';  
import Transactions from '../../components/transactions/transactions';
import styles from './dashboard.module.css';


type DashboardUser = {
  fullname: string;
  age: number;
  parentName?: string;
  available_balance?: number;
  savings_balance?: number;
  total_points?: number;
};


const Dashboard = () => {
  const location = useLocation();
  
  // Πιάνουμε τα δεδομένα του χρήστη, αλλιώς βάζουμε κάποια default για να μη σκάσει
  const user: DashboardUser = location.state?.user || {
    fullname: 'Μαρία Κ.',
    age: 14,
    parentName: 'Γιώργος Π.',
    available_balance: 250,
    savings_balance: 90,
    total_points: 320,
  };

  const availableBalance = typeof user.available_balance === 'number' ? user.available_balance : 250;
  const savingsBalance = typeof user.savings_balance === 'number' ? user.savings_balance : 90;
  const basePoints = typeof user.total_points === 'number' ? user.total_points : 320;

  const [challengePointsEarned, setChallengePointsEarned] = useState(0);
  const totalPoints = useMemo(() => basePoints + challengePointsEarned, [basePoints, challengePointsEarned]);

  return (
    <div className={styles.dashboardContainer}>
      <Menu user={user} />
      
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerText}>
            <h1>Πίνακας Ελέγχου</h1>
            <p>Γεια σου, {user.fullname}! 👋</p>
          </div>
        </header>

        <section className={styles.topCards} aria-label="Σύνοψη">
          <Card title="Διαθέσιμο Υπόλοιπο" balance={availableBalance} />
          <SavingsBalance balance={savingsBalance} />
          <PointsCard totalPoints={totalPoints} />
        </section>

        <section className={styles.bottomWidgets} aria-label="Επισκόπηση">
          <Goals />
          <Transactions />
          <DailyChallenges onCompleted={(earnedPoints) => setChallengePointsEarned(earnedPoints)} />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;