import { calculateImageAspectRatio } from '@/app/utils/helpers';
import styles from './image.module.css';

export default function Image({src, alt, width, height, link, className}) {

  const imageAspectRatio = calculateImageAspectRatio(width, height);

  return (
    <>
    {link ? (
      <a style={{ '--ratio-percent': `${1 / imageAspectRatio * 100}%` }} href={link || ''} className={`${styles.link} ${styles[className]}`}>
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`${styles.image} `}
        />
      </a>
    ) : (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${styles.image} ${styles[className]}`}
      />
    )}
    </>
  )
}
