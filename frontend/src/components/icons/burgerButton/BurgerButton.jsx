'use client'

import { useState } from "react";
import styles from './burgerButon.module.css';

export default function BurgerButton ({className, isRotated, onBurgerButtonClick}) {
  return (
    <div
      className={`${styles.buttonContainer} ${className ? className : ''} ${isRotated ? styles.rotated : ''}`}
      onClick={onBurgerButtonClick}
    >
      <span className={`${styles.burgerButton} `}></span>
    </div>
  )
}
