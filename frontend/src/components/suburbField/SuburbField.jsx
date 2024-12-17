import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './suburbField.module.css';
import Text from '../text/Text';

export default function SuburbField ({
  label,
  type,
  name,
  id,
  value,
  onChange,
  isRequired,
  disabled,
  fieldClassName,
  inputClassName,
  suburbs,
  userSuburbs,
  selectedCity,
  labelClassName,
  selectClassName,
  onMouseDown,
  isCityDataChanged,
  errorMessage,
  ...other }) {

  const [showOptions, setShowOptions] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const [options, setOptions] = useState([]);
  const [selectedSuburbs, setSelectedSuburbs] = useState(userSuburbs);
  const [searchTerm, setSearchTerm] = useState(null);
  const prevSearchTermRef = useRef('');
  const inputRef = useRef(null);
  const arrowRef = useRef(null);
  const suburbRef=useRef(null);
  const listItemsRefs = useRef([]);

  useEffect(() => {
    const optionsList = filterSuburbsWithoutSelectedOnes();
    optionsList.length === 0 && selectedSuburbs.length === 0 ? setShowContent(false) : setShowContent(true);
    selectedCity && setOptions(optionsList);
  }, [suburbs]);

  useEffect(() => {
    if (isCityDataChanged) {
      setSelectedSuburbs([]);
      onMouseDown('suburbs', [], false);
    }
  }, [userSuburbs]);

  useEffect(() => {
    handleFiltering(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const optionsList = filterSuburbsWithoutSelectedOnes();
    setOptions(optionsList);
    isCityDataChanged && optionsList.length === 0 && selectedSuburbs.length === 0 ? setShowContent(false) : setShowContent(true);
    if (selectedSuburbs.length > 0) {
      setSearchTerm('');
    }
  }, [selectedSuburbs])

  const filterSuburbsWithoutSelectedOnes = () => suburbs.filter((suburb) => !selectedSuburbs.some((selectedSuburb) => selectedSuburb.name === suburb.value));

  const handleRemoveSuburbItem = (index) => {
    const clickedElementName = listItemsRefs.current[index].dataset.name;
    const updatedSelectedSuburbs = selectedSuburbs.filter(suburb => suburb.name !== clickedElementName);
    setOptions([...options, {value: clickedElementName, label: clickedElementName}]);
    setSelectedSuburbs(updatedSelectedSuburbs);
    onMouseDown('suburbs', updatedSelectedSuburbs);
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
    if (searchTerm != null) {
      const optionsWithoutSelectedSuburbs = filterSuburbsWithoutSelectedOnes();
      const filteredOptions = optionsWithoutSelectedSuburbs.filter((option) => {
        const optionValue = option.value.toLowerCase();
        return optionValue.startsWith(searchTerm.toLowerCase());
      })
      setOptions(filteredOptions);
    }
  };

  const handleSelectSuburb = (e) => {
    e.preventDefault();
    inputRef.current.value = '';
    const { name, value } = e.target.children[0];
    let updatedSuburbs;
    if (selectedSuburbs.length) {
      updatedSuburbs = [...selectedSuburbs, {name: value, state: ''}];
    } else {
      updatedSuburbs = [{name: value, state: ''}];
    }
    setSelectedSuburbs(updatedSuburbs);
    onMouseDown(name, updatedSuburbs);
  }


// ToDo: For select options change the component to be one for all select options
  return (
    <>
      {showContent &&
        <div className={styles.container}>
          <div>
            <label className='label'>{label}</label>
            <div className={styles.suburbInputWrapper}>
              {selectedSuburbs.length > 0 &&
                <ul className={`${styles.selectedSuburbs} unstyled-list`}>
                  {selectedSuburbs.map((suburb, index) => (
                    <li key={index} className={`${styles.suburbItem}`}>
                      <span
                        className={`${styles.item} text-small`}
                        ref={(element) => element ? listItemsRefs.current[index] = element : null}
                        data-name={`${suburb.name}`}
                      >
                        {suburb.name}
                      </span>
                      <span aria-hidden="true" className={styles.closeIcon} onClick={() => handleRemoveSuburbItem(index)}>x</span>
                    </li>
                  ))}
                </ul>
              }
              <input
                type='text'
                name='suburbs'
                id='suburbInput'
                ref={inputRef}
                onClick={handleClick}
                onKeyDown={(e) => e.key === 'Enter' ? e.preventDefault() : null}
                onChange={handleChange}
                className={`${styles.suburbInput} input`}
              />
              <span className={styles.arrow} ref={arrowRef} onClick={handleClick}></span>
            </div>
          </div>
          {options.length > 0 &&
            <ul id="optionsList" className={`${styles.options} ${showOptions ? styles.show : ''} unstyled-list options`}>
              {options.map((option, index) => (
                <li key={index} value={option.value} name={name} className={`${styles.option} text-small`} ref={suburbRef} onMouseDown={(e) => handleSelectSuburb(e)}>
                  <input type={type} name={name} value={option.value} data-code={option.code} readOnly={true} hidden/>
                  {option.label ? option.label : option.value}
                </li>
              ))}
            </ul>
          }
          {errorMessage && errorMessage?.suburbs &&
            <Text
              tag={'span'}
              className={`${styles.errorText} text-extrasmall errorText`}
              children={errorMessage && errorMessage?.suburbs}
            />
          }
      </div>}
    </>
  )
}
