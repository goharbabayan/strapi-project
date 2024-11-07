'use client'

import styles from './imageBanner.module.css';
import Image from '../image/Image';

export default function ImageBanner({mobileImage, desktopImage}) {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const {url: srcMobile, alternativeText: altMMobile, width: widthMobile, height: heightMobile} = mobileImage;
  const {url: srcDesktop, alternativeText: altMDesktop, width: widthDesktop, height: heightDesktop} = desktopImage;

  return (
    <div className={styles.imageWrapper}>
      <Image
        src={`${baseUrl}${srcMobile}`}
        alt={altMMobile}
        width={widthMobile}
        height={heightMobile}
        link={null}
        className={'mobile'}
      />
      <Image
        src={`${baseUrl}${srcDesktop}`}
        alt={altMDesktop}
        width={widthDesktop}
        height={heightDesktop}
        link={null}
        className={'desktop'}
      />
    </div>
  )
}
