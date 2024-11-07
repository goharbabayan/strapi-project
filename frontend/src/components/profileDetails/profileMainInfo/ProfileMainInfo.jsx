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

export default function ProfileMainInfo(props) {
  const {loggedInUserData} = useContext(AuthContext);
  const [isUserExistingInFavorites,setIsUserExistingInFavorites] = useState(false);

  const {
    profilePhoto,
    profilePhotoName,
    profileProviderFullName,
    profileProviderPersonalInfo,
    providerContactInfo,
    provierSocialLinks,
    providerWebsiteLink,
    providerId
  } = props;

  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  useEffect(() => {
    loggedInUserData && loggedInUserData.role === 'client' && isProviderExistingInClientsFavorites();
  }, []);

  const fetchData = async (endpoint, setState) => {
    const token = JSON.parse(localStorage.getItem('token'));
    const data = {
      providerId: providerId,
      clientId: loggedInUserData?.id,
    };
    const res = await useFetchData(`${baseUrl}${endpoint}`, {
      method: 'Post',
      body: JSON.stringify(data),
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
    res && setState(res);
  };

  const isProviderExistingInClientsFavorites = () => {
    fetchData('/api/user/findFromFavorites', setIsUserExistingInFavorites);
  };

  const handleAddToFavorites = () => {
    fetchData('/api/user/addToFavorites', setIsUserExistingInFavorites);
  };

  return (
    <>
      <div className='page-width'>
        <div className={styles.profileInfoContainer}>
          <div className={styles.profilePhotoContainer}>
            {isUserExistingInFavorites
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
            <Image
              src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${profilePhoto}`}
              alt={profilePhotoName || 'profile photo'}
              width={320}
              height={440}
            />
          </div>
          <div className={styles.profileInfoWrapper}>
            <h3 className={styles.profileFullName}>
              {profileProviderFullName.name} {profileProviderFullName.lastname}
            </h3>
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
