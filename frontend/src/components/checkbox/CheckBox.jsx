import styles from './checkbox.module.css';

export default function Checkbox ({props}) {
  const {
    containerClassName,
    contentClassName,
    value,
    isChecked,
    onChange
  } = props;

  const handleChange = (event) => {
    // Pass the current state of the checkbox to the parent
    onChange(event.target.value, event.target.checked);
  };

  return (
    <div className={`${containerClassName ? containerClassName : styles.container}`}>
      <input
        type="checkbox"
        className={styles.checkbox}
        id={value}
        value={value}
        checked={isChecked}
        onChange={handleChange}
      />
      <label htmlFor={value} className={`${contentClassName ? contentClassName : styles.customCheckbox}`}></label>
    </div>
    
  )
}
