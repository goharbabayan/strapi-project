'use client'

import { useEffect, useState } from 'react';
import { useFetchData } from '@/app/utils/hooks/useFetch';
import ProfileMainInfo from '@/components/profileDetails/profileMainInfo/ProfileMainInfo';
import ProfileCoverPhoto from '@/components/profileDetails/profileCoverPhoto/ProfileCoverPhoto';
import Loading from '@/app/loading';
import styles from './provider.module.css';
import ProfileDetailsTabs from '@/components/profileDetails/profileDetailsTabs/ProfileDetailsTabs';
import ProfilePhotos from '@/components/profileDetails/profilePhotos/ProfilePhotos';
import PhotosIcon from '@/components/icons/PhotosIcon';
import AboutIcon from '@/components/icons/AboutIcon';
import RatesAndServicesIcon from '@/components/icons/RatesAndServicesIcon';
import WhenCanWeMeetIcon from '@/components/icons/WhenCanWeMeetIcon';
import SelfiesIcon from '@/components/icons/SelfiesIcon';
import ReviewsIcon from '@/components/icons/ReviewsIcon';
import ProfileAboutMe from '@/components/profileDetails/profileAboutMe/ProfileAboutMe';
import ProfileReviews from '@/components/profileReviews/ProfileReviews';
import ProfileRatesAndServices from '@/components/profileDetails/profileRatesAndServices/ProfileRatesAndServices';
import WhenCanWeMeetComponent from '@/components/profileDetails/whenCanWeMeetComponent/WhenCanWeMeetComponent';

export default function Provider () {
  const [loader, setLoader] = useState(true);
  const [providerData, setProviderData] = useState([]);
  const [activeTabId, setActiveTabId] = useState(0);
  const [providerId, setProviderId] = useState(null);

// ToDo: should be changed to get the user info from username not user id
  useEffect(() => {
    const searchParams = new URLSearchParams(document.location.search);
    const providerId = searchParams.get('id');

    useFetchData(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${providerId}?populate=*`, {
      method: 'GET'
    }).then((data) => {
      setProviderData(data);
      setLoader(false);
      setProviderId(providerId);
    })
  }, []);

  const providerPersonalInfo = [
    {
      label: 'Location',
      data: providerData?.city,
    },
    {
      label: 'Age',
      data: providerData?.age,
    },
    {
      label: 'Eyes',
      data: providerData?.eyeColor,
    },
    {
      label: 'Hair',
      data: providerData?.hairColor,
    },
    {
      label: 'Bust size',
      data: providerData?.bust,
    },
    {
      label: 'Place of service',
      data: providerData?.placeOfService
    },
    {
      label: 'Height',
      data: providerData?.height
    },
    {
      label: 'Dress size',
      data: providerData?.dressSize
    },
    {
      label: 'Body type',
      data: providerData?.bodyType
    },
    {
      label: 'Gender',
      data: providerData?.gender
    },
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
    },
    {
      id: 5,
      label: 'Reviews',
      icon: ReviewsIcon
    }
  ]

  return (
    <>
      {
        loader ? <Loading />
        : <div className={styles.providerPageContainer}>
          <ProfileCoverPhoto
            coverPhotoUrl={providerData?.coverPhoto?.url}
            coverPhotoName={providerData?.coverPhoto?.name}
          />
          <ProfileMainInfo
            profilePhoto={providerData?.profilePicture?.url}
            profilePhotoName={providerData?.profilePicture?.name}
            profileProviderFullName={{
              name: providerData?.name,
              lastname: providerData?.lastName,
            }}
            profileProviderPersonalInfo={providerPersonalInfo}
            providerContactInfo={{
              email: providerData?.email,
              phone: providerData?.phoneNumber
            }}
            provierSocialLinks={{
              instagram: providerData?.instagramLink,
              onlyFans: providerData?.onlyFansLink
            }}
            providerWebsiteLink={providerData?.websiteLink}
            providerId={providerId}
          />
          <ProfileDetailsTabs 
            profileDetailsTabsData={PROFILE_DETAILS_TABS}
            activeTabId={activeTabId}
            setActiveTabId={setActiveTabId}
          />
          {activeTabId === 0 && 
            <ProfilePhotos
              photos={providerData?.photos}
            />
          }
          {activeTabId === 1 &&
            <ProfileAboutMe
              aboutMeDescription={providerData?.aboutMe}
              providerCostumes={providerData?.costume}
              providerMakeup={providerData?.makeup}
              providerOutfits={providerData?.outfits}
              providerExtraOptions={providerData?.extras}
            />
          }
          {activeTabId === 2 &&
            <ProfileRatesAndServices
              incallRates={providerData?.incallRates}
              outcallRates={providerData?.outcallRates}
              services={providerData?.services}
            />
          }
          {activeTabId === 3 &&
            <WhenCanWeMeetComponent
              username={providerData?.username}
              schedule={providerData?.schedule}
              additionalInfo={providerData?.additionalInfo}
            />
          }
          {activeTabId === 4 &&
            <ProfilePhotos
              photos={providerData?.selfies}
            />
          }
          {activeTabId === 5 &&
            <ProfileReviews
              reviews={providerData?.reviews}
              providerId={providerId}
            />
          }
        </div>
      }
    </>
  )
}
