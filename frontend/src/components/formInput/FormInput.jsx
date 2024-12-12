import { useState } from 'react';
import Text from '../text/Text';
import styles from './formInput.module.css';

export default function FormInput({
  error,
  id,
  placeholder,
  name,
  label,
  value,
  type,
  isRequired,
  updateData,
  validate,
  showError,
}) {
  const [inputType, setInputType] = useState({
    id: '',
    showPassword: false
  });

  const handleShowHidePassword = (e, id) => {
    setInputType({
      id: id,
      showPassword: !inputType.showPassword
    });
  };

  return (
    <div className={styles.inputWrapper}>
      <label
        className={styles.label}
      >
        <Text
          tag={'span'}
          className={styles.labelText}
          children={`${label} ${isRequired ? '*' : ''}`}
        />
      </label>
      <input
        name={name}
        value={value}
        className={`${styles.input} ${error && showError ? styles.invalid : ''}`}
        onChange={(e) => {
          validate(e.target.value);
          updateData(e.target.name, e.target.value);
        }}
        placeholder={placeholder}
        type={inputType.id === id && inputType.showPassword ? 'text' : type}
      />
      {type === 'password' &&
        <Text
          tag={'span'}
          className={styles.showPasswordButton}
          onClick={(e) => handleShowHidePassword(e, id)}
          children={inputType.id === id && inputType.showPassword ? "Hide password" : "Show password"}
        />
      }
      {error && showError &&
        <Text
          tag={'span'}
          className={`${styles.error} ${type === 'password' ? styles.password : ''}`}
          children={error}
        />
      }
    </div>
  )
}
