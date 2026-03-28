import { useLocation } from 'react-router-dom';
import Menu from '../../components/menu/menu';
import Card from '../../components/card/card';
import Goals from '../../components/goals/goals';  
import Transactions from '../../components/transactions/transactions';
import styles from './dashboard.module.css';


type DashboardUser = {
  fullname: string;
  age: number;
  parentName?: string;
  available_balance?: number;
};


const Dashboard = () => {
  const location = useLocation();
  
  // Πιάνουμε τα δεδομένα του χρήστη, αλλιώς βάζουμε κάποια default για να μη σκάσει
  const user: DashboardUser = location.state?.user || {
    fullname: 'Μαρία Κ.',
    age: 14,
    parentName: 'Γιώργος Π.',
    available_balance: 250,
  };

  const availableBalance = typeof user.available_balance === 'number' ? user.available_balance : 250;

  return (
    <div className={styles.dashboardContainer}>
      <Menu user={user} />
      
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>Πίνακας Ελέγχου</h1>
          <p>Γεια σου, {user.fullname}! 👋</p>
        </header>

        <div className={styles.balanceCardRow}>
          <Card title="Διαθέσιμο Υπόλοιπο" balance={availableBalance} compact />
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