'use client'

import { useContext, useEffect, useState } from 'react';
import { useFetchData } from '@/app/utils/hooks/useFetch';
import ProfileMainInfo from '@/components/profileDetails/profileMainInfo/ProfileMainInfo';
import ProfileCoverPhoto from '@/components/profileDetails/profileCoverPhoto/ProfileCoverPhoto';
import Loading from '@/app/loading';
import styles from './provider.module.css';
import ProfileDetailsTabs from '@/components/profileDetails/profileDetailsTabs/ProfileDetailsTabs';
import ProfilePhotos from '@/components/profileDetails/profilePhotos/ProfilePhotos';
import ProfileAboutMe from '@/components/profileDetails/profileAboutMe/ProfileAboutMe';
import ProfileReviews from '@/components/profileReviews/ProfileReviews';
import ProfileRatesAndServices from '@/components/profileDetails/profileRatesAndServices/ProfileRatesAndServices';
import WhenCanWeMeetComponent from '@/components/profileDetails/whenCanWeMeetComponent/WhenCanWeMeetComponent';
import { fetchUserRatesAndServices } from '@/app/utils/helpers';
import { USER_PROFILE_DATA } from '@/app/utils/constants/userProfileData';
import { PROFILE_DETAILS_TABS } from '@/app/utils/constants/profileDetailsPageTabs';

export default function Provider () {
  const [loader, setLoader] = useState(true);
  const [providerData, setProviderData] = useState([]);
  const [providerRatesAndServices, setProviderRatesAndServices] = useState({
    services: [],
    incall: [],
    outcall: [],
  });
  const [activeTabId, setActiveTabId] = useState(0);
  const [providerId, setProviderId] = useState(null);

// ToDo: should be changed to get the user info from username not user id
  useEffect(() => {
    const fetchData = async () => {
      const searchParams = new URLSearchParams(document.location.search);
      const providerId = searchParams.get('id');

      useFetchData(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${providerId}?populate=*`, {
        method: 'GET'
      }).then((data) => {
        setProviderData(data);
        setLoader(false);
        setProviderId(providerId);
        fetchRatesAndServicesData(data.username);
      })
    };

    fetchData();
  }, []);

  const fetchRatesAndServicesData = async (username) => {
    const ratesAndServicesData = await fetchUserRatesAndServices(null,username);
    setProviderRatesAndServices(ratesAndServicesData);
  };

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
            profileIsAvialabile={providerData?.availableNow}
            profileDigitalService={providerData?.digitalService}
            profileProviderPersonalInfo={USER_PROFILE_DATA(providerData)}
            providerContactInfo={{
              email: (providerData?.managerID && providerData?.managerID !== '') ? providerData?.managerEscortEmail : providerData?.email,
              phone: providerData?.phoneNumber
            }}
            provierSocialLinks={{
              instagram: providerData?.instagramLink,
              onlyFans: providerData?.onlyFansLink
            }}
            providerWebsiteLink={providerData?.websiteLink}
            providerId={providerId}
            verificationStatus={providerData?.verificationStatus}
            isDashboardPage={false}
          />
          <ProfileDetailsTabs
            profileDetailsTabsData={PROFILE_DETAILS_TABS}
            activeTab={activeTabId}
            setActiveTab={setActiveTabId}
            isMenuTabs={true}
            hideMainWrapperBorders={true}
          />
          {activeTabId === 0 &&
            <ProfilePhotos
              photos={providerData?.photos}
            />
          }
          {activeTabId === 1 &&
            <ProfileAboutMe
              aboutMeDescription={providerData?.aboutMe}
              providerGlam={providerData?.glam}
              providerCloset={providerData?.closet}
              providerExtraOptions={providerData?.extras}
            />
          }
          {activeTabId === 2 &&
            <ProfileRatesAndServices
              incall={providerRatesAndServices?.incall}
              outcall={providerRatesAndServices?.outcall}
              services={providerRatesAndServices?.services}
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
