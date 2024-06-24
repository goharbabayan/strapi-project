import Link from 'next/link';
import Image from 'next/image';
import styles from './header.module.css';
import SearchInput from '../../components/input/SearchInput';
import Button from '@/components/button/Button';
import globalStyles from '../../app/global.css';
import Accordion from '../icons/Accordion';


export default function Header(props) {
  const { headerSection, logoUrl } = props;

  let firstNavigationText, secondNavigationText;
  if (headerSection.menuItem1) {
    firstNavigationText = headerSection.menuItem1;
  }
  if (headerSection.menuItem2) {
    secondNavigationText = headerSection.menuItem2;
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const buttons = headerSection.Button;
  
  return (
    <header className={`${styles.header}`}>
      <div className={`${styles.mainWrap} page-width`}>
        <div className={`${styles.left_wrap}`}>
          <Link href='/' className={styles.logoWrap}>
            {logoUrl && (
              <Image
                src={`${baseUrl}${logoUrl}`}
                alt='logo'
                className={styles.logo}
                width='170'
                height='41'
              />
            )}
          </Link>
          <ul className={styles.navigation}>
            { firstNavigationText &&
              <li className={styles.navItem}>
                <span>{firstNavigationText}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                  <path d="M13 6L8 11L3 6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </li>
            }
            { secondNavigationText &&
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
          <div className={styles.buttons_wrap}>
            {
              buttons.length > 0 && buttons.map((button, index) => {
                let href = null;
                button.link ? href = button.link : null;
                return (
                  <Button
                    key={`${button.id}`}
                    href={href}
                    className={`${styles.btn} btn_${button.type}`}
                  >
                    <span>{button.title}</span>
                  </Button>
                )
              })
            }
          </div>
        </div>
        <div className={styles.iconAccordion}>
          <Accordion/>
        </div>
      </div>
    </header>
  )
}
