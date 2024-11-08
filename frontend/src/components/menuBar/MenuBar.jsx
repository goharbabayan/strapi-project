import { useState } from 'react';
import styles from './menuBar.module.css';

export default function MenuBar({items, onScrollToSection, isClientDashboard}) {
  const [activeItem, setActiveItem] = useState(0);

  const handleItemClick = (index, sectionRef) => {
    setActiveItem(index);
    onScrollToSection(sectionRef);
  };

  return (
    <section className={`${styles.menuBar} ${isClientDashboard ? styles.withbottomLine : ''}`}>
      <div className={`${styles.mainWrap} page-width`}>
        <ul className={`${styles.container}  ${isClientDashboard ? styles.clientDashboard : ''} menu-bar-container`}>
          {items && items.map((item, index) => (
            <li
              key={index}
              className={`${index === activeItem ? styles.active : ''}`}
              onClick={() => handleItemClick(index, item.sectionRef)}
            >
              <span className={styles.title}>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
