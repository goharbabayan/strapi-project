'use client'

import styles from './imageBanner.module.css';
import Image from '../image/Image';

// ToDo: check if this component can be merged with Banner component
export default function ImageBanner({mobileImage, desktopImage}) {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const {url: srcMobile, alternativeText: altMobile, width: widthMobile, height: heightMobile} = mobileImage;
  const {url: srcDesktop, alternativeText: altDesktop, width: widthDesktop, height: heightDesktop} = desktopImage;

  return (
    <div className={styles.imageWrapper}>
      {srcMobile
        ?
          <Image
            src={`${baseUrl}${srcMobile}`}
            alt={altMobile}
            width={widthMobile}
            height={heightMobile}
            link={null}
            className={'mobile'}
          />
        :
          <Image
            src={`${baseUrl}${srcDesktop}`}
            alt={altDesktop}
            width={widthDesktop}
            height={heightDesktop}
            link={null}
            className={'mobile'}
          />
      }
      <Image
        src={`${baseUrl}${srcDesktop}`}
        alt={altDesktop}
        width={widthDesktop}
        height={heightDesktop}
        link={null}
        className={'desktop'}
      />
    </div>
  )
}
