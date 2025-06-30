import styles from './LoadingSpinner.module.css';

type LoadingSpinnerProps = {
  message?: string;
};

export const LoadingSpinner = ({ message = 'Loading...' }: LoadingSpinnerProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} data-testid="loading-spinner"></div>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};