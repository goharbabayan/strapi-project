import { calculateImageAspectRatio } from '@/app/utils/helpers';
import styles from './image.module.css';

export default function Image({src, alt, width, height, link, className, providerCartAspectRatio, isLocationPage, showVerificationBadge, VerificationIcon, verificationBadgeText}) {

  const imageAspectRatio = providerCartAspectRatio ? providerCartAspectRatio : calculateImageAspectRatio(width, height);
  return (
    <>
    {link ? (
      <a style={{ '--ratio-percent': `${1 / imageAspectRatio * 100}%` }} href={link || ''} className={`${styles.link} ${className ? styles[className] : ''} ${isLocationPage ? styles.locationPageImage : ''}`}>
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`${styles.image} `}
        />
        {showVerificationBadge && VerificationIcon &&
          <div className={styles.verificationBadgeContainer}>
            <VerificationIcon/>
          </div>
        }
      </a>
    ) : (
      <div style={{ '--ratio-percent': `${1 / imageAspectRatio * 100}%` }} className={`${styles.link} ${className ? styles[className] : ''} ${isLocationPage ? styles.locationPageImage : ''}`}>
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`${styles.image} ${className ? styles[className] : ''}`}
        />
        {showVerificationBadge && VerificationIcon &&
          <div className={styles.verificationBadgeContainer} style={{'--verification-badge-text': `"${verificationBadgeText}"`}}>
            {VerificationIcon}
          </div>
        }
      </div>
    )}
    </>
  )
}
