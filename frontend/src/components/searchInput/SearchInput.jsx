'use client'

import {useState, useEffect, useRef } from 'react';
import SearchIcon from '../icons/SearchIcon';
import InputField from '../inputField/InputField';
import CloseIcon from '../icons/CloseIcon';
import styles from './searchInput.module.css';

export default function SearchInput({searchQueries, setSearchQueries, setSearchResults, setNoResults}) {
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchQueries.trim() === '') {
      inputRef.current ? inputRef.current.querySelector('input').value = '' : null;
    };
  }, [searchQueries]);

  const handleRemoveIconClick = () => {
    inputRef.current ? inputRef.current.querySelector('input').value = '' : null;
    setSearchQueries('');
    setNoResults(false);
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
      />
      <div ref={inputRef} className={styles.inputWrap}>
        <InputField
          inputClassName={styles.input}
          labelClassName={styles.label}
          onChange={processChange}
          placeholder={'Search escorts'}
        />
      </div>
      <CloseIcon
        className={styles.closeIcon}
        onClick={handleRemoveIconClick}
      />
    </div>
  )
}
