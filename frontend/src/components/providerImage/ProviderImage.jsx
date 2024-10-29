import styles from './providerImage.module.css';

export default function ProviderImage ({src, alt, width, height, link, className}) {
  return (
    <>
    {link ? (
      <a href={link || ''} className={`${styles.link}`}>
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`${styles.image} ${className ? className : ''}`}
        />
      </a>
    ) : (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${styles.image} ${className ? className : ''}`}
      />
    )}
    </>
  )
}
