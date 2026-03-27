import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Menu from '../../components/menu/menu';
import styles from './savings.module.css';

type Category = 'general' | 'gaming' | 'food' | 'shopping';

interface ChildUser {
	id: string;
	fullname: string;
	email?: string;
	age: number;
	parentName?: string;
	savings_balance?: number;
}

interface CreateGoalResponse {
	status: 'success';
	goal: {
		id: string;
		child_id: string;
		item_name: string;
		category: string;
		target_amount: number;
		current_saved: number;
		ai_suggestion?: string | null;
		inserted_at?: string;
	};
	suggestion: string;
}

const Savings = () => {
	const location = useLocation();

	const user: ChildUser = location.state?.user || {
		id: 'child-uuid-1234',
		fullname: 'Μαρία Κ.',
		age: 14,
		parentName: 'Γιώργος Π.',
		savings_balance: 0,
	};

	const apiBaseUrl = useMemo(() => {
		return import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';
	}, []);

	const [formData, setFormData] = useState({
		child_id: user.id,
		item_name: '',
		target_amount: '',
		category: 'general' as Category,
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [suggestion, setSuggestion] = useState<string | null>(null);
	const [createdGoal, setCreatedGoal] = useState<CreateGoalResponse['goal'] | null>(null);

	const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError(null);
		setSuggestion(null);
		setCreatedGoal(null);

		const targetAmountNumber = Number(formData.target_amount);
		if (!Number.isFinite(targetAmountNumber) || targetAmountNumber <= 0) {
			setError('Βάλε ένα έγκυρο ποσό στόχου (> 0).');
			return;
		}

		setIsSubmitting(true);
		try {
			const response = await fetch(`${apiBaseUrl}/create-goal`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					child_id: formData.child_id,
					item_name: formData.item_name,
					target_amount: targetAmountNumber,
					category: formData.category,
				}),
			});

			const data = await response.json().catch(() => null);
			if (!response.ok) {
				const detail = data?.detail || 'Το αίτημα απέτυχε.';
				throw new Error(typeof detail === 'string' ? detail : 'Το αίτημα απέτυχε.');
			}

			const parsed = data as CreateGoalResponse;
			setSuggestion(parsed.suggestion);
			setCreatedGoal(parsed.goal);

			setFormData((prev) => ({
				...prev,
				item_name: '',
				target_amount: '',
			}));
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Κάτι πήγε στραβά.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className={styles.savingsContainer}>
			<Menu user={user} />

			<main className={styles.mainContent}>
				<header className={styles.header}>
					<h1>Αποταμίευση</h1>
					<p>Φτιάξε έναν νέο στόχο και πάρε AI συμβουλή.</p>
				</header>

				<div className={styles.grid}>
					<section className={styles.formCard}>
						<h3>Νέος Στόχος Αποταμίευσης</h3>
						<p className={styles.subtitle}>
							Tip: το <strong>child_id</strong> πρέπει να υπάρχει στη βάση (δοκίμασε το backend endpoint <code>/debug/children</code>).
						</p>

						<form onSubmit={handleSubmit} className={styles.form}>
							<div className={styles.formGroup}>
								<label>Child ID</label>
								<input
									name="child_id"
									value={formData.child_id}
									onChange={handleChange}
									placeholder="UUID παιδιού"
									required
								/>
							</div>

							<div className={styles.formGroup}>
								<label>Τι θέλεις να αγοράσεις;</label>
								<input
									name="item_name"
									value={formData.item_name}
									onChange={handleChange}
									placeholder="π.χ. PS5"
									required
								/>
							</div>

							<div className={styles.formGroup}>
								<label>Στόχος (€)</label>
								<input
									type="number"
									name="target_amount"
									min="1"
									step="0.5"
									value={formData.target_amount}
									onChange={handleChange}
									placeholder="π.χ. 500"
									required
								/>
							</div>

							<div className={styles.formGroup}>
								<label>Κατηγορία</label>
								<select name="category" value={formData.category} onChange={handleChange}>
									<option value="general">Γενικά</option>
									<option value="gaming">Gaming</option>
									<option value="food">Φαγητό</option>
									<option value="shopping">Ψώνια</option>
								</select>
							</div>

							{error && <div className={styles.errorBox}>{error}</div>}

							<button className={styles.submitBtn} type="submit" disabled={isSubmitting}>
								{isSubmitting ? 'Δημιουργία...' : 'Δημιούργησε Στόχο & Πάρε AI Συμβουλή'}
							</button>

							<Link className={styles.backLink} to="/dashboard">
								← Πίσω στο Dashboard
							</Link>
						</form>
					</section>

					<section className={styles.resultCard}>
						<h3>AI Απάντηση</h3>

						{!suggestion && (
							<p className={styles.muted}>
								Μόλις δημιουργήσεις στόχο, εδώ θα εμφανιστεί η πρόταση του AI.
							</p>
						)}

						{suggestion && (
							<div className={styles.suggestionBox}>
								<p className={styles.suggestionText}>{suggestion}</p>
							</div>
						)}

						{createdGoal && (
							<div className={styles.goalPreview}>
								<div className={styles.previewRow}>
									<span className={styles.previewLabel}>Στόχος:</span>
									<span className={styles.previewValue}>{createdGoal.item_name}</span>
								</div>
								<div className={styles.previewRow}>
									<span className={styles.previewLabel}>Ποσό:</span>
									<span className={styles.previewValue}>€{Number(createdGoal.target_amount).toFixed(0)}</span>
								</div>
								<div className={styles.previewRow}>
									<span className={styles.previewLabel}>Κατηγορία:</span>
									<span className={styles.previewValue}>{createdGoal.category}</span>
								</div>
							</div>
						)}
					</section>
				</div>
			</main>
		</div>
	);
};

export default Savings;

