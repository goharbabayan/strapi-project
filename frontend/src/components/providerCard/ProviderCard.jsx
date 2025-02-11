import {useState, useEffect } from 'react';
import styles from './providerCard.module.css';
import LocationIcon from  '../icons/LocationIcon';
import DollarIcon from '../icons/DollarIcon';
import Link from 'next/link';
import Text from '../text/Text';
import Image from '../image/Image';
import StarIcon from '../icons/StarIcon';
import { SERVICE_PROVIDER } from '@/app/utils/constants/userRoles';
import { getVerificationBadge, getVerificationBadgeText } from '@/app/utils/helpers';
import IconOnline from '../iconOnline';
import SwitchButton from '../switchButton/SwitchButton';
import Button from '../button/Button';
import ArrowRight from '../icons/ArrowRight';
import RemoveIcon from '../icons/RemoveIcon';
import IconVerified from '../icons/Verified';

const ProviderCard = ({
  provider,
  showBadge,
  badge,
  count,
  roleType,
  showStarIcon,
  onStarIconClick,
  onChanges,
  isManagerEscort,
  onVisitProfileButtonClick,
  onRemoveIconClick,
  hideVerificationBadge,
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
    availableNow,
    digitalService,
  } = provider;

  const {
    name: imageName,
    alternativeText,
    height: imageHeight,
    width: imageWidth,
    url
  } = profilePicture?.data?.attributes || profilePicture || {};

  const cardWidth = count && count === 3 ? '33.3%' : count && count === 4 ? '25%' : '100%';
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const VerififcationIcon = getVerificationBadge(verificationStatus);
  const verificationBadgeText = getVerificationBadgeText(verificationStatus);

  const [isSwitchOn, setIsSwitchOn] = useState(availableNow);

  useEffect(() => {
    getVerificationBadge();
    (incall || outcall) && setHourlyRate(findLowestCost(incall, outcall));
  }, [incall, outcall]);

  const toggleSwitch = () => {
    setIsSwitchOn((prev) => !prev);
    onChanges('availableNow', !availableNow, username)
  };

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
      {isManagerEscort ?
        <div
          className={`${styles.card} ${styles.managerEscortCard} ${count ? styles.hasCount : ''}`}
          style={{ '--provider-card-width': `${cardWidth}`}}
        >
          <div className={styles.managerEscortCardWrapper}>
            <div className={`${styles.profilePicture} ${!profilePicture ? styles.emptyImage : ''}`} style={{'--ratio-percent':  '126%'}}>
              {profilePicture &&
                <div className={`${styles.imageWrapper}`}>
                  <Image
                    src={`${baseUrl}${url}`}
                    alt={alternativeText || imageName}
                    width={369}
                    height={461}
                    providerCartAspectRatio={0.79}
                  />
                  {availableNow &&
                    <div className={styles.available}>
                      <IconOnline/>
                      <Text
                        children={'Available now'}
                        tag={'span'}
                        className={styles.badge}
                      />
                    </div>
                  }
                
                </div>
              }
              {!profilePicture &&
                <Text
                  tag={'span'}
                  className={styles.logoText}
                  children={'SNEAKY LINX'}
                />
              }
              {availableNow &&
                <div className={styles.available}>
                  <IconOnline/>
                  <Text
                    children={'Available now'}
                    tag={'span'}
                    className={styles.badge}
                  />
                </div>
              }
            </div>
            <div className={styles.managerEscortInfo}>
              <div className={styles.wrapper}>
                <Text
                  tag={'h4'}
                  className={`${styles.fullname}`}
                  children={`${name} ${lastName}`}
                />
                <div className={styles.availabilitySwithButton}>
                  <SwitchButton
                    isOn={isSwitchOn}
                    handleToggle={toggleSwitch}
                    label={'Available now'}
                  />
                </div>
                
              </div>
            
              <div className={styles.wrapper}>
                <Button
                  type={'button'}
                  variant={'secondary'}
                  onClick={onVisitProfileButtonClick}
                  className={`${styles.visitProfileButton} ${styles.button}`}
                  children={'Visit profile'}
                  IconAfterText={<ArrowRight color={'var(--color-main)'}/>}
                />
                <RemoveIcon
                  color={'var(--color-main)'}
                  onClick={() => onRemoveIconClick(id)}
                  className={styles.button}
                />
              </div>
            </div>
          </div>
          {isApprovedByAdmin &&
            <div className={styles.verifiedIconContainer}>
              <IconVerified className={styles.verifiedIcon}/>
            </div>
          }
          {!hideVerificationBadge && VerififcationIcon && verificationBadgeText &&
            <div className={styles.verificationBadgeContainer} style={{'--verification-badge-text': `"${verificationBadgeText}"`}}>
              {VerififcationIcon}
            </div>
          }
        </div>
      : <></>
    }
    {roleType === SERVICE_PROVIDER.type && isApprovedByAdmin && !isManagerEscort &&
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
                <div className={styles.imageWrapper}>
                  <Image
                    src={`${baseUrl}${url}`}
                    alt={alternativeText || imageName}
                    width={imageWidth}
                    height={imageHeight}
                    providerCartAspectRatio={0.70}
                    className={styles.image}
                  />
                  {availableNow &&
                    <div className={styles.available}>
                      <IconOnline/>
                      <Text
                        children={'Available now'}
                        tag={'span'}
                        className={styles.badge}
                      />
                    </div>
                  }
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
                  {digitalService && digitalService === 'true' &&
                    <div className={`${styles.digitalService}`}>
                      <Text
                        tag={'span'}
                        className={` ${styles.digitalServiceText}`}
                        children={'Digital services available'}
                      />
                    </div>
                  }
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
        {!hideVerificationBadge && VerififcationIcon &&
          <div className={styles.verificationBadgeContainer} style={{'--verification-badge-text': `"${verificationBadgeText}"`}}>
            {VerififcationIcon}
          </div>
        }
      </div>
      }
    </>
  )
};

export default ProviderCard;
