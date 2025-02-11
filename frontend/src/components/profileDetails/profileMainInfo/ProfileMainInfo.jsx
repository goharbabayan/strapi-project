'use client'

import Image from '@/components/image/Image';
import styles from './profileMainInfo.module.css';
import ProfileContactInfo from '../profileContactInfo/ProfileContactInfo';
import CopyLinkButton from '../copyLinkButton/CopyLinkButton';
import EmptyStarIcon from '@/components/icons/EmptyStarIcon';
import React, { Fragment, useEffect, useState } from 'react';
import { useFetchData } from '@/app/utils/hooks/useFetch';
import StarIcon from '@/components/icons/StarIcon';
import { useContext } from 'react';
import { AuthContext } from '@/app/Context';
import { CLIENT } from '@/app/utils/constants/userRoles';
import UploadIcon from '@/components/icons/UploadIcon';
import { checkHasProfileInfoErroros, getVerificationBadge, getVerificationBadgeText, uploadImageWithWatermark } from '@/app/utils/helpers';
import Text from '@/components/text/Text';
import GoldenBadge from '@/components/icons/badges/GoldenBadge';
import SilverBadge from '@/components/icons/badges/SilverBadge';
import BronzeBadge from '@/components/icons/badges/BronzeBadge';
import SwitchButton from '@/components/switchButton/SwitchButton';
import EditContentIcon from '@/components/icons/EditContent';
import Loading from '@/app/loading';
import IconOnline from '@/components/iconOnline';

export default function ProfileMainInfo(props) {
  const {
    profilePhoto,
    profilePhotoName,
    profileProviderFullName,
    profileProviderPersonalInfo,
    providerContactInfo,
    provierSocialLinks,
    providerWebsiteLink,
    providerId,
    hideStarIcon,
    showUploadIcon,
    isDashboardPage,
    showEditIcon,
    editButtonText,
    token,
    verificationStatus,
    profileIsAvialabile,
    profileDigitalService,
    isForManagerEscort,
    isProfileReviewPage,
    onChanges,
    onEditProfileInfoButtonClick,
    errors,
  } = props;

  const {loggedInUserData} = useContext(AuthContext);
  const [findFromFavoritesResponse, setFindFromFavoritesResponse] = useState(null);
  const [isSwitchOn, setIsSwitchOn] = useState(profileIsAvialabile);
  const [hasProfileInfoErrors, setHasProfileInfoErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSwitch = () => {
    setIsSwitchOn((prev) => !prev);
    onChanges('availableNow', !profileIsAvialabile)
  };

  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  useEffect(() => {
    loggedInUserData?.role === CLIENT.type && isProviderExistingInClientsFavorites();
  }, []);

  useEffect(() => {
    setHasProfileInfoErrors(checkHasProfileInfoErroros(errors));
  }, [errors]);

  const fetchData = async (action, endpoint) => {
    // To do get token from Context
    const token = JSON.parse(localStorage.getItem('token'));
    if (!token || !providerId || !loggedInUserData?.id) return;
    let data = {
      providerId: providerId,
      clientId: loggedInUserData?.id,
    };
    if (action === 'add') {
      data = {
        ...data,
        favoriteProvidersIds: findFromFavoritesResponse?.favoriteProvidersIds
      }
    };

    const res = await useFetchData(`${baseUrl}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Authorization': `Bearer ${token}`
      },
    })
    if (res.error) {
      setFindFromFavoritesResponse(false);
    } else {
      setFindFromFavoritesResponse(res);
    };
  };

  const isProviderExistingInClientsFavorites = () => {
    fetchData('find', '/api/user/findFromFavorites');
  };

  const handleAddToFavorites = () => {
    fetchData('add', '/api/user/addToFavorites');
  };

  const handleUploadImage = async (e) => {
    setIsLoading(true);
    const watermarkedImages = await uploadImageWithWatermark(e, token, false);
    if (watermarkedImages) {
      setIsLoading(false);
      onChanges('profilePicture', watermarkedImages[0]);
    };
  };

  return (
    <>
      <div className='page-width'>
        <div className={styles.profileInfoContainer}>
          <div className={styles.profilePhotoContainer}>
            {loggedInUserData?.role === CLIENT.type && !hideStarIcon &&
              <>
                {findFromFavoritesResponse?.isProviderExistingInClientFavorites
                  ?
                    <StarIcon
                      className={styles.providerFavoriteIcon}
                    />
                  :
                    <EmptyStarIcon
                      className={styles.providerFavoriteIcon}
                      onClick={handleAddToFavorites}
                    />
                }
              </>
            }
            {isLoading
              ?
                <div className={styles.emptyImageWrapper}>
                  <Loading/>
                </div>
              :
                <>
                  {profilePhoto
                    ?
                      <div className={styles.imageWrapper}>
                        <Image
                          src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${profilePhoto}`}
                          alt={profilePhotoName || 'profile photo'}
                          width={320}
                          height={440}
                          VerificationIcon={getVerificationBadge(verificationStatus)}
                          showVerificationBadge={true}
                          verificationBadgeText={getVerificationBadgeText(verificationStatus)}
                        />
                        {!isDashboardPage && profileIsAvialabile &&
                          <div className={styles.available}>
                            <IconOnline/>
                            <Text
                              children={'Available now'}
                              tag={'span'}
                              className={styles.badge}
                            />
                          </div>
                        }
                        {showUploadIcon &&
                          <div>
                            <input
                              type='file'
                              id='profilePicture'
                              name='profilePicture'
                              accept='image/*'
                              className={'hidden'}
                              onChange={(e) => handleUploadImage(e)}
                            />
                            <label
                              htmlFor='profilePicture'
                              className={styles.editProfilePictureButton}
                            >
                              <UploadIcon
                                strokeColor={`var(--color-main)`}
                                className={styles.iconUpload}
                              />
                            </label>
                            {showEditIcon &&
                              <div className={`${styles.editButtonMobile}`} onClick={onEditProfileInfoButtonClick}>
                                <EditContentIcon/>
                              </div>
                            }
                          </div>
                        }
                      </div>
                    :
                      <div className={`${styles.emptyImageWrapper} ${errors && errors?.profilePicture ? styles.invalidBorder : ''}`}>
                        <div className={`${styles.emptyImageContainer}`}>
                          <Text
                            tag={'span'}
                            className={`${styles.uploadText} ${errors && errors?.profilePicture ? styles.invalidText : ''}`}
                            children={'Upload your profile picture'}
                          />
                          <div>
                            <input
                              type='file'
                              id='profilePicture'
                              name='profilePicture'
                              accept='image/*'
                              className={'hidden'}
                              onChange={(e) => handleUploadImage(e)}
                            />
                            <label
                              htmlFor='profilePicture'
                              className={styles.editButtonEmptyState}
                            >
                              <UploadIcon
                                strokeColor={`var(--color-main)`}
                              />
                              <Text
                                tag={'span'}
                                className={styles.editButtonText}
                                children={'Upload profile picture'}
                              />
                            </label>
                          </div>
                        </div>
                        {showEditIcon &&
                          <div className={`${styles.emptyEditButtonMobile}`} onClick={onEditProfileInfoButtonClick}>
                            <EditContentIcon/>
                              
                          </div>
                        }
                      </div>
                  }
                </>
            }
          </div>
          <div className={styles.profileInfoWrapper}>
            {showEditIcon &&
              <div className={`${!profilePhoto ? styles.emptyEditButton : styles.editButton} ${hasProfileInfoErrors ? styles.invalidBorder : ''}`} onClick={onEditProfileInfoButtonClick}>
                <EditContentIcon fillColor={`${hasProfileInfoErrors ? 'var(--red-r5)' : 'var(--color-main)'}`}/>
                  {editButtonText &&
                    <Text
                      tag={'span'}
                      className={`${styles.editText} ${hasProfileInfoErrors ? styles.invalidText : ''}`}
                      children={editButtonText}
                    />
                  }
              </div>
            }
            <div className={`${styles.profileFullNameAndAvailability} ${isDashboardPage ? styles.isDashboardPage : ''}`}>
              {profileProviderFullName.name || profileProviderFullName.lastname
                ?
                  <Text
                    tag={'h3'}
                    className={`${styles.profileFullName} ${(isForManagerEscort || isProfileReviewPage )? styles.fullWidth : ''}`}
                    children={`${profileProviderFullName.name} ${profileProviderFullName.lastname}`}
                  />
                :
                  <Text
                    tag={'h3'}
                    className={styles.profileFullName}
                    children={`Name Lastname`}
                  />
              }
              {isDashboardPage && !isForManagerEscort &&
                <SwitchButton
                  isOn={isSwitchOn}
                  handleToggle={toggleSwitch}
                  label={'Available now *'}
                />
              }
             {!isDashboardPage && profileDigitalService && profileDigitalService === 'true' &&
                <div className={styles.digitalService}>
                  <Text
                    tag={'span'}
                    className={styles.digitalText}
                    children={`Digital service`}
                  />
                </div>
              }
            </div>
            <div className={styles.profileInfoTextContainer}>
              {profileProviderPersonalInfo.map((infoItem, index) => {
                  return (
                    <Fragment key={index}>
                      {infoItem.data &&
                        <div className={styles.profileInfoItems}>
                          <span className={styles.profileInfoLabel}>
                            {infoItem.label}
                          </span>
                          <span className={styles.profileInfoData}>
                            {infoItem.data}
                          </span>
                        </div>
                      }
                    </Fragment>
                  )
                })
              }
            </div>
            <div className={styles.providerContactInfo}>
              <ProfileContactInfo
                providerContactInfo={providerContactInfo}
                providerSocialLinks={provierSocialLinks}
                providerWebsiteLink={providerWebsiteLink}
              />
            </div>
            <CopyLinkButton />
          </div>
        </div>
      </div>
    </>
  )
}
