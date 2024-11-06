import {useState, useEffect } from 'react';
import styles from './providerCard.module.css';
import LocationIcon from  '../icons/LocationIcon';
import DollarIcon from '../icons/DollarIcon';
import ProviderImage from '../providerImage/ProviderImage';
import Link from 'next/link';
import Text from '../text/Text';

const ProviderCard = ({provider, showBadge, badge, count}) => {
  if (!provider) return;
  const [hourlyRate, setHourlyRate] = useState(null);
  const {
    username,
    name,
    lastName,
    profilePicture,
    placeOfService,
    age,
    dressSize,
    incallRates,
    outcallRates
  } = provider;

  const {
    name: imageName,
    alternativeText,
    height: imageHeight,
    width: imageWidth,
    url
  } = profilePicture?.data ? profilePicture?.data?.attributes : profilePicture;
  const cardWidth = count && count === 3 ? '33.3%' : count && count === 4 ? '25%' : '100%';
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  useEffect(() => {
     incallRates && outcallRates && setHourlyRate(findLowestCost(incallRates, outcallRates));
  }, [incallRates, outcallRates]);

  const findLowestCost = (incallRates, outcallRates) => {
    let cost;
    if (incallRates.length > 0) {
      incallRates.find(rate => rate.duration && rate.duration.trim() === '1 hour' ? cost = rate.price : cost = null);
    };
    if (!cost && outcallRates.length > 0) {
      outcallRates.find(rate => rate.duration && rate.duration.trim() === '1 hour' ? cost = rate.price : null);
    };
    return cost;
  }

  return (
    <div
      className={`${styles.card} ${count ? styles.hasCount : ''}`}
      style={{ '--provider-card-width': `${cardWidth}`}}
    >
      {profilePicture && url &&
        <Link
          className={styles.link}
          href={`/provider/${username}`}
        >
          <div className={styles.mainWrap}>
            {showBadge && badge &&
              <div className={styles.badgeContainer}>
                <span className={styles.badge}>{badge}</span>
              </div>
            }
           {url &&
              <div className={styles.imageWrapper} style={{'--image-aspect-ratio': `${1 / 0.70 * 100}%`}}>
                <ProviderImage
                  src={`${baseUrl}${url}`}
                  alt={alternativeText || imageName}
                  width={imageWidth}
                  height={imageHeight}
                  className={styles.image}
                />
              </div>
            }
            <div className={styles.info}>
              <div className={styles.data}>
                {name &&
                  <Text
                    tag={'h4'}
                    className={`${styles.user}`}
                    children={`${name} ${lastName}`}
                  />
                }
                {hourlyRate ?
                  <div className={`${styles.cost}`}>
                    <DollarIcon/>
                    <Text
                      tag={'span'}
                      className={`${styles.text}`}
                      children={`From $ ${hourlyRate} / 1h`}
                    />
                  </div>
                :
                  <div className={`${styles.cost}`}>
                    <Text
                      tag={'span'}
                      className={`${styles.text}`}
                      children={'visit profile for rates'}
                    />
                  </div>
                }
              </div>
              {placeOfService &&
                <div className={styles.services}>
                  <LocationIcon />
                  <Text
                    tag={'span'}
                    className={`${styles.text}`}
                    children={placeOfService}
                  />
                </div>
              }
              <div className={styles.otherInfo}>
                {age &&
                  <Text
                    tag={'span'}
                    className={`${styles.text}`}
                    children={`Age ${age}`}
                  />
                }
                {dressSize &&
                  <Text
                    tag={'span'}
                    className={`${styles.text}`}
                    children={`Dress Size ${dressSize}`}
                  />
                }
              </div>
            </div>
          </div>
        </Link>
      }
    </div>
  )
};

export default ProviderCard;
