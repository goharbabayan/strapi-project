import styles from './radioButton.module.css';

export default function RadioButton({props}) {
  const {
    label,
    id,
    name,
    value,
    type,
    onSelectType,
  } = props;

  return (
    <div className={styles.buttonWrapper}>
      <input 
        type="radio" 
        className={styles.radio}
        id={id} 
        name={name}
        value={value} 
        checked={type === value} 
        onChange={onSelectType} 
      />
      <label htmlFor={id} className={`${styles.label}`}>{label}</label>
    </div>
  )
}
