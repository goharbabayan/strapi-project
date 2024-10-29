'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_NAVIGATION_QUERIES } from '@/app/graphql/navigationQueries';
import styles from './navigation.module.css';
import Menu from '../menu/Menu';
import Button from '../button/Button';

export default function Navigation ({className, isMobileLayout, atLeastOneButtonExists, buttons, menuItemsHasAtLeastOneItem}) {
  const [navigationItems, setNavigationItems] = useState([]);
  const {loading, error, data} = useQuery(GET_NAVIGATION_QUERIES);
  useEffect(() => {
    let menu = [];
    (data !== undefined && data?.navigation?.data !== null) ? menu = [...data?.navigation?.data?.attributes?.navigation_items?.data] : null;
    data !== undefined && setNavigationItems(menu.map(item => item.attributes));
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
