import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './cityField.module.css';
import Text from '../text/Text';

export default function CityField ({
  label,
  type,
  name,
  value,
  isRequired,
  cities,
  onMouseDown,
  errorMessage }) {

  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState(cities);
  const [searchTerm, setSearchTerm] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const prevSearchTermRef = useRef('');
  const inputRef = useRef(null);
  const arrowRef = useRef(null);
  const suburbRef=useRef(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    handleFiltering(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleClickOutside = useCallback((e) => {
    const isOutsideSelectTag = !(inputRef.current && inputRef.current.contains(e.target) || arrowRef.current && arrowRef.current.contains(e.target));
    if (isOutsideSelectTag) {
      setShowOptions(false);
    };
  }, []);

  const handleClick = useCallback((e) => {
    e.preventDefault();
    if (inputRef.current && inputRef.current.contains(e.target)) {
      setShowOptions(true);
    } else if (arrowRef.current && arrowRef.current.contains(e.target)) {
      setShowOptions(!showOptions);
    }
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    const newSearchTerm = e.target.value.toLowerCase();
    setInputValue(e.target.value)
    setSearchTerm(newSearchTerm);
     if (newSearchTerm !== prevSearchTermRef.current) {
      handleFiltering(newSearchTerm);
    }
    prevSearchTermRef.current = newSearchTerm;
  };

  const handleFiltering = (searchTerm) => {
    if (searchTerm != null) {
      const filteredOptions = cities.filter((option) => {
        const optionValue = option.value.toLowerCase();
        return optionValue.startsWith(searchTerm.toLowerCase());
      })
      setOptions(filteredOptions);
    }
  };

  const handleSelectCity = (e) => {
    e.preventDefault();
    const target = e.target;
    const { name, value } = target.children[0];
    setInputValue(value);
    onMouseDown(name, value);
  };

  //ToDo: should change all select options to read from one component
  return (
    <div className={styles.container}>
      <div>
        <label className='label'>{`${label || ''} ${isRequired ? '*' : ''}`}</label>
        <input
          type='text'
          name='suburbs'
          id='suburbInput'
          ref={inputRef}
          value={inputValue}
          onClick={handleClick}
          onChange={handleChange}
          className={`${styles.cityInput} input ${errorMessage && errorMessage?.city ? styles.invalid : ''}`}
        />
        <span className={styles.arrow} ref={arrowRef} onClick={handleClick}></span>
      </div>
      {options.length > 0 &&
        <ul id='optionsList' className={`${styles.options} ${showOptions ? styles.show : ''} unstyled-list options`}>
          {options.map((option, index) => (
            <li key={index} value={option.value} name={name} className={`${styles.option} text-small`} ref={suburbRef} onMouseDown={(e) => handleSelectCity(e)}>
              <input type={type} name={name} value={option.value} data-code={option.code} readOnly={true} hidden/>
              {option.label ? option.label : option.value}
            </li>
          ))}
        </ul>
      }
      {errorMessage && errorMessage?.city &&
        <Text
          tag={'span'}
          className={`${styles.errorText} text-extrasmall errorText`}
          children={errorMessage && errorMessage?.city}
        />
      }
    </div>
  )
}
