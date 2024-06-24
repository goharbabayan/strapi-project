
import Link from 'next/link';
import Image from 'next/image';
import styles from './footer.module.css';

export default function Footer({ data, logoUrl }) {
  const hasMenuItems = data?.menu_items?.data?.length > 0;
  const href = data?.link?.redirection_url;
  const text = data?.text;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  let menuItems = [];
  if (hasMenuItems) {
    menuItems = data.menu_items.data;
  }

  return (
    <footer className={styles.mainWrap}>
      <div className={`${styles.container} page-width`}>
        <div className={styles.leftWrap}>
        { logoUrl && (
          <Link href='' className={styles.logoWrap}>
            <Image
              src={`${baseUrl}${logoUrl}`}
              alt='logo' className={styles.logo}
              width="295"
              height="70"
            />
          </Link>
        )}
        { data.info && <p className={styles.text}>{data.info}</p> }
        </div>
        <div className={styles.rightWrap}>
          { data?.menu_items?.data?.length > 0 &&
            <ul className={ styles.MenuItemsWrapper }>
              { menuItems.map((item, index) => {
                let title = item.attributes.item
                let href = item.attributes.redirection_url
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
