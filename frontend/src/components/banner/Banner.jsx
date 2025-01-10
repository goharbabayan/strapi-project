import styles from './banner.module.css';
import Button from '../button/Button';
import Image from '../image/Image';
import Text from '../text/Text';

const Banner = ({bannerLink, desktopImage, mobileImage, text, infoWrapperClassName, button, showOverlay, isLocationPage, shouldBeCentered}) => {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  return (
    <>
      {desktopImage &&
        <section className={`${styles.container} ${bannerLink ? styles.withLink : ''}`}>
          {showOverlay &&
            <div className={styles.overlay}></div>
          }
          {desktopImage && desktopImage.url &&
            <Image
              src={`${baseUrl}${desktopImage.url}`}
              alt={desktopImage.alternativeText || desktopImage.name}
              height={desktopImage.height}
              width={desktopImage.width}
              className={'desktop'}
              isLocationPage={isLocationPage}
              {...(bannerLink && { link: bannerLink })}
            />
          }
          {mobileImage && mobileImage?.url ?
            <Image
              src={`${baseUrl}${mobileImage.url}`}
              alt={mobileImage.alternativeText || mobileImage.name}
              height={mobileImage.height}
              width={mobileImage.width}
              className={'mobile'}
              isLocationPage={isLocationPage}
              {...(bannerLink && { link: bannerLink })}
            />
          : desktopImage && desktopImage.url &&
            <Image
              src={`${baseUrl}${desktopImage.url}`}
              alt={desktopImage.alternativeText || desktopImage.name}
              height={desktopImage.height}
              width={desktopImage.width}
              className={'mobile'}
              isLocationPage={isLocationPage}
              {...(bannerLink && { link: bannerLink })}
            />
          }
          {(text || button?.title) &&
            <div className={`${styles.wrapper} ${bannerLink ? styles.withLink : ''} ${infoWrapperClassName || ''} ${shouldBeCentered && styles.centerText}`}>
              <div className={`${styles.info} page-width`}>
                {text &&
                  <Text
                    tag={'h2'}
                    className={`${styles.title}`}
                    children={text}
                  />
                }
                {button && button.title &&
                  <Button
                    {...(button.link && { href: button.link })}
                    className={`${styles.button} ${button?.link ? styles.withLink : ''} ${bannerLink ? styles.withBannerLink : ''}`}
                    children={button.title}
                  />
                }
              </div>
            </div>
          }
        </section>
      }
    </>
  )
};

export default Banner;
