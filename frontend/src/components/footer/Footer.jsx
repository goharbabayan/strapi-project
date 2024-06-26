'use client'

import { useQuery } from '@apollo/client';
import { GET_FOOTER_QUERIES } from '@/app/graphql/footerQueries';
import { GET_LOGO_QUERIES } from '@/app/graphql/findLogoQueries';
import Link from 'next/link';
import styles from './footer.module.css';

export default function Footer() {
  const { loading: footerLoading, error: footerError, data: footerSectionData } = useQuery(GET_FOOTER_QUERIES);
  const { loading: logoLoading, error: logoError, data: logoData } = useQuery(GET_LOGO_QUERIES);

  if (footerLoading) {
    // Something for loading;
  }
  if (footerError) {
    // Something for error;
  };
  if (footerSectionData === undefined || footerSectionData === null) return;

  const logoUrl = logoData?.homePage?.data?.attributes?.Header?.logo.data?.attributes?.url;
  const footerData = footerSectionData?.homePage?.data?.attributes?.Footer;
  const hasMenuItems = footerData?.menu_items?.data?.length > 0;
  const href = footerData?.link?.redirection_url;
  const text = footerData?.text;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  let menuItems = [];
  if (hasMenuItems) {
    menuItems = footerData.menu_items.data;
  }

  return (
    <footer className={styles.mainWrap}>
      <div className={`${styles.container} page-width`}>
        <div className={styles.leftWrap}>
        {logoUrl && (
          <Link href='' className={styles.logoWrap}>
            <img
              src={`${baseUrl}${logoUrl}`}
              alt='logo'
              className={styles.logo}
              width="295"
              height="70"
            />
          </Link>
        )}
        {footerData.info && <p className={styles.text}>{footerData.info}</p> }
        </div>
        <div className={styles.rightWrap}>
          { footerData?.menu_items?.data?.length > 0 &&
            <ul className={ styles.MenuItemsWrapper }>
              { menuItems.map((item, index) => {
                const { attributes: { item: title, redirection_url: href } } = item;
                return <li key={index}><Link href={href}>{title}</Link></li>
              })}
            </ul>
          }
        </div>
      </div>
      <div className={`${styles.bottomContainer} page-width`}>
        <div className={styles.svgWrapper}>
          <svg xmlns="http://www.w3.org/2000/svg" width="43" height="44" viewBox="0 0 43 44" fill="none">
            <rect x="1.2666" y="0.5" width="40.7389" height="43" rx="20.3694" stroke="#3C403C"/>
            <path d="M21.7666 29L21.7666 15M21.7666 15L15.7666 21M21.7666 15L27.7666 21" stroke="black" strokeWidth="1.5"/>
          </svg>
        </div>
        <div className={styles.bottomInfoContainer}>
          <h4 className={styles.footerText}>{text}</h4>
          <Link href={href} className={styles.url}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M1.57588 16.4245L16.4251 1.57526M16.4251 1.57526L3.6972 1.57526M16.4251 1.57526L16.4251 14.3032" stroke="#ECEEEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </footer>
  )
}
