import styles from './card.module.css';
import DollarIcon from '../icons/DollarIcon';
import LocationIcon from '../icons/LocationIcon';
import Text from '../text/Text';
import StarIcon from '../icons/StarIcon';
import Link from 'next/link';

// ToDo: remove isblackScheme
export default function Card({data, height, width, showStarIcon, onStarIconClick, isblackScheme = true}) {
  const { alternativeText, url } = data.profilePicture;
  const { placeOfService, name, lastName, username, incallRates, outcallRates, id } = data;
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  let minimalRate;
  if (incallRates && incallRates.length) {
    minimalRate = incallRates.reduce((acc, cur) => (acc.price < cur.price ? acc : cur));
  } else if ((outcallRates && outcallRates.length)) {
    minimalRate = outcallRates.reduce((acc, cur) => (acc.price < cur.price ? acc : cur));
  } else minimalRate = '';

  return (
    <div className={`${styles.wrapper} ${isblackScheme ? styles.blackScheme : ''} provider-card`}>
      {showStarIcon &&
        <StarIcon className={styles.starIcon} onClick={() => onStarIconClick(id)}/>
      }
      {url &&
        <Link href={`/users/${username}`} className={`${styles.link} unstyled-anchor`}>
          <div className={styles.imageWrapper}>
            <img src={`${baseUrl}${url}`} alt={alternativeText} width={width} height={height} className='card-image'/>
          </div>
        </Link>
      }
        <div className={styles.info}>
          <div className={styles.data}>
            <Link href={`/users/${username}`} className={`${styles.link} ${styles.link} unstyled-anchor`}>
              <Text
                className={`${styles.name} ${isblackScheme ? styles.blackScheme : ''}`}
                tag={'h4'}
                children={`${name} ${lastName}`}
              />
            </Link>
            {minimalRate.price &&
              <div className={`${styles.datawrap} ${styles.costData} ${name ? styles.flexEnd : ''} ${isblackScheme ? styles.blackScheme : ''}`}>
                <DollarIcon isblackScheme={isblackScheme}/>
                <Text
                  className={`${styles.cost} ${isblackScheme ? styles.blackScheme : ''}`}
                  tag={'span'}
                  children={`From $${minimalRate.price} / ${minimalRate.duration}`}
                />
              </div>
            }
          </div>
          <div className={`${styles.datawrap} ${styles.locationdata}`}>
            <LocationIcon blackScheme={isblackScheme}/>
            <Text
              tag={'span'}
              className={`${styles.location} ${isblackScheme ? styles.blackScheme : ''}`}
              children={placeOfService}
            />
          </div>
        </div>
    </div>
  )
}
