import { useState } from 'react';
import styles from './arrowDown.module.css';
import { useEffect } from 'react';

export default function ArrowDown({color, isOpen}) {
  return (
    <svg className={`${styles.arrow} ${isOpen ? styles.rotatedUp : ''}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M17 9L12 14L7 9" stroke={`${color || "#262626"}`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
