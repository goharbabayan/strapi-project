import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './favourites.module.css';
import Text from '../text/Text';

export default function Favourites ({
  label,
  type,
  name,
  id,
  value,
  isRequired,
  disabled,
  fieldClassName,
  inputClassName,
  optionsList,
  userOptions,
  labelClassName,
  selectClassName,
  onMouseDown,
  isStateChanged,
  errorMessage,
  ...other }) {

  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState(optionsList);
  const [selectedOptions, setSelectedOptions] = useState(userOptions);
  const [searchTerm, setSearchTerm] = useState('');
  const prevSearchTermRef = useRef('');
  const inputRef = useRef(null);
  const arrowRef = useRef(null);
  const suburbRef=useRef(null);
  const listItemsRefs = useRef([]);

  useEffect(() => {
    setSelectedOptions(userOptions);
  }, [userOptions]);

  useEffect(() => {
    const optionsWithoutSelectedOptions = optionsList.filter((option) => !selectedOptions.some((selectedOption) => selectedOption.item === option.value));
    setOptions(optionsWithoutSelectedOptions);
  }, [optionsList]);

  useEffect(() => {
    handleFiltering(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const updatedOptionsList = options.filter((option) => !selectedOptions.some((selectedOption) => selectedOption.item === option.label));
    setOptions(updatedOptionsList);
    setSearchTerm('');
  }, [selectedOptions])

  const handleRemoveSuburbItem = (index) => {
    const clickedElementName = listItemsRefs.current[index].dataset.name;
    const updatedSelectedOptions = selectedOptions.filter(selectedOption => selectedOption.item !== clickedElementName);
    setOptions([...options, {value: clickedElementName, label: clickedElementName}]);
    setSelectedOptions(updatedSelectedOptions);
    onMouseDown(name, updatedSelectedOptions);
  }

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
    setSearchTerm(newSearchTerm);
     if (newSearchTerm !== prevSearchTermRef.current) {
      handleFiltering(newSearchTerm);
    }
    prevSearchTermRef.current = newSearchTerm;
  }

  const handleFiltering = (searchTerm) => {
    const optionsWithoutSelectedOnes = optionsList.filter((option) => !selectedOptions.some((selectedOption) => selectedOption.item === option.label));
    const filteredOptions = optionsWithoutSelectedOnes.filter((option) => {
      const optionValue = option.value && option.value.toLowerCase();
      return optionValue && optionValue.startsWith(searchTerm.toLowerCase());
    })
    setOptions(filteredOptions);
  };

  const handleSelectOption = (e) => {
    e.stopPropagation();
    const target = e.target;
    inputRef.current.value = '';
    const { name, value } = target.children[0];
    let updatedOptions;
    if (selectedOptions.length) {
      updatedOptions = [...selectedOptions, {item: value}];
    } else {
      updatedOptions = [{item: value}];
    }
    
    setSelectedOptions(updatedOptions);
    onMouseDown(name, updatedOptions);
  };

  return (
    <div className={styles.container}>
      <div>
        <label className={`${styles.subtitle} subtitle`}>{label}</label>
        <div className={styles.optionInputWrapper}>
          {selectedOptions.length > 0 &&
            <ul className={`${styles.selectedSuburbs} unstyled-list`}>
              {selectedOptions.map((option, index) => (
                <li key={index} className={`${styles.optionItem}`}>
                  <span
                    className={`${styles.item} text-small`}
                    ref={(element) => element ? listItemsRefs.current[index] = element : null}
                    data-name={`${option.item}`}
                  >
                    {option.item}
                  </span>
                  <span aria-hidden="true" className={styles.closeIcon} onClick={() => handleRemoveSuburbItem(index)}>x</span>
                </li>
              ))}
            </ul>
          }
          <input
            type='text'
            name='options'
            id='optionInput'
            ref={inputRef}
            onClick={handleClick}
            onChange={handleChange}
            className={`${styles.optionInput} input`}
          />
          <span className={styles.arrow} ref={arrowRef} onClick={handleClick}></span>
        </div>
      </div>
      {options.length > 0 &&
        <ul id="optionsList" className={`${styles.options} ${showOptions ? styles.show : ''} unstyled-list options`}>
          {options.map((option, index) => (
            <div key={index}>
              {option.groupLabel &&
                <span className={`${styles.groupLabel} ${styles.bold} text-small`}>{option.groupLabel}</span>
              }
              {option.value && option.label &&
                <li key={index} value={option.value} name={name} className={`${styles.option} text-small`} ref={suburbRef} onMouseDown={(e) => handleSelectOption(e)}>
                  <input type={type} name={name} value={option.label} readOnly={true} hidden/>
                {option.label ? option.label : option.value}
                </li>
              }
            </div>
          ))}
        </ul>
      }
      {errorMessage &&
        <Text
          tag={'span'}
          className={`${styles.errorText} text-extrasmall errorText`}
          children={errorMessage}
        />
      }
    </div>
  )
}
