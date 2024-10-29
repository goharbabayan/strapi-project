import Menu from '../menu/Menu';
import styles from './submenu.module.css';

export default function Submenu({className, nextLevelMenu, level, isMobileLayout, isOpen, menuItemsHasAtLeastOneItem}) {
  return (
    <section
      className={`${level === 2 ? styles.level_one : styles.level_two} ${className ? className : ''} ${!menuItemsHasAtLeastOneItem ? styles.withoutLocationItems : ''}`}
    >
      <div className={`${level === 2 ? `${styles.level_one_container}` : `${styles.level_two_container}`} ${!isMobileLayout && level === 2 ? 'page-width' : ''}`}>
        <Menu
          menu={nextLevelMenu}
          level={level}
          className={`${styles.childWrapper} ${isOpen ? styles.show: ''}`}
          isMobileLayout={isMobileLayout}
          menuItemsHasAtLeastOneItem={menuItemsHasAtLeastOneItem}
        />
      </div>
    </section>
  )
}
