import styles from './card.module.css';

type CardVariant = 'main' | 'savings';

interface CardProps {
	title: string;
	balance: number;
	secondaryTitle?: string;
	secondaryBalance?: number;
	chips?: {
		incomeLabel: string;
		incomeAmount: number;
		expenseLabel: string;
		expenseAmount: number;
	};
	showEye?: boolean;
	variant?: CardVariant;
	compact?: boolean;
	className?: string;
}

const Card = ({
	title,
	balance,
	secondaryTitle,
	secondaryBalance,
	chips,
	showEye = false,
	variant = 'main',
	compact = false,
	className,
}: CardProps) => {
	const formattedBalance = new Intl.NumberFormat('el-GR', {
		style: 'currency',
		currency: 'EUR',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(balance);

	const formattedSecondaryBalance =
		typeof secondaryBalance === 'number'
			? new Intl.NumberFormat('el-GR', {
					style: 'currency',
					currency: 'EUR',
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				}).format(secondaryBalance)
			: undefined;

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
				{showEye ? (
					<span className={styles.eyeIcon} aria-hidden="true" title="Εμφάνιση/Απόκρυψη">
						👁
					</span>
				) : null}
			</div>

			<div className={styles.balance}>{formattedBalance}</div>

			{secondaryTitle && formattedSecondaryBalance ? (
				<div className={styles.secondaryRow} aria-label={secondaryTitle}>
					<span className={styles.secondaryLabel}>{secondaryTitle}</span>
					<span className={styles.secondaryAmount}>{formattedSecondaryBalance}</span>
				</div>
			) : null}

			{chips ? (
				<div className={styles.statsRow}>
					<div className={styles.statBadge} aria-label={chips.incomeLabel}>
						<span className={styles.statIcon} aria-hidden="true">
							↗
						</span>
						+
						{new Intl.NumberFormat('el-GR', {
							style: 'currency',
							currency: 'EUR',
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						}).format(Math.abs(chips.incomeAmount))}{' '}
						{chips.incomeLabel}
					</div>
					<div className={styles.statBadge} aria-label={chips.expenseLabel}>
						<span className={styles.statIcon} aria-hidden="true">
							↘
						</span>
						-
						{new Intl.NumberFormat('el-GR', {
							style: 'currency',
							currency: 'EUR',
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						}).format(Math.abs(chips.expenseAmount))}{' '}
						{chips.expenseLabel}
					</div>
				</div>
			) : null}
		</section>
	);
};

export default Card;
