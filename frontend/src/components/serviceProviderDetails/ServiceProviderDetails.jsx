'use client'

import { useEffect, useState } from 'react';
import { useFetchData } from '@/app/utils/hooks/useFetch';
import { USER_FORM, USER_FORM_WITH_DATA, USER_REQUIRED_FIELDS } from '@/app/utils/constants/userForm';
import ProfileMainInfo from '@/components/profileDetails/profileMainInfo/ProfileMainInfo';
import ProfileCoverPhoto from '@/components/profileDetails/profileCoverPhoto/ProfileCoverPhoto';
import Loading from '@/app/loading';
import styles from './serviceProviderDetails.module.css';
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
import Text from '../text/Text';
import Button from '../button/Button';
import { ESCORT_DASHBOARD_PAGE_TABS } from '@/app/utils/constants/dashboardPageTabs';
import ProfileInfoEditForm from '../profileEditForm/ProfileEditForm';
import ResetPassword from '../resetPassword/ResetPassword';
import { ADMIN_APPROVAL_FIELDS } from '@/app/utils/constants/userAdminApprovalFields';
import Modal from '../modal/Modal';
import { checkIsAdminApprovalField, checkIsRequiredField, generateTextFromArray, transformUserWithPendingOverrides } from '@/app/utils/helpers';
import { MANAGER } from '@/app/utils/constants/userRoles';
import { validateRequiredFieldValue } from '@/app/utils/validation';
import InfoIcon from '../icons/Info';
import ErrorInfo from '../errorInfo/ErrorInfo';
import { USER_PROFILE_DATA } from '@/app/utils/constants/userProfileData';

export default function ServiceProviderDetails ({
  user,
  originalUser,
  currentUserWithoutPendingChanges,
  token,
  hideTabs,
  updateUser,
  updateUserPendingOvverridesAndSubmitUserData,
  updateUserPendingOverrides,
  discardUserPendingOverrides,
  discardChanges,
  confirmAdminApprovalFieldsChanges,
  submitData,
  matchUserAndOriginalUserData,
  isVerified,
  role,
  userId,
  approvalFieldsInfo,
  unsavedChanges,
  errors,
  setErrors,
}) {
  
  const [loader, setLoader] = useState(false);
  const [generalActiveTabId, setGeneralActiveTabId] = useState('account');
  const [menuActiveTabId, setMenuActiveTabId] = useState(0);
  const [showAdminApprovalDataChangeConfirmationModal, setShowAdminApprovalDataChangeConfirmationModal] = useState(false);

  const PROFILE_DETAILS_TABS = [
    {
      id: 0,
      label: 'Photos',
      name: 'photos',
      icon: PhotosIcon,
    },
    {
      id: 1,
      label: 'About',
      name: 'aboutMe',
      icon: AboutIcon
    },
    {
      id: 2,
      label: 'Rates & Services',
      name: 'services',
      icon: RatesAndServicesIcon
    },
    {
      id: 3,
      label: 'When can we meet',
      name: 'schedule',
      icon: WhenCanWeMeetIcon
    },
    {
      id: 4,
      label: 'Selfies',
      name: 'selfies',
      icon: SelfiesIcon
    },
    {
      id: 5,
      label: 'Reviews',
      name: 'reviews',
      icon: ReviewsIcon
    }
  ];

  const confirmationForAdmnApprovalDataChangeContent = [
    {
      title: '',
      text: `You have made ${approvalFieldsInfo.isSingleField ? 'a change' : 'changes'} to ${approvalFieldsInfo.fieldsNames} ${approvalFieldsInfo.isSingleField ? 'field' : 'fields'}, which requires admin approval. Are you sure you want to apply these ${approvalFieldsInfo.isSingleField ? 'change?' : 'changes?'}`,
      showButtons: true,
      buttons: [
        {
          children: 'Request for changes',
          variant: 'main',
          type: 'submit',
          onClick: () => {
            handleConfirmRequestForApprovalDataChanges();
          },
        },
        {
          children: 'Cancel changes',
          variant: 'general',
          type: 'button',
          onClick: () => {
            handleCancelRequestForApprovalDataChanges();
          },
        },
      ]
    }
  ];

  const handleConfirmRequestForApprovalDataChanges = () => {
    confirmAdminApprovalFieldsChanges();
    // make empty unSaved changes
    setShowAdminApprovalDataChangeConfirmationModal(false);
  };

  const handleCancelRequestForApprovalDataChanges = () => {
    discardUserPendingOverrides();
    // make empty unSaved changes
    setShowAdminApprovalDataChangeConfirmationModal(false);
  };

  const handleModalClose = () => {
    handleCancelRequestForApprovalDataChanges();
  };

  const handleEditProfileInfoButtonClick = () => {
    scrollTo({top: 0});
    setGeneralActiveTabId('profile_info');
  };

  const handleChange = (field, value) => {
    setErrors(null);
    const isAdminApprovalField = checkIsAdminApprovalField(field);
    const isRequiredField = checkIsRequiredField(field);
    if (isVerified && isRequiredField) {
      const requiredFieldError = validateRequiredFieldValue(field, value);
      if (requiredFieldError) {
        setErrors(requiredFieldError);
        return;
      }
    }

    // set unsavedData approval datayov
    if (isVerified && isAdminApprovalField) {
      // update userWithPendingOverrides, unsaved changes
      updateUserPendingOverrides(field, value);
      // if (generalActiveTabId === 0 && menuActiveTabId == 0) chem haskanum xi em grel menuActiveTabId == 0 ????

      if (generalActiveTabId === 'account') {
        // should be logic where checking previous and current values to see if there any change
        setShowAdminApprovalDataChangeConfirmationModal(true);
      };
    } else {
      //3-rd argument I passed is isprofileEditContent page
      updateUser(field, value, generalActiveTabId === 'profile_info');
    }
  };

  const handleCancelButtonClick = () => {
    setErrors(null);
    // cancel edit in form not confirmation question
    discardChanges();

    setGeneralActiveTabId('account');
  };

  const onSaveButtonClick = () => {
    // if there is admin approval field change should show showAdminApprovalDataChangeConfirmationModal
    const requiresApproval = !!unsavedChanges;
    if (requiresApproval && isVerified) {
      setShowAdminApprovalDataChangeConfirmationModal(true);
      return;
    };
    // showSuccessMessage
    const hasAtLeastOneChange = JSON.stringify(originalUser) !== JSON.stringify(currentUserWithoutPendingChanges);
  //  console.log ('hasAtLeastOneChange', hasAtLeastOneChange);
    hasAtLeastOneChange && submitData(currentUserWithoutPendingChanges, true);
    matchUserAndOriginalUserData(currentUserWithoutPendingChanges);
  };

  return (
    <>
      {
        loader
        ?
          <Loading />
        :
        <>
          {!hideTabs &&
            <ProfileDetailsTabs
              profileDetailsTabsData={ESCORT_DASHBOARD_PAGE_TABS}
              activeTab={generalActiveTabId}
              setActiveTab={setGeneralActiveTabId}
            />
          }
          {showAdminApprovalDataChangeConfirmationModal &&
            <Modal
              title={'Changes Require Admin Approval'}
              content={confirmationForAdmnApprovalDataChangeContent}
              closeModal={handleModalClose}
            />
          }
          {errors
          ?
            <ErrorInfo
              errors={errors}
              requiredFields={USER_REQUIRED_FIELDS}
            />
          :
            <>
              {generalActiveTabId !== 'settings' &&
                <div className={`${styles.infoMessage} page-width`}>
                  <div className={styles.errorContainer}>
                    <InfoIcon/>
                    <Text
                      tag={'span'}
                      children={`${generateTextFromArray(USER_REQUIRED_FIELDS, false)} are required fields, please fill them in before get verified.`}
                      className={styles.infoText}
                    />
                  </div>
                </div>
              }
            </>
          }
          {generalActiveTabId === 'account' &&
            <div className={styles.providerPageContainer}>
              <ProfileCoverPhoto
                coverPhotoUrl={user?.coverPhoto?.url}
                coverPhotoName={user?.coverPhoto?.name}
                className={`${styles.coverPhoto} ${!user?.coverPhoto ? styles.empty : ''}`}
                data={{
                  showEditButton: true,
                  editButtonParentClassName: styles.editContent,
                  editButtoniconClassName: styles.iconContent,
                  editButtontextClassName: styles.editText,
                  editButtonText: `${!user?.coverPhoto ? 'Upload' : 'Edit'} Cover Photo`,
                  shouldUploadImage: true,
                  emptyImageClassName: styles.emptyCoverPhoto,
                  invalidBorder: styles.invalidBorder,
                  invalidText: styles.invalidText,
                  emptyImageText: 'Upload your cover photo',
                  emptyImageTextClassName: styles.emptyImageTextClassName
                }}
                error={errors && errors?.coverPhoto}
                token={token}
                onChanges={handleChange}
              />
              <ProfileMainInfo
                profilePhoto={user?.profilePicture?.url}
                profilePhotoName={user?.profilePicture?.name}
                profileProviderFullName={{
                  name: user?.name,
                  lastname: user?.lastName,
                }}
                profileIsAvialabile={user?.availableNow}
                profileDigitalService={user?.digitalService}
                profileProviderPersonalInfo={USER_PROFILE_DATA(user)}
                providerContactInfo={{
                  email: user?.email,
                  phone: user?.phoneNumber,
                }}
                provierSocialLinks={{
                  instagram: user?.instagramLink,
                  onlyFans: user?.onlyFansLink,
                }}
                providerWebsiteLink={user?.websiteLink}
                showUploadIcon={true}
                isDashboardPage={true}
                showEditIcon={true}
                editButtonText={'Edit profile info'}
                token={token}
                onChanges={handleChange}
                onEditProfileInfoButtonClick={handleEditProfileInfoButtonClick}
                isAvailableNow={user?.availableNow}
                verificationStatus={user?.verificationStatus}
                errors={errors}
              />
              <ProfileDetailsTabs
                profileDetailsTabsData={PROFILE_DETAILS_TABS}
                activeTab={menuActiveTabId}
                setActiveTab={setMenuActiveTabId}
                isMenuTabs={true}
                hideMainWrapperBorders={true}
                errors={errors}
              />
              {menuActiveTabId === 0 &&
                <ProfilePhotos
                  photos={user?.photos}
                  isVerified={isVerified}
                  data={{
                    field: 'photos',
                    error: errors && errors?.photos,
                    showEditAndDeleteButtons: true,
                    shouldUploadImage: true,
                    showNoPicturesForDashboardPage: true,
                    token: token,
                    setErrors: setErrors,
                    onChanges: handleChange,
                  }}
                />
              }
              {menuActiveTabId === 1 &&
                <ProfileAboutMe
                  aboutMeDescription={user?.aboutMe}
                  providerCloset={user?.closet}
                  providerGlam={user?.glam}
                  providerExtraOptions={user?.extras}
                  data={{
                    showEditButton: true,
                    showEmptyStateForDashboardPage: true,
                    token: token,
                    onChanges: handleChange,
                    onCancelButtonClick: handleCancelButtonClick,
                    onSaveButtonClick: onSaveButtonClick,
                  }}
                />
              }
              {menuActiveTabId === 2 &&
                <ProfileRatesAndServices
                  incall={user?.incall}
                  outcall={user?.outcall}
                  services={user?.services}
                  isDashboardPage={true}
                  showEditButton={true}
                  updateUserPendingOvverridesAndSubmitUserData={updateUserPendingOvverridesAndSubmitUserData}
                  onDataChanges={handleChange}
                  errors={{
                    services: errors?.services,
                    incall: errors?.incall,
                    outcall: errors?.outcall
                  }}
                  setErrors={setErrors}
                />
              }
              {menuActiveTabId === 3 &&
                <WhenCanWeMeetComponent
                  username={user?.username}
                  schedule={user?.schedule}
                  additionalInfo={user?.additionalInfo}
                  showEditButton={true}
                  hideSubscribeNow={true}
                  error={errors && errors?.schedule}
                  setErrors={setErrors}
                  updateUserPendingOvverridesAndSubmitUserData={updateUserPendingOvverridesAndSubmitUserData}
                />
              }
              {menuActiveTabId === 4 &&
                <ProfilePhotos
                  photos={user?.selfies}
                  isVerified={isVerified}
                  data={{
                    field: 'selfies',
                    showEditAndDeleteButtons: true,
                    shouldUploadImage: true,
                    showNoPicturesForDashboardPage: true,
                    token: token,
                    setErrors: setErrors,
                    onChanges: handleChange,
                  }}
                />
              }
              {menuActiveTabId === 5 &&
                <ProfileReviews
                  reviews={user?.reviews}
                  providerId={userId}
                  isDashboardPage={true}
                  updateUserPendingOvverridesAndSubmitUserData={updateUserPendingOvverridesAndSubmitUserData}
                />
              }
            </div>
          }
          {generalActiveTabId === 'profile_info' &&
            <ProfileInfoEditForm
              user={user}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              onMouseDown={handleChange}
              updateUserPendingOvverridesAndSubmitUserData={updateUserPendingOvverridesAndSubmitUserData}
              onCancelButtonClick={handleCancelButtonClick}
              onSaveButtonClick={onSaveButtonClick}
              pageTitle={'Edit profile info'}
              role={role}
              showUsername={false}
              hideSaveAndCancelButtons={false}
              errors={errors}
              setErrors={setErrors}
            />
          }
          {generalActiveTabId === 'settings' &&
            <ResetPassword/>
          }
        </>
      }
    </>
  )
}
