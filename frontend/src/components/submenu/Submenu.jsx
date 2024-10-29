import Menu from '../menu/Menu';
import styles from './submenu.module.css';

export default function Submenu({
  className,
  nextLevelMenu,
  level,
  isMobileLayout,
  isOpen,
  menuItemsHasAtLeastOneItem,
  isOneOfTheMobileMenuItemsOpened,
  openedFirstLevelMobileItemId,
  setOpenedFirstLevelMobileItemId,
  setIsOneOfTheMobileMenuItemsOpened,
  listItemsAreOpened
}) {
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
          openedFirstLevelMobileItemId={openedFirstLevelMobileItemId}
          setOpenedFirstLevelMobileItemId={setOpenedFirstLevelMobileItemId}
          isOneOfTheMobileMenuItemsOpened={isOneOfTheMobileMenuItemsOpened}
          setIsOneOfTheMobileMenuItemsOpened={setIsOneOfTheMobileMenuItemsOpened}
          listItemsAreOpened={listItemsAreOpened}
        />
      </div>
    </section>
  )
}
