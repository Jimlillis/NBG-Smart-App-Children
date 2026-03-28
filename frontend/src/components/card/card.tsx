import styles from './card.module.css';

type CardVariant = 'main' | 'savings';

interface CardProps {
	title: string;
	balance: number;
	variant?: CardVariant;
	compact?: boolean;
	className?: string;
}

const Card = ({ title, balance, variant = 'main', compact = false, className }: CardProps) => {
	const formattedBalance = new Intl.NumberFormat('el-GR', {
		style: 'currency',
		currency: 'EUR',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(balance);

	const variantClass = variant === 'savings' ? styles.savingsCard : styles.mainCard;
	const classes = [
		styles.card,
		variantClass,
		compact ? styles.compact : '',
		className || '',
	]
		.filter(Boolean)
		.join(' ');

	return (
		<section className={classes} aria-label={title}>
			<div className={styles.header}>
				<span className={styles.title}>{title}</span>
			</div>

			<div className={styles.balance}>{formattedBalance}</div>
		</section>
	);
};

export default Card;
