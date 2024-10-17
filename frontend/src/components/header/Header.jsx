'use client';

import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { GET_HEADER_QUERIES } from '../../app/graphql/headerQueries';
import { GET_LOGO_QUERIES } from '@/app/graphql/findLogoQueries';
import styles from './header.module.css';
import SearchInput from '../../components/input/SearchInput';
import Button from '@/components/button/Button';
import Accordion from '../icons/Accordion';
import { usePathname } from 'next/navigation';

export default function Header({isHomePage}) {
  const { loading: headerLoading, error: headerError, data: headerSectionData } = useQuery(GET_HEADER_QUERIES);
  const { loading: logoLoading, error: logoError, data: logoData } = useQuery(GET_LOGO_QUERIES);
  const pathname = usePathname();
  const isAccountPage = pathname.includes('/my-account');
  if (headerLoading) {
    // Something for loading;
  }
  if (headerError) {
    // Something for error;
  };

  if (headerSectionData === undefined || headerSectionData === null) return;

  const headerData = headerSectionData?.homePage?.data?.attributes?.Header;
  const logoUrl = logoData?.homePage?.data?.attributes?.Header?.logo.data?.attributes?.url;

  let firstNavigationText, secondNavigationText;
  if (headerData.menuItem1) {
    firstNavigationText = headerData.menuItem1;
  }
  if (headerData.menuItem2) {
    secondNavigationText = headerData.menuItem2;
  }
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const buttons = headerData.Button;
  const isButtonsExisting = buttons.length > 0;

  const handleLogoutButtonClick = () => {
    localStorage.removeItem('token');
  }
  return (
    <header className={`${styles.header} ${isHomePage ? styles.withAnnouncementBar : ''}`}>
      <div className={`${styles.mainWrap} page-width`}>
        <div className={`${styles.left_wrap}`}>
          <Link href='/' className={styles.logoWrap}>
            {logoUrl && (
              <img
                src={`${baseUrl}${logoUrl}`}
                alt='logo'
                className='logo'
                width='170'
                height='41'
              />
            )}
          </Link>
          <ul className={styles.navigation}>
            {firstNavigationText &&
              <li className={styles.navItem}>
                <span>{firstNavigationText}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                  <path d="M13 6L8 11L3 6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </li>
            }
            {secondNavigationText &&
              <li className={styles.navItem}>
                <span>{secondNavigationText}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                  <path d="M13 6L8 11L3 6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </li>
            }
          </ul>
        </div>
        <div className={`${styles.right_wrap}`}>
          <SearchInput/>
          {isButtonsExisting &&
            <div className={styles.buttons_wrap}>
              {isAccountPage
                ?
                <Button
                  href='/'
                  className={`${styles.btn} btn_PRIMARY`}
                  onClick={handleLogoutButtonClick}
                >
                  <span>Logout</span>
                </Button>
                :
                buttons.map((button) => {
                  let href = null;
                  button.link ? href = button.link : null;
                  return (
                    button.title
                    ?
                    <Button
                      key={`${button.id}`}
                      href={href}
                      className={`${styles.btn} btn_${button.type}`}
                    >
                      <span>{button.title}</span>
                    </Button>
                    :
                    null
                  )
                })
              }
            </div>
          }
        </div>
        <div className={styles.iconAccordion}>
          <Accordion/>
        </div>
      </div>
    </header>
  )
}
