'use client'

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ABOUT_US_PAGE_QUERIES } from '../graphql/aboutUsPageQueries';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import styles from './aboutUs.module.css';
import Loading from '../loading';
import Error from '../error';

export default function AboutUs() {
  const [contentIsNotEmpty, setContentIsNotEmpty] = useState(false);
  const [mobileImageExists, setMobileImageExists] = useState(false);
  const [desktopImageExists, setDesktopImageExists] = useState(false);
  const [textContent, setTextContent ] = useState({});
  const [mobileImage, setMobileImage] = useState({});
  const [desktopImage, setDesktopImage] = useState({});
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const { loading, error, data } = useQuery(GET_ABOUT_US_PAGE_QUERIES);

  useEffect(() => {
    if (data) {
      const { hero_image_landscape_for_mobile, hero_image_portrait_for_desktop, content } = data?.aboutUs?.data?.attributes;
      content && setContentIsNotEmpty(true);
      if (hero_image_landscape_for_mobile.data != null) {
        setMobileImageExists(true);
        setMobileImage(hero_image_landscape_for_mobile?.data.attributes);
      }
      if (hero_image_portrait_for_desktop.data != null) {
        setDesktopImageExists(true);
        setDesktopImage(hero_image_portrait_for_desktop?.data.attributes);
      }
      setTextContent(content);
    }
  }, [data]);

  return (
    <>
      {loading &&
        <div className='page-width'>
          <Loading className={styles.loading}/>
        </div>
      }
      {contentIsNotEmpty &&
        <section className={`${styles.mainWrap}`}>
          <div className={`page-width`}>
            <div className={`${styles.container}`}>
              {mobileImageExists && mobileImage.url &&
                <div className={`${styles.imageWrapper} ${styles.mobileImage} flex`}>
                  <img
                    alt={mobileImage.alternativeText || 'hero-image'}
                    height={mobileImage.height} width={mobileImage.width}
                    src={`${baseUrl}${mobileImage.url}`}
                    className={styles.heroImage}/>
                </div>
              }
              {!mobileImageExists && desktopImageExists && desktopImage.url &&
                <div className={`${styles.imageWrapper} ${styles.mobileImage} flex`}>
                  <img
                    alt={desktopImage.alternativeText || 'hero-image'}
                    height={desktopImage.height} width={desktopImage.width}
                    src={`${baseUrl}${desktopImage.url}`}
                    className={styles.heroImage}/>
                </div>
              }
              {desktopImageExists && desktopImage.url &&
                <div className={`${styles.imageWrapper} ${styles.desktopImage} flex`}>
                  <img
                    alt={desktopImage.alternativeText || 'hero-image'}
                    height={desktopImage.height} width={desktopImage.width}
                    src={`${baseUrl}${desktopImage.url}`}
                    className={styles.heroImage}/>
                </div>
              }
              {(textContent && textContent.heading || textContent && textContent.text) &&
                <div className={styles.content}>
                  {textContent.heading && <h2 className={styles.heading}>{textContent.heading}</h2>}
                  <div className={styles.aboutUsDescription}>
                    {textContent.text && <BlocksRenderer content={textContent.text} />}
                  </div>
                </div>
              }
            </div>
          </div>
        </section>
      }
      {error && <Error error={error} />}
    </>
  )
}
