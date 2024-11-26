'use client'

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_FOOTER_QUERIES } from '@/app/graphql/footerQueries';
import styles from './footer.module.css';
import Arrow from '../icons/Arrow';
import Text from '../text/Text';
import Button from '../button/Button';
import Link from 'next/link';

export default function Footer() {
  const [logo, setLogo] = useState(null);
  const [description, setDescription] = useState('');
  const [navigationItems, setNavigationItems] = useState([]);
  const {loading, error, data} = useQuery(GET_FOOTER_QUERIES);
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  useEffect(() => {
    data !== undefined && setLogo(data?.footer?.data?.attributes?.logo?.data?.attributes);
    data !== undefined && setDescription(data?.footer?.data?.attributes?.description);
    data !== undefined && setNavigationItems(data?.footer?.data?.attributes?.navigation?.data);
  }, [data]);

  const handleScrollToSection = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const atLeastOneNavigationItemExist = navigationItems && navigationItems.length > 0;
  const isLogoOrNavigationExisting = logo || atLeastOneNavigationItemExist;

  return (
    <>
      {loading
      ?
        <footer className={styles.emptyFooter}></footer>
      :
        <>
          {isLogoOrNavigationExisting &&
            <footer className={styles.footer}>
              <section className="page-width">
                <div className={styles.container}>
                  {(logo || description) &&
                    <div className={`${styles.logoWrapper} ${!atLeastOneNavigationItemExist ? styles.fullWidth : ''}`}>
                      {logo &&
                        <a className={styles.logo} href="/">
                          <img
                            src={`${baseUrl}${logo.url}`}
                            alt={logo.alternativeText || 'logo'}
                            width={202}
                            height={100}
                          />
                        </a>
                      }
                      {description &&
                        <Text
                          tag={'p'}
                          children={description}
                          className={styles.description}
                        />
                      }
                    </div>
                  }
                  {atLeastOneNavigationItemExist &&
                    <div className={styles.navigation}>
                      {navigationItems.map((item, index) => {
                        const {name, url} = item.attributes;
                        if (index < 12) return (
                          <div className={styles.navItem} key={index}>
                            <Link
                              {...(url && { href: url })}
                              children={name}
                              className={styles.link}
                            />
                          </div>
                        )}
                      )}
                    </div>
                  }
                  {logo &&
                    <div className={styles.iconWrap} onClick={handleScrollToSection}>
                      <Arrow className={styles.iconArrow}/>
                    </div>
                  }
                </div>
              </section>
            </footer>
          }
        </>
      }
    </>
  )
}
