import { useState, useRef, useEffect } from 'react';
import styles from './categoryField.module.css';
import ArrowDown from '../icons/arrowDown/ArrowDown';
import DollarIcon from '../icons/DollarIcon';

export default function CategoryField ({
  category,
  name,
  options,
  setFilteredOptions,
  filteredOptions,
}) {
  const [showOptions, setShowOptions] = useState(false);
  const [hourlyRate, setHourlyRate] = useState({
    from: '',
    to: '',
  });
  const categoryRef = useRef(null);
  const arrowRef = useRef(null);
  const optionsRef = useRef(null);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClickOutside = (e) => {
    const isOutsideCategory = !(categoryRef.current && categoryRef.current.contains(e.target)) && !(optionsRef.current && optionsRef.current.contains(e.target));
    if (isOutsideCategory) {
      setShowOptions(false);
    };
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (categoryRef.current && categoryRef.current.contains(e.target) || arrowRef.current && arrowRef.current.contains(e.target)) {
      setShowOptions(!showOptions);
    };
  };

  const handleOnChange = (e, value, name) => {
    const isSelected = filteredOptions[name]?.length ? filteredOptions[name]?.includes(value) : false;
    const updatedOptions = isSelected ? filteredOptions[name].filter(filteredOption => filteredOption !== value) : [...filteredOptions[name], value];
    setFilteredOptions({ ...filteredOptions, [name]: updatedOptions })
  };

  const handleHourlyRateChange = (option, value) => {
    const updatedOptions = {
      ...hourlyRate,
      [option]: value
    }
    setHourlyRate(updatedOptions);
    setFilteredOptions({ ...filteredOptions, hourlyRate: updatedOptions })
  }

  const largerColumn = name === 'placeOfService' || name === 'hourlyRate' || name === 'extras';
  return (
    <div className={`${styles.category} ${largerColumn ? styles.largerColumn : ''}`}>
      <div className={`${styles.categoryName}`} ref={categoryRef} onClick={(e) => handleClick(e)} >
        <span className={styles.title}>{category}</span>
        <ArrowDown/>
      </div>
      {name === 'hourlyRate' ? (
        <div className={`${styles.categoryOptions} ${showOptions ? styles.show : ''}`} ref={optionsRef}>
          <label className={`${styles.lable} ${styles.nowrap}`}>
            From
            <input
              className={styles.input}
              type="number"
              name="from"
              value={hourlyRate.from}
              onChange={(e) => handleHourlyRateChange('from', e.target.value)}
              placeholder="$"
            />
          </label>
          <label className={`${styles.lable} ${styles.nowrap}`}>
            To
            <input
              className={styles.input}
              type="number"
              name="to"
              value={hourlyRate.to}
              onChange={(e) => handleHourlyRateChange('to', e.target.value)}
              placeholder="$"
            />
          </label>
        </div>
      ) : (
      options && options.length > 0 &&
        <div className={`${styles.categoryOptions} ${showOptions ? styles.show : ''}`}>
          <ul className={`${styles.options}`} ref={optionsRef}>
            {options.map((option, index) => (
              option?.label || option ?
              <li key={index} className={`${styles.option} text-small`} >
                <label className={styles.lable}>
                  <input
                    type="checkbox"
                    id={`option-${index}`}
                    name={option?.label || option}
                    onChange={(e) => handleOnChange(e, option?.value || option, name)}
                    checked={filteredOptions[name]?.includes(option?.value || option)}
                  />
                  {option?.label || option}
                </label>
              </li> : null
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
