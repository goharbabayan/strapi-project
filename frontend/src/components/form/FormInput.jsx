import { useState } from 'react';
import styles from './form.module.css';

export default function FormInput({ id, type, name, placeholder, errorMessage, onChange, value }) {
  const [inputType, setInputType] = useState({
    id: '',
    showPassword: false
  });

  const handleShowHidePassword = (e) => {
    const closestInputId = e.currentTarget.dataset.id;

    setInputType({
      id: closestInputId,
      showPassword: !inputType.showPassword
    })
  }

  return (
    <div className={styles.inputWrap}>
      <label
        htmlFor={name}
        className={styles.label}>
          {name}
      </label>
      <input
        type={inputType.id === id && inputType.showPassword ? 'text' : type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`${styles.input} text-middle`}
        placeholder={placeholder}
        required
      />
      {type === 'password' ? <span className={`text-small ${styles.shoHidePassword}`} data-id={id} onClick={(e) => handleShowHidePassword(e)}>
        {inputType.id === id && inputType.showPassword ? "Hide password" : "Show password"}
        </span> : null}
      <span className={styles.errorMessage}>{errorMessage}</span>
    </div>
  );
}
