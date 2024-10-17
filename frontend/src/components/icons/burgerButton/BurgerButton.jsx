'use client'

import { useState } from "react";
import styles from './burgerButon.module.css';

export default function BurgerButton ({className, onBurgerButtonClick}) {
  const [isRotated, setIsRotated] = useState(false);
  const handleBurgerButtonClick = () => {
    setIsRotated(!isRotated);
    onBurgerButtonClick(!isRotated);
  };

  return (
    <div
      className={`${styles.buttonContainer} ${className ? className : ''} ${isRotated ? styles.rotated : ''}`}
      onClick={() => handleBurgerButtonClick(isRotated)}
    >
      <span className={`${styles.burgerButton} `}></span>
    </div>
  )
}
