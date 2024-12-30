import { useState, useRef } from 'react';
import Text from '../text/Text';
import styles from './formInput.module.css';
import InfoIcon from '../icons/Info';
import InfoMessage from '../infoMessage/infoMessage';

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
  disabled,
  showInfoIcon,
}) {
  const infoMessageRef = useRef(null);
  const [showInfoMessage, setShowInfoMessage] = useState(false);
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

  const handleInfoIconClick = (e) => {
    const isMobileLayout = window.innerWidth < 980;
    isMobileLayout && infoMessageRef?.current && setShowInfoMessage(!showInfoMessage);
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
          validate && validate(e.target.value);
          updateData(e.target.name, e.target.value);
        }}
        placeholder={placeholder}
        type={inputType.id === id && inputType.showPassword ? 'text' : type}
        disabled={disabled}
      />
      {type === 'password' &&
        <Text
          tag={'span'}
          className={styles.showPasswordButton}
          onClick={(e) => handleShowHidePassword(e, id)}
          children={inputType.id === id && inputType.showPassword ? "Hide password" : "Show password"}
        />
      }
      {showInfoIcon &&
        <>
          <InfoIcon
            className={styles.infoIcon}
            onClick={handleInfoIconClick}
          />
          <InfoMessage
            className={`${styles.infoMessageWrapper} ${showInfoMessage ? styles.show : ''}`}
            text={`To change your email, please contact with our team 'contact@test.com'`}
            ref={infoMessageRef}
          />
        </>
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
