import styles from './locationCard.module.css';
import Link from 'next/link';

const LocationCard = ({ data }) => {
  const { badge, image, url } = data;
  let alt, imageUrl;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (image) {
    imageUrl = `${baseUrl}${image.data.attributes.url}`;
    alt = image.data.attributes.alternativeText || 'locationCard';
  }
  return (
    <div className={`${styles.container} location-card`}>
      { imageUrl && url &&
        <Link href={url} className={`${styles.imageWrapper}`}>
          <img src={imageUrl} alt={alt} width="302" height="397" class='card-image'/>
        </Link>
      }
      { badge &&
        <div className={styles.cardtitle}>
          <span className={styles.title}>{badge}</span>
        </div>
      }
    </div>
  )
};

export default LocationCard;
