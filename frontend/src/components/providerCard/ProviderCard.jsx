import styles from './providerCard.module.css';
import LocationIcon from  '../icons/LocationIcon';
import DollarIcon from '../icons/DollarIcon';

const ProviderCard = ({ provider, blackScheme }) => {
  const { badge, image, cost, location, name } = provider;
  let imageUrl, alt;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const isblackScheme = blackScheme ? styles.blackScheme : '';
  if (image) {
    imageUrl = `${baseUrl}${image.data.attributes.url}`;
    alt = image.data.attributes.alternativeText || 'provider-card';
  }
  return (
    <div className={`${styles.wrapper} ${isblackScheme} provider-card`}>
      {image && imageUrl &&
        <div className={styles.imageWrapper}>
          <img src={imageUrl} alt={alt} width="267" height="282" class='card-image'/>
        </div>
      }
      {badge &&
        <div className={styles.cardtitle}>
          <span className={styles.title}>{badge}</span>
        </div>
      }
      <div className={styles.info}>
        <div className={styles.data}>
          {name &&
            <h4 className={`${styles.name} ${isblackScheme}`}>{name}</h4>
          }
          {cost &&
            <div className={`${styles.datawrap} ${styles.costData} ${name ? styles.flexEnd : ''} ${isblackScheme}`}>
              <DollarIcon isblackScheme={isblackScheme}/>
              <span className={`${styles.cost} ${isblackScheme}`}>{cost}</span>
            </div>
          }
        </div>
        {location &&
          <div className={`${styles.datawrap} ${styles.locationdata}`}>
            <LocationIcon blackScheme={blackScheme}/>
            <span className={`${styles.location} ${isblackScheme}`}>{location}</span>
          </div>
        }
      </div>
    </div>
  )
};

export default ProviderCard;
