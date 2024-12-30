import { useState, useEffect, useRef } from 'react';
import styles from './selectOptions.module.css';
import Text from '../text/Text';

export default function SelectOptions({
  id,
  isRequired,
  label,
  name,
  className,
  value,
  disabled,
  onChange,
  options,
  error,
  showError,
}) {
  const [showOptions, setShowOptions] = useState(false);
  const selectRef = useRef(null);
  const arrowRef = useRef(null);
  const suburbRef = useRef(null);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClickOutside = (e) => {
    const isOutsideSelectTag = !(e.target.matches(`.${styles.wrapper}`) && e.target.matches('.arrow')) && !(selectRef.current && selectRef.current.contains(e.target) || arrowRef.current && arrowRef.current.contains(e.target));
    if (isOutsideSelectTag) {
      setShowOptions(false);
    };
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (selectRef.current && selectRef.current.contains(e.target) || arrowRef.current && arrowRef.current.contains(e.target)) {
      setShowOptions(!showOptions);
    };
  };

  const handleMouseDown = (e) => {
    e.stopPropagation();
    const target = e.target;
    const { name, value } = target.children[0];
    const needToBeNumberValue = name === 'dressSize' || name === 'phoneNumber';
    const fieldValue = needToBeNumberValue ? Number(value) : value;
    onChange(name, fieldValue);
  };

  return (
    <div className={styles.wrapper}>
      <label htmlFor={id} className={`${styles.label}`} onMouseDown={(e) => handleClick(e)}>
        <Text
          tag={'span'}
          className={styles.text}
          children={`${label || ''} ${isRequired ? '*' : ''}`}
        />
        <select
          name={name}
          id={id}
          className={`${styles.selectClassName} ${className ? className : ''} ${error && showError ? styles.invalid : ''}`}
          value={value}
          disabled={disabled}
          onChange={onChange}
          ref={selectRef}
        >
          {[{ label: `select ${label}`.toLowerCase(), value: '' }, ...options].map((option, index) => (
            <option key={index} value={option.value}>{option.label ? option.label : option.value}</option>
          ))}
        </select>
        <span className={styles.arrow} ref={arrowRef}></span>
      </label>
      <ul className={`${styles.options} ${showOptions ? styles.show : ''}`}>
        {options.map((option, index) => (
          <li key={index} value={option.value} name={name} className={`${styles.option} text-small`} ref={suburbRef} onMouseDown={(e) => handleMouseDown(e)}>
            <input type="text" name={name} value={option.value} readOnly={true} hidden/>
            {option.label ? option.label : option.value}
          </li>
        ))}
      </ul>
      {error && showError &&
        <Text
          tag={'span'}
          className={`${styles.errorText}`}
          children={error}
        />
      }
    </div>
  )
}
