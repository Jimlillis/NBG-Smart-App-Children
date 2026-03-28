import Card from '../card/card';

interface SavingsBalanceProps {
  balance: number;
}

const SavingsBalance = ({ balance }: SavingsBalanceProps) => {
  return <Card title="Αποταμιεύσεις" balance={balance} variant="savings" />;
};

export default SavingsBalance;
