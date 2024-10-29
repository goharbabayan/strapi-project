'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_HEADER_QUERIES } from '../../app/graphql/headerQueries';
import { navigate } from '../../app/utils/actions';
import ListItems from '../listItems.jsx/ListItems';
import styles from './header.module.css';
import SearchIcon from '../icons/SearchIcon';
import Button from '../button/Button';
import BurgerButton from '../icons/burgerButton/BurgerButton';
import Navigation from '../navigation/Navigation';

export default function Header() {
  const [menuItems, setMenuItems] = useState([]);
  const [menuItemsTitle, setMenuItemsTitle] = useState(null);
  const [buttons, setButtons] = useState([]);
  const [logo, setLogo] = useState(null);
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const [showMobileNavigation, setShowMobileNavigation] = useState(false);
  const [listItemsAreOpened, setListItemsAreOpened] = useState(false);
  const [isOneOfTheMobileMenuItemsOpened, setIsOneOfTheMobileMenuItemsOpened] = useState(false);
  const [openedFirstLevelMobileItemId, setOpenedFirstLevelMobileItemId] = useState(null);
  const [navigationClassName, setNavigationClassName] = useState(false);
  const {loading, error, data} = useQuery(GET_HEADER_QUERIES);
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  useEffect(() => {
    data !== undefined && setMenuItems(data?.header?.data?.attributes?.categories?.categories);
    data !== undefined && setMenuItemsTitle(data?.header?.data?.attributes?.categories?.categories_title);
    data !== undefined && setLogo(data?.header?.data?.attributes?.logo?.data?.attributes);
    data !== undefined && setButtons(data?.header?.data?.attributes?.buttons);
  }, [data]);

  useEffect(() => {
    checkWidth();
    window.addEventListener('resize', checkWidth);
  }, []);

  const checkWidth = () => {
    const isMobileLayout = window.innerWidth < 850;
    setIsMobileLayout(isMobileLayout);
  };

  const handleSearchIconClick = () => {
    navigate('/search');
  };

  const handleBurgerButtonClick = () => {
    setShowMobileNavigation(!showMobileNavigation);
    setNavigationClassName(!navigationClassName);
  };

  const menuItemsHasAtLeastOneItem = menuItems && menuItems.length > 0;
  const atLeastOneButtonExists = buttons && buttons.length > 0;

  return (
    <>
      {loading &&
        <header className={styles.emptyHeader}></header>
      }
      {data &&
        <header className={`${styles.header} ${menuItemsHasAtLeastOneItem === false ? styles.menuItemsAreEmpty : ''}`}>
          {menuItemsHasAtLeastOneItem && !isMobileLayout &&
            <ListItems items={menuItems}/>
          }
          {logo &&
          <>
            <section>
              <div className="page-width">
                <div className={`${styles.headerSection}`}>
                  {!isMobileLayout &&
                    <Navigation
                      className={styles.navigation}
                      menuItemsHasAtLeastOneItem={menuItemsHasAtLeastOneItem}
                    />
                  }
                  <div className={styles.container}>
                    {logo &&
                      <a className={styles.logo} href="/">
                        <img
                          src={`${baseUrl}${logo.url}`}
                          alt={logo.alternativeText || 'logo'}
                          width={238}
                          height={68}
                        />
                      </a>
                    }
                    {isMobileLayout &&
                      <BurgerButton
                        className={styles.navigationButton}
                        onBurgerButtonClick={handleBurgerButtonClick}
                      />
                    }
                    {logo &&
                      <div className={styles.headerMenu}>
                        <SearchIcon
                          className={styles.searchIcon}
                          onClick={handleSearchIconClick}
                        />
                        {atLeastOneButtonExists && !isMobileLayout &&
                          buttons.map((button, index) =>
                            <Button
                              children={button.title}
                              href={button.link || ''}
                              className={index % 2 === 0 ? `${styles.button} button_general` : `${styles.button} button_main`}
                              key={index}
                            />
                          )
                        }
                      </div>
                    }
                  </div>
                </div>
              </div>
              {isMobileLayout &&
                <div className={`${styles.mobileNavigation} ${showMobileNavigation ? styles.show : ''} ${navigationClassName ? 'navigation_is_open' : ''}`}>
                  {menuItemsHasAtLeastOneItem &&
                    <ListItems
                      items={menuItems}
                      isMobile={true}
                      title={menuItemsTitle}
                      isOneOfTheMobileMenuItemsOpened={isOneOfTheMobileMenuItemsOpened}
                      setIsOneOfTheMobileMenuItemsOpened={setIsOneOfTheMobileMenuItemsOpened}
                      listItemsAreOpened={listItemsAreOpened}
                      setListItemsAreOpened={setListItemsAreOpened}
                    />
                  }
                  <Navigation
                    isMobileLayout={isMobileLayout}
                    atLeastOneButtonExists={atLeastOneButtonExists}
                    buttons={buttons}
                    isOneOfTheMobileMenuItemsOpened={isOneOfTheMobileMenuItemsOpened}
                    setIsOneOfTheMobileMenuItemsOpened={setIsOneOfTheMobileMenuItemsOpened}
                    openedFirstLevelMobileItemId={openedFirstLevelMobileItemId}
                    setOpenedFirstLevelMobileItemId={setOpenedFirstLevelMobileItemId}
                    listItemsAreOpened={listItemsAreOpened}
                  />
                </div>
              }
            </section>
          </>
          }
        </header>
      }
    </>
  )
}
