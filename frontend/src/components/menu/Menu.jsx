import React, { useState, useEffect, useRef } from 'react';
import styles from './menu.module.css';
import ArrowDown from '../icons/arrowDown/ArrowDown';
import Text from '../text/Text';
import Submenu from '../submenu/Submenu';

export default function Menu({
  menu,
  level,
  isMobileLayout,
  menuItemsHasAtLeastOneItem,
  openedFirstLevelMobileItemId,
  setOpenedFirstLevelMobileItemId,
  isOneOfTheMobileMenuItemsOpened,
  setIsOneOfTheMobileMenuItemsOpened,
  listItemsAreOpened
}) {

  const [openLevels, setOpenLevels] = useState({});
  const [expandedSubmenuLevel, setExpandedSubmenuLevel] = useState(null);
  const [hasNextLevel, setHasNextLevel] = useState(false);
  // const [hoveredFirstLevelMenuItemId, setHoveredFirstLevelMenuItemId] = useState(null);
  // const [hoveredSecondLevelMenuItemId, setHoveredSecondLevelMenuItemId] = useState(null);

  const handleMouseOver = (id, level, hasNextLevel) => {
    setHasNextLevel(hasNextLevel);
    if (level === 1) {
      // setHoveredFirstLevelMenuItemId(id);
      setExpandedSubmenuLevel(id);
    } else if (level === 2) {
      // setHoveredSecondLevelMenuItemId(id);
      setExpandedSubmenuLevel(id);
    }
  };

  const handleMouseOut = (id, level) => {
    setHasNextLevel(false);
    if (level === 1) {
      setExpandedSubmenuLevel(null);
    }
  };

  const toggleMenu = (id, hasNextLevel, level) => {
    if (isMobileLayout && level === 1) {
      setOpenedFirstLevelMobileItemId(id);
      id === openedFirstLevelMobileItemId
        ? setIsOneOfTheMobileMenuItemsOpened(!isOneOfTheMobileMenuItemsOpened)
        : setIsOneOfTheMobileMenuItemsOpened(true);
    } else if (isMobileLayout && level === 2) {
      setIsOneOfTheMobileMenuItemsOpened(true);
    };

    setOpenLevels((prevState) => {
      if (level === 1) {
        const isCurrentlyOpen = prevState[id];
        if (isCurrentlyOpen) {
          return {};
        } else {
          return { [id]: true };
        }
      } else {
        return {
          ...prevState,
          [id]: hasNextLevel ? !prevState[id] : prevState[id],
        };
      }
    });
  };

  useEffect(() => {
    if (listItemsAreOpened) {
      setOpenedFirstLevelMobileItemId(null);
      setOpenLevels({});
    }
  }, [listItemsAreOpened]);

  const hasChild = menu && Array.isArray(menu) && menu.length > 0;
  const nextLevel = `level_${level + 1}`;
  return (
    <>
      {hasChild && (
        <ul className={`${level === 1 ? styles.list : level === 2 ? styles.childList : styles.grandchildList} ${level === 1 && menu.length === 3 ? styles.threeItems : ''} ${level === 1 && menu.length > 3 ? styles.moreThanThreeItems : ''} ${level === 1 && hasNextLevel ? 'navigation_is_hovered' : ''}`}>
          {menu.map((menuItem, index) => {
            const id = `level-${level}-${index+1}`
            const isOpen = openLevels[id];
            // const isHoveredLevelOneItem = level === 1 && id === hoveredFirstLevelMenuItemId;
            // const isHoveredLevelTwoItem = level === 2 && id === hoveredSecondLevelMenuItemId;
            const hasNextLevel = menuItem[nextLevel] && menuItem[nextLevel].length > 0;
            return (
              <li
                key={id}
                className={`${level === 1 ? styles.item : styles.childItem} ${hasNextLevel ? styles.hasSubmenu : ''}`}
                onMouseOver={() => handleMouseOver(id, level, hasNextLevel)}
                onMouseOut={() => handleMouseOut(id, level)}
              >
                <div
                  className={`${styles.menuItem} ${level === 2 ? styles.child : level === 3 ? styles.grandChild : ''}`}
                  onClick={(e) => toggleMenu(id, hasNextLevel, level)}
                  data-id={id}
                >
                  {hasNextLevel || menuItem.link === null ?
                    <Text
                      tag={'span'}
                      className={`${styles.title} ${hasNextLevel ? styles.hasNextLevel : ''}`}
                      children={menuItem.title}
                    />
                    :
                    <Text
                      tag={'a'}
                      href={menuItem.link || ''}
                      className={`${styles.title} ${styles.link}`}
                      children={menuItem.title}
                    />
                  }
                  {hasNextLevel && isMobileLayout &&
                    <ArrowDown
                      isOpen={isOpen}
                      dataId={id}
                    />
                  }
                </div>
                {hasNextLevel && !isMobileLayout &&
                  <ArrowDown
                    isOpen={isOpen}
                    color={level === 2 ? '#FFF' : null}
                    dataId={id}
                  />
                }
                {isMobileLayout ?
                  isOpen && hasNextLevel && (
                    <div className={`${styles.submenuWrapper}`}>
                      <Submenu
                        className={`${level === 1 ? styles.submenu : styles.subsubmenu}`}
                        nextLevelMenu={menuItem[nextLevel]}
                        level={level + 1}
                        isMobileLayout={isMobileLayout}
                        isOneOfTheMobileMenuItemsOpened={isOneOfTheMobileMenuItemsOpened}
                        setIsOneOfTheMobileMenuItemsOpened={setIsOneOfTheMobileMenuItemsOpened}
                        listItemsAreOpened={listItemsAreOpened}
                        openedFirstLevelMobileItemId={openedFirstLevelMobileItemId}
                        setOpenedFirstLevelMobileItemId={setOpenedFirstLevelMobileItemId}
                      />
                    </div>
                  ) :
                  hasNextLevel && expandedSubmenuLevel && (
                    <Submenu
                      className={`${level === 1 ? styles.submenu : styles.subsubmenu} ${expandedSubmenuLevel === id ? styles.show : ''}`}
                      nextLevelMenu={menuItem[nextLevel]}
                      level={level + 1}
                      isMobileLayout={isMobileLayout}
                      menuItemsHasAtLeastOneItem={menuItemsHasAtLeastOneItem}
                    />
                  )
                }
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
