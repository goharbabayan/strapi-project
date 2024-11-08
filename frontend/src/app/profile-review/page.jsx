'use client'

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './profile-review.module.css';
import { navigate } from '../actions.js';
import Button from '@/components/button/Button.jsx';
import Text from '@/components/text/Text';
import ProfileCoverPhoto from '@/components/profileDetails/profileCoverPhoto/ProfileCoverPhoto.jsx';
import ProfileMainInfo from '@/components/profileDetails/profileMainInfo/ProfileMainInfo.jsx';
import ProfileDetailsTabs from '@/components/profileDetails/profileDetailsTabs/ProfileDetailsTabs.jsx';
import ProfilePhotos from '@/components/profileDetails/profilePhotos/ProfilePhotos.jsx';
import ProfileAboutMe from '@/components/profileDetails/profileAboutMe/ProfileAboutMe.jsx';
import ProfileRatesAndServices from '@/components/profileDetails/profileRatesAndServices/ProfileRatesAndServices.jsx';
import WhenCanWeMeetComponent from '@/components/profileDetails/whenCanWeMeetComponent/WhenCanWeMeetComponent.jsx';
import PhotosIcon from '@/components/icons/PhotosIcon';
import AboutIcon from '@/components/icons/AboutIcon';
import RatesAndServicesIcon from '@/components/icons/RatesAndServicesIcon';
import WhenCanWeMeetIcon from '@/components/icons/WhenCanWeMeetIcon';
import SelfiesIcon from '@/components/icons/SelfiesIcon';

export default function ProfileReview() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [activeTabId, setActiveTabId] = useState(0);
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  const providerPersonalInfo = [
    {
      label: 'Location',
      data: user?.city,
    },
    {
      label: 'Age',
      data: user?.age,
    },
    {
      label: 'Eyes',
      data: user?.eyeColor,
    },
    {
      label: 'Hair',
      data: user?.hairColor,
    },
    {
      label: 'Bust size',
      data: user?.bust,
    },
    {
      label: 'Place of service',
      data: user?.placeOfService
    },
    {
      label: 'Height',
      data: user?.height
    },
    {
      label: 'Dress size',
      data: user?.dressSize
    },
    {
      label: 'Body type',
      data: user?.bodyType
    }
  ];

  const PROFILE_DETAILS_TABS = [
    {
      id: 0,
      label: 'Photos',
      icon: PhotosIcon,
    },
    {
      id: 1,
      label: 'About',
      icon: AboutIcon
    },
    {
      id: 2,
      label: 'Rates & Services',
      icon: RatesAndServicesIcon
    },
    {
      id: 3,
      label: 'When can we meet',
      icon: WhenCanWeMeetIcon
    },
    {
      id: 4,
      label: 'Selfies',
      icon: SelfiesIcon
    }
  ]
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');
    setToken(token);
    token
      ?
        fetch(`${baseUrl}/api/users?filters[id][$eq]=${userId}&populate=*`, {
          method: 'GET',
          headers: {
            'authorization': `Bearer ${token}`
          }
        })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            // the token is expired need to login again to update existing token;
            // navigate('/login');
          } else {
            Array.isArray(data) ? setUser(data[0]) : setUser(data);
          }
        })
        .catch(err => console.log('err', err))
      :
        navigate('/');
  }, [])

  const handleButtonClick = (action) => {
    action === 'decline' ? setIsApproved(false) : setIsApproved(true);
    let formData = {};
    const entriesToRemove = ['id', 'provider', 'confirmed', 'blocked', 'createdAt', 'updatedAt'];
    Object.keys(user).forEach(key => {
      if (!entriesToRemove.includes(key)) {
        formData[key] = user[key];
      }
    });

    user && fetch(`${baseUrl}/api/users/${user.id}`, {
      method: 'PUT',
      body: JSON.stringify({formData, isApprovedByAdmin: action === 'decline' ? false : true}),
      headers: {
        'Content-type': 'application/json',
        'authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.errors) {
          console.error('Errors:', data.errors)
        } else {
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false);
          }, 5000)
        }
      });
  }
  
  return (
    <div className={`${styles.mainWrap} page-width`}>
      <Text
        tag={'h2'}
        className={styles.heading}
        children={'Profile review'}
      />
      <div className={styles.buttons}>
        <Button
          className={`button_main ${styles.button}`}
          onClick={() => handleButtonClick('accept')}
        >
          Accept
        </Button>
        <Button
          href={`mailto:${user?.email}`}
          className={`button_general ${styles.button}`}
          onClick={() => handleButtonClick('decline')}
        >
          Decline
        </Button>
      </div>
      <Text
        className={`${styles.message} ${showMessage ? styles.show : ''}`}
        tag={'h4'}
        children={isApproved ? 'Request accepted' : 'Request denied'}
      />
      <div className={styles.providerPageContainer}>
        <ProfileCoverPhoto
          coverPhotoUrl={user?.coverPhoto?.url}
          coverPhotoName={user?.coverPhoto?.name}
        />
        <ProfileMainInfo
          profilePhoto={user?.profilePicture?.url}
          profilePhotoName={user?.profilePicture?.name}
          profileProviderFullName={{
            name: user?.name,
            lastname: user?.lastName,
          }}
          profileProviderPersonalInfo={providerPersonalInfo}
          providerContactInfo={{
            email: user?.email,
            phone: user?.phoneNumber
          }}
          provierSocialLinks={{
            instagram: user?.instagramLink,
            onlyFans: user?.onlyFansLink
          }}
          providerWebsiteLink={user?.websiteLink}
          providerId={user?.id}
          hideStarIcon={true}
        />
        <ProfileDetailsTabs
          profileDetailsTabsData={PROFILE_DETAILS_TABS}
          activeTabId={activeTabId}
          setActiveTabId={setActiveTabId}
        />
        {activeTabId === 0 && 
          <ProfilePhotos
            photos={user?.photos}
          />
        }
        {activeTabId === 1 &&
          <ProfileAboutMe
            aboutMeDescription={user?.aboutMe}
            providerCostumes={user?.costume}
            providerMakeup={user?.makeup}
            providerOutfits={user?.outfits}
            providerExtraOptions={user?.extras}
          />
        }
        {activeTabId === 2 &&
          <ProfileRatesAndServices
            incallRates={user?.incallRates}
            outcallRates={user?.outcallRates}
            services={user?.services}
          />
        }
        {activeTabId === 3 &&
          <WhenCanWeMeetComponent
            username={user?.username}
            schedule={user?.schedule}
            additionalInfo={user?.additionalInfo}
            showSubscribeNow={false}
          />
        }
        {activeTabId === 4 &&
          <ProfilePhotos
            photos={user?.selfies}
          />
        }
      </div>
    </div>
  )
}
