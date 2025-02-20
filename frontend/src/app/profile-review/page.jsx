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
import { fetchUserRatesAndServices, getUserPendingFieldsNames, transformUserWithPendingOverrides, upgradeVerificationStatus } from '../utils/helpers';
import { USER_PROFILE_DATA } from '../utils/constants/userProfileData';
import { PROFILE_DETAILS_TABS } from '../utils/constants/profileDetailsPageTabs';
import Loading from '../loading';
import ProfileReviews from '@/components/profileReviews/ProfileReviews';

export default function ProfileReview() {
  const [loader, setLoader] = useState(true);
  const [user, setUser] = useState(null);
  const [requestedFieldsToChange, setRequestedFieldsToChange] = useState({
    show: false,
    requestedFieldsNames: null,
  });
  const [showButtons, setShowButtons] = useState(false);
  const [showRequestIsProcessedText, setShowRequestIsProcessedText] = useState(false);
  const [showPageContent, setShowPageContent] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [activeTabId, setActiveTabId] = useState(0);
  const [requestInfo, setRequestInfo] = useState({
    type: '',
    title: '',
  });
  const searchParams = useSearchParams();
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const token = searchParams.get('token');
  const userId = searchParams.get('userId');
  const requestType = searchParams.get('action');

  useEffect(() => {
    if (token) {
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
          setLoader(false);
          const userData = Array.isArray(data) ? data[0] : data;
          fetchUserWithRatesAndServices(userData, userData.id);
        }
      })
      .catch(err => console.log('err', err))

    } else {
      navigate('/');
    };

    if (requestType === 'data_change') {
      setRequestInfo({
        type: 'dataChange',
        title: `The provider's profile has been updated and requires your review.`,
      });
    } else if (requestType === 'verification_upgrade') {
      setRequestInfo({
        type: 'verificationUpgrade',
        title: 'The provider has requested for verification status level upgrade.',
      });
    } else if (requestType === 'get_verification') {
      setRequestInfo({
        type: 'verification',
        title: 'Provider has submitted a request for profile verification ',
      });
    };
  }, [])

  useEffect(() => {
    if (requestedFieldsToChange.requestedFieldsNames) {
      setShowButtons(true);
    }
  }, [requestedFieldsToChange]);

  const fetchUserWithRatesAndServices = async (userData, userId) => {
    const ratesAndServicesData = await fetchUserRatesAndServices(null, null, userId);
    if(!ratesAndServicesData) setUser(userData);
    if (requestType === 'data_change') {
      const transformedUser = transformUserWithPendingOverrides({...userData, ...ratesAndServicesData}, userData.pendingData)
      const fieldsNames = getUserPendingFieldsNames(userData.pendingData);
      setRequestedFieldsToChange({
        requestedFieldsNames: fieldsNames || null,
        show: true,
      });
      setUser(transformedUser);
    } else if (requestType === 'get_verification' && userData?.isApprovedByAdmin === true) {
      setShowRequestIsProcessedText(true);
    } else {
      setShowPageContent(true);
      setShowButtons(true);
      setUser({...userData, ...ratesAndServicesData});
    };
  };

  const handleButtonClick = (action, requestType) => {
    action === 'decline' ? setIsApproved(false) : setIsApproved(true);
    let formData = {};
    const entriesToRemove = ['id', 'provider', 'confirmed', 'blocked', 'createdAt', 'updatedAt'];
    Object.keys(user).forEach(key => {
      if (!entriesToRemove.includes(key)) {
        formData[key] = user[key];
      }
    });
    let body = {};

    if (action === 'accept') {
      if (requestType === 'verification') {
        body = {
          formData,
          isApprovedByAdmin: true,
          verificationStatus: {hasBronzeBadge: true, hasSilverBadge: false, hasGoldBadge: false}
        };
      } else if (requestType === 'verificationUpgrade') {
        const upgradedVerificationStatus = upgradeVerificationStatus(user?.verificationStatus);
        body = {
          formData,
          verificationStatus: upgradedVerificationStatus,
        };
      } else if (requestType === 'dataChange') {
        body = {
          formData,
          adminApprovalDataChange: 'accept',
        };
      }
    } else if (action === 'decline' && requestType === 'dataChange') {
      body = {
        formData,
        adminApprovalDataChange: 'decline',
      };
    }

// update user data
    user && fetch(`${baseUrl}/api/users/${user.id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
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
  };

const {coverPhoto, profilePicture, managerProviderEmail,managerID, email, name, lastName, phoneNumber, instagramLink, onlyFansLink, websiteLink, verificationStatus, photos, aboutMe, experience, qualifications, username, schedule, additionalInfo, selfies, reviews, availableNow, digitalService, incall, outcall, services} = user || {};

  return (
    <>
      <div className={`${styles.mainWrap} page-width`}>
        {requestInfo?.title && (requestedFieldsToChange.requestedFieldsNames || showPageContent) &&
          <Text
            tag={'h4'}
            className={styles.heading}
            children={requestInfo?.title}
          />
        }
        {requestedFieldsToChange.show && (
          <Text tag="h2" className={styles.subtitle}>
            {requestedFieldsToChange.requestedFieldsNames ? (
              <>
                Changes are made in <span className={styles.bold}>{requestedFieldsToChange.requestedFieldsNames}</span>.
              </>
            ) : (
              `All changes have been reviewed and processed. No further approvals are needed at this time.`
            )}
          </Text>
        )}
        {showRequestIsProcessedText &&
          <Text
            tag="h2"
            className={styles.subtitle}
            children={`Profile verification request has already been accepted and processed.`}
          />
        }
        {showButtons &&
          <>
            <div className={styles.buttons}>
              <Button
                className={styles.button}
                onClick={() => handleButtonClick('accept', requestInfo?.type)}
                variant={'main'}
                children={`${requestType === 'data_change' ? 'Accept changes' : 'Accept'}`}
              />
              <Button
                href={`mailto:${user?.email}`}
                className={styles.button}
                onClick={() => handleButtonClick('decline', requestInfo?.type)}
                variant={'general'}
                children={'Decline'}
              />
            </div>
            <Text
              className={`${styles.message} ${showMessage ? styles.show : ''}`}
              tag={'h4'}
              children={isApproved ? 'Request accepted' : 'Request denied'}
            />
          </>
        }
      </div>
      {loader
        ?
          <Loading/>
        :
          <>
          {user && (requestedFieldsToChange.requestedFieldsNames || showPageContent) &&
            <div className={styles.pageContainer}>
              <ProfileCoverPhoto
                coverPhotoUrl={coverPhoto?.url}
                coverPhotoName={coverPhoto?.name}
              />
              <ProfileMainInfo
                profilePhoto={profilePicture?.url}
                profilePhotoName={profilePicture?.name}
                profileIsAvialabile={availableNow}
                profileDigitalService={digitalService}
                profileProviderFullName={{
                  name: name,
                  lastname: lastName,
                }}
                profileProviderPersonalInfo={USER_PROFILE_DATA(user)}
                providerContactInfo={{
                  email: managerID ? managerProviderEmail : email,
                  phone: phoneNumber
                }}
                provierSocialLinks={{
                  instagram: instagramLink,
                  onlyFans: onlyFansLink
                }}
                providerWebsiteLink={websiteLink}
                providerId={userId}
                verificationStatus={verificationStatus}
                isDashboardPage={false}
                isProfileReviewPage={true}
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
                  photos={photos}
                />
              }
              {activeTabId === 1 &&
                <ProfileAboutMe
                  aboutMeDescription={aboutMe}
                  providerExperience={experience}
                  providerQualifications={qualifications}
                />
              }
              {activeTabId === 2 &&
                <ProfileRatesAndServices
                  incall={incall}
                  outcall={outcall}
                  services={services}
                />
              }
              {activeTabId === 3 &&
                <WhenCanWeMeetComponent
                  username={username}
                  schedule={schedule}
                  additionalInfo={additionalInfo}
                  hideSubscribeNow={true}
                />
              }
              {activeTabId === 4 &&
                <ProfilePhotos
                  photos={selfies}
                />
              }
              {activeTabId === 5 &&
                <ProfileReviews
                  reviews={reviews}
                  providerId={userId}
                  hideAddReviewButton={true}
                />
              }
            </div>
          }
        </>
      }
    </>
  )
}
