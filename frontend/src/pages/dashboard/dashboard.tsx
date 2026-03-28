import { useLocation } from 'react-router-dom';
import Menu from '../../components/menu/menu';
import Card from '../../components/card/card';
import PointsCard from '../../components/pointsCard/pointsCard';
import Goals from '../../components/goals/goals';  
import Transactions from '../../components/transactions/transactions';
import styles from './dashboard.module.css';


type DashboardUser = {
  fullname: string;
  age: number;
  parentName?: string;
  available_balance?: number;
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
    total_points: 320,
  };

  const availableBalance = typeof user.available_balance === 'number' ? user.available_balance : 250;
  const totalPoints = typeof user.total_points === 'number' ? user.total_points : 320;

  return (
    <div className={styles.dashboardContainer}>
      <Menu user={user} />
      
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerText}>
            <h1>Πίνακας Ελέγχου</h1>
            <p>Γεια σου, {user.fullname}! 👋</p>
          </div>

          <div className={styles.pointsCardWrap}>
            <PointsCard totalPoints={totalPoints} />
          </div>
        </header>

        <div className={styles.balanceCardRow}>
          <Card title="Διαθέσιμο Υπόλοιπο" balance={availableBalance} className={styles.balanceCard} />
        </div>

        <div className={styles.topWidgets}>
          <Goals />
          <Transactions />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;