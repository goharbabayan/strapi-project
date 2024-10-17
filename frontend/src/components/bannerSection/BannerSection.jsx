import styles from './bannerSection.module.css';

export default function BannerSection({data, className}) {
  const {alternativeText, height, width, url} = data;

  return (
    <section className={className}>
      {url &&
        <div className={styles.imageWrapper}>
          <div className={styles.overlay}></div>
            <img
              src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${url}`}
              height={height}
              width={width}
              alt={alternativeText || 'image'}
            />
        </div>
      }
    </section>
  )
}
