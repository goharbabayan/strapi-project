'use client'

import {useState, useEffect, useRef } from 'react';
import SearchIcon from '../icons/SearchIcon';
import InputField from '../inputField/InputField';
import IconClose from '../icons/CloseIcon';
import styles from './searchInput.module.css';

export default function SearchInput({searchQueries, setSearchQueries, setSearchResults, setNoResults}) {
  const [isFocused, setIsFocused] = useState(true);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQueries.trim() === '') {
      inputRef.current ? inputRef.current.querySelector('input').value = '' : null;
    };
  }, [searchQueries]);

  const handleSearchIconClick = () => {
    setIsFocused(!isFocused);
  };

  const handleRemoveIconClick = () => {
    inputRef.current ? inputRef.current.querySelector('input').value = '' : null;
    setIsFocused(false);
    setSearchQueries('');
    setNoResults(false);
  };

  const handleClickOutside = () => {
    setIsFocused(false);
  };

  const handleChange = (e) => {
    setSearchQueries(e.target.value);
    const searchValueIsEmpty = e.target.value.trim() === '';
    if (searchValueIsEmpty) {
      setNoResults(false);
    };
  };

  const debounce = (func) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, 500);
    };
  };

  const processChange = debounce((e) => handleChange(e));

  return (
    <div className={styles.container} ref={containerRef}>
      <SearchIcon
        className={styles.searchIcon}
        onClick={handleSearchIconClick}
      />
      <div ref={inputRef} className={styles.inputWrap}>
        <InputField
          inputClassName={styles.input}
          labelClassName={styles.label}
          isFocused={isFocused}
          onChange={processChange}
          placeholder={'Search escorts'}
        />
      </div>
      <IconClose
        className={styles.closeIcon}
        onClick={handleRemoveIconClick}
      />
    </div>
  )
}
