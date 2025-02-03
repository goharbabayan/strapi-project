import styles from './selectOption.module.css';

export default function SelectOption({id, name, label, options, onChange}) {
  return (
    <div>
      <label htmlFor={id} className={styles.label}>{label}</label>
      <select name={name} id={id} className={styles.select} onChange={onChange}>
        {options && Array.isArray(options) && options.length > 0 &&
          options.map((option, index) => (
            <option
              value={option}
              key={index}
            >
              {option.capitalize()}
            </option>
          ))
        }
      </select>
    </div>
  )
}
