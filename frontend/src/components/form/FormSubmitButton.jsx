import styles from './form.module.css';

export default function FormSubmitButton({ buttonText }) {
  return (
    <>
      <button type="submit" className={styles.submitButton}>{buttonText || 'Submit'}</button>
    </>
  );
}
