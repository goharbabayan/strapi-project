'use client'

import styles from './imageBanner.module.css';
import ProviderImage from '../providerImage/ProviderImage';

export default function ImageBanner({mobileImage, desktopImage}) {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const {url: srcMobile, alternativeText: altMMobile, width: widthMobile, height: heightMobile} = mobileImage;
  const {url: srcDesktop, alternativeText: altMDesktop, width: widthDesktop, height: heightDesktop} = desktopImage;

  return (
    <div className={styles.imageWrapper}>
      <ProviderImage
        src={`${baseUrl}${srcMobile}`}
        alt={altMMobile}
        width={widthMobile}
        height={heightMobile}
        link={null}
        className={styles.mobile}
      />
      <ProviderImage
        src={`${baseUrl}${srcDesktop}`}
        alt={altMDesktop}
        width={widthDesktop}
        height={heightDesktop}
        link={null}
        className={styles.desktop}
      />
    </div>
  )
}
