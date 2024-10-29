import styles from './locationCard.module.css';
import Link from 'next/link';
import Text from '../text/Text';
import Image from '../image/Image';

const LocationCard = ({ card }) => {
  const { badge, image, url } = card;
  const {name, alternativetext, url: src, width, height } = image?.data.attributes;
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  return (
    <div className={`${styles.container} ${styles.card}`}>
      {src &&
        <Image
          src={`${baseUrl}${src}`}
          alt={alternativetext || name}
          width={193}
          height={184}
          className={styles.imageWrapper}
          link={url}
        />
      }
      {badge &&
        <div className={styles.textWrap}>
          <Text
            tag={'span'}
            children={badge}
            className={styles.badge}
          />
        </div>
      }
    </div>
  )
};

export default LocationCard;
