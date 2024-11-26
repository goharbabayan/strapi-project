'use client';

import { useState, useEffect, useContext } from 'react';
import { useQuery } from '@apollo/client';
import { GET_HEADER_QUERIES } from '../../app/graphql/headerQueries';
import { navigate } from '../../app/utils/actions';
import ListItems from '../listItems.jsx/ListItems';
import styles from './header.module.css';
import SearchIcon from '../icons/SearchIcon';
import Button from '../button/Button';
import BurgerButton from '../icons/burgerButton/BurgerButton';
import Navigation from '../navigation/Navigation';
import { AuthContext } from '@/app/Context';
import { useFetchData } from '@/app/utils/hooks/useFetch';
import HeaderAccountTab from './headerAccountTab/HeaderAccountTab';

export default function Header() {
  const {customerToken} = useContext(AuthContext);
  const [headerData, setHeaderData] = useState({
    logo: null,
    buttons: null,
    menuItemsTitle: null,
    menuItems: null,
  });
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const [showMobileNavigation, setShowMobileNavigation] = useState(false);
  const [listItemsAreOpened, setListItemsAreOpened] = useState(false);
  const [isOneOfTheMobileMenuItemsOpened, setIsOneOfTheMobileMenuItemsOpened] = useState(false);
  const [openedFirstLevelMobileItemId, setOpenedFirstLevelMobileItemId] = useState(null);
  const [navigationClassName, setNavigationClassName] = useState(false);
  const [loggedInCustomerData, setLoggedInCustomerData] = useState(null);
  const {loading, error, data} = useQuery(GET_HEADER_QUERIES);
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  useEffect(() => {
    if (data !== undefined) {
      setHeaderData({
        logo: data?.header?.data?.attributes?.logo?.data?.attributes,
        buttons: data?.header?.data?.attributes?.buttons,
        menuItemsTitle: data?.header?.data?.attributes?.announcement_bar?.title,
        menuItems: data?.header?.data?.attributes?.announcement_bar?.announcement_bar_links,
      });
    }
  }, [data]);

  useEffect(() => {
    if (customerToken) {
      useFetchData(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me?populate=*`, {
        method: 'GET',
        headers: {
          'authorization': `Bearer ${customerToken}`
        }
      }).then((data) => {
        setLoggedInCustomerData({
          username: data?.username,
          profilePicture: data?.profilePicture?.url,
          name: data?.name,
          lastname: data?.lastName,
          role: data?.role?.type
        })
      })
    }
  }, [customerToken]);

  useEffect(() => {
    checkWidth();
    window.addEventListener('resize', checkWidth);
  }, []);

  const checkWidth = () => {
    const isMobileLayout = window.innerWidth < 850;
    setIsMobileLayout(isMobileLayout);
  };

  const handleBurgerButtonClick = () => {
    setShowMobileNavigation(!showMobileNavigation);
    setNavigationClassName(!navigationClassName);
  };

  const menuItemsHasAtLeastOneItem = headerData.menuItems && headerData.menuItems.length > 0;
  const atLeastOneButtonExists = headerData.buttons && headerData.buttons.length > 0;

  return (
    <>
      {loading && <header className={styles.emptyHeader}></header>}
      {data &&
        <header className={`${styles.header} ${menuItemsHasAtLeastOneItem === false ? styles.menuItemsAreEmpty : ''}`}>
          {menuItemsHasAtLeastOneItem && !isMobileLayout &&
            <ListItems items={headerData.menuItems}/>
          }
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
                  {headerData?.logo &&
                    <a className={styles.logo} href="/">
                      <img
                        src={`${baseUrl}${headerData?.logo?.url}`}
                        alt={headerData?.logo?.alternativeText || 'logo'}
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
                  <div className={styles.headerMenu}>
                    <a href="/search" className={styles.anchor}>
                      <SearchIcon
                        className={styles.searchIcon}
                      />
                    </a>
                    {customerToken && loggedInCustomerData ?
                      <HeaderAccountTab
                        loggedInCustomerData={loggedInCustomerData}
                        isMobileLayout={isMobileLayout}
                      />
                        :
                      <>
                        {atLeastOneButtonExists && !isMobileLayout &&
                          headerData?.buttons.map((button, index) =>
                            <Button
                              key={index}
                              children={button.title}
                              {...(button.link && { href: button.link })}
                              variant={`${index === 0 ? 'general' : 'main'}`}
                            />
                          )
                        }
                      </>
                    }
                  </div>
                </div>
              </div>
            </div>
            {isMobileLayout &&
              <div className={`${styles.mobileNavigation} ${showMobileNavigation ? styles.show : ''} ${navigationClassName ? 'navigation_is_open' : ''}`}>
                {menuItemsHasAtLeastOneItem &&
                  <ListItems
                    items={headerData?.menuItems}
                    isMobile={true}
                    title={headerData?.menuItemsTitle}
                    isOneOfTheMobileMenuItemsOpened={isOneOfTheMobileMenuItemsOpened}
                    setIsOneOfTheMobileMenuItemsOpened={setIsOneOfTheMobileMenuItemsOpened}
                    listItemsAreOpened={listItemsAreOpened}
                    setListItemsAreOpened={setListItemsAreOpened}
                  />
                }
                <Navigation
                  isMobileLayout={isMobileLayout}
                  atLeastOneButtonExists={atLeastOneButtonExists}
                  buttons={headerData.buttons}
                  isOneOfTheMobileMenuItemsOpened={isOneOfTheMobileMenuItemsOpened}
                  setIsOneOfTheMobileMenuItemsOpened={setIsOneOfTheMobileMenuItemsOpened}
                  openedFirstLevelMobileItemId={openedFirstLevelMobileItemId}
                  setOpenedFirstLevelMobileItemId={setOpenedFirstLevelMobileItemId}
                  listItemsAreOpened={listItemsAreOpened}
                />
              </div>
            }
          </section>
        </header>
      }
    </>
  )
}
