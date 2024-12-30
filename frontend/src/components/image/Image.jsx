import { calculateImageAspectRatio } from '@/app/utils/helpers';
import styles from './image.module.css';

export default function Image({src, alt, width, height, link, className, providerCartAspectRatio, isLocationPage}) {
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
      </div>
    )}
    </>
  )
}
