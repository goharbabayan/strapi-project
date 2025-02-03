import {useState, useEffect } from 'react';
import styles from './providerCard.module.css';
import LocationIcon from  '../icons/LocationIcon';
import DollarIcon from '../icons/DollarIcon';
import Link from 'next/link';
import Text from '../text/Text';
import Image from '../image/Image';
import StarIcon from '../icons/StarIcon';
import { SERVICE_PROVIDER } from '@/app/utils/constants/userRoles';
import { getVerificationBadge } from '@/app/utils/helpers';

const ProviderCard = ({
  provider,
  showBadge,
  badge,
  count,
  roleType,
  showStarIcon,
  onStarIconClick,
}) => {
  if (!provider) return;
  const [hourlyRate, setHourlyRate] = useState(null);
  const {
    id,
    username,
    name,
    lastName,
    profilePicture,
    placeOfService,
    age,
    dressSize,
    incall,
    outcall,
    isApprovedByAdmin,
    verificationStatus,
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
    getVerificationBadge();
    (incall || outcall) && setHourlyRate(findLowestCost(incall, outcall));
  }, [incall, outcall]);

  const findLowestCost = (incall, outcall) => {
    const getPriceForOneHour = (categories) => {
      if (!categories) return null;
      for (const category of ['general', 'GFE', 'PSE']) {
        if (categories[category]) {
          for (const rate of categories[category]) {
            if (rate.duration?.trim() === '1 hour') {
              return rate.price;
            };
          };
        };
      };
      return null;
    };

    return getPriceForOneHour(incall) || getPriceForOneHour(outcall) || null;
  };

  return (
    <>
    {roleType === SERVICE_PROVIDER.type && isApprovedByAdmin &&
      <div
        className={`${styles.card} ${count ? styles.hasCount : ''}`}
        style={{ '--provider-card-width': `${cardWidth}`}}
      >
        {profilePicture && url &&
          <Link
            className={styles.link}
            href={`/provider/${username}?id=${id}`}
          >
            <div className={styles.mainWrap}>
              {showBadge && badge &&
                <div className={styles.badgeContainer}>
                  <span className={styles.badge}>{badge}</span>
                </div>
              }
              {showStarIcon &&
                <StarIcon className={styles.starIcon} onClick={(e) => onStarIconClick(e, id)}/>
              }
              {url &&
                <Image
                  src={`${baseUrl}${url}`}
                  alt={alternativeText || imageName}
                  width={imageWidth}
                  height={imageHeight}
                  providerCartAspectRatio={0.70}
                  className={styles.image}
                  showVerificationBadge={true}
                  VerificationIcon={getVerificationBadge(verificationStatus)}
                />
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
      }
    </>
  )
};

export default ProviderCard;
