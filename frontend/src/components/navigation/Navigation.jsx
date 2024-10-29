'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_NAVIGATION_QUERIES } from '@/app/graphql/navigationQueries';
import styles from './navigation.module.css';
import Menu from '../menu/Menu';
import Button from '../button/Button';

export default function Navigation ({
  className,
  isMobileLayout,
  atLeastOneButtonExists,
  buttons,
  menuItemsHasAtLeastOneItem,
  isOneOfTheMobileMenuItemsOpened,
  setIsOneOfTheMobileMenuItemsOpened,
  openedFirstLevelMobileItemId,
  setOpenedFirstLevelMobileItemId,
  listItemsAreOpened
}) {
  const [navigationItems, setNavigationItems] = useState([]);
  const {loading, error, data} = useQuery(GET_NAVIGATION_QUERIES);
  useEffect(() => {
    if (data !== undefined) {
      const navigationData = data?.header?.data?.attributes?.navigation?.navigation_items?.data;
      navigationData && setNavigationItems(navigationData.map(item => item.attributes));
    }
  }, [data]);

  const navigationItemsIsNotEmpty = navigationItems && Array.isArray(navigationItems) && navigationItems.length > 0;
  return (
    <>
      {navigationItemsIsNotEmpty &&
        <nav className={`${className ? className : ''} ${isMobileLayout ? `${styles.mobileLayout} page-width` : ''}`}>
          <div className={styles.mainWrap}>
            <Menu
              menu={navigationItems}
              level={1}
              isMobileLayout={isMobileLayout}
              menuItemsHasAtLeastOneItem={menuItemsHasAtLeastOneItem}
              isOneOfTheMobileMenuItemsOpened={isOneOfTheMobileMenuItemsOpened}
              setIsOneOfTheMobileMenuItemsOpened={setIsOneOfTheMobileMenuItemsOpened}
              openedFirstLevelMobileItemId={openedFirstLevelMobileItemId}
              setOpenedFirstLevelMobileItemId={setOpenedFirstLevelMobileItemId}
              listItemsAreOpened={listItemsAreOpened}
            />
            {atLeastOneButtonExists && isMobileLayout &&
              <div className={styles.buttonsWrapper}>
                {buttons.map((button, index) =>
                  <Button
                    children={button.title}
                    href={button.link || ''}
                    className={index % 2 === 0 ? `${styles.button} button_general` : `${styles.button} button_main`}
                    key={index}
                  />
                )}
              </div>
            }
          </div>
        </nav>
      }
    </>
  )
}
