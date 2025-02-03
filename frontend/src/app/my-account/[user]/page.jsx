'use client'

import { useState, useEffect, useMemo } from 'react';
import { useContext } from 'react';
import { AuthContext } from '@/app/Context';
import styles from './my-account.module.css';
import NotificationBar from '@/components/notificationBar/NotificationBar.jsx';
import ClientDetails from '@/components/clientDetails/ClientDetails.jsx';
import ManagerDetails from '@/components/managerDetails/ManagerDetails.jsx';
import ServiceProviderDetails from '@/components/serviceProviderDetails/ServiceProviderDetails.jsx';
import { navigate } from '../../actions.js';
import { CLIENT, SERVICE_PROVIDER, MANAGER } from '../../utils/constants/userRoles.js';
import { validateForm } from '@/app/utils/validation.js';
import { useFetchData } from '@/app/utils/hooks/useFetch.jsx';
import Button from '@/components/button/Button.jsx';
import Text from '@/components/text/Text.jsx';
import { fetchAndSetUserData, fetchUserData, fetchUserRatesAndServices, fetchUserUpdatedData, getVerificationStatus, isInputLengthValid, transformUserWithPendingOverrides } from '@/app/utils/helpers';
import Modal from '@/components/modal/Modal';
import BronzeBadge from '@/components/icons/badges/BronzeBadge';
import SilverBadge from '@/components/icons/badges/SilverBadge';
import GoldenBadge from '@/components/icons/badges/GoldenBadge';
import InfoIcon from '@/components/icons/Info';
import Popup from '@/components/popup/Popup';
import ProfileInfoEditForm from '@/components/profileEditForm/ProfileEditForm';
import { USER_FORM, USER_FORM_NEW_MEMBER, USER_FORM_WITH_DATA } from '@/app/utils/constants/userForm';
import ProfileDetailsTabs from '@/components/profileDetails/profileDetailsTabs/ProfileDetailsTabs';
import { ESCORT_DASHBOARD_PAGE_TABS, MANAGER_PROFILE_DETAILS_TABS } from '@/app/utils/constants/dashboardPageTabs';
import ResetPassword from '@/components/resetPassword/ResetPassword';
import Escorts from '@/components/escorts/Escorts';
import ClientProfile from '@/components/clientProfile/ClientProfile';
import { ADMIN_APPROVAL_FIELDS } from '@/app/utils/constants/userAdminApprovalFields';

export default function MyAccountPage() {
  const strapiBaseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const {customerToken} = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('account');
  const [userData, setUserData] = useState({
    originalUser: {},
    user: {},
    userWithPendingOverrides: {},
    unsavedChanges: null,
    userId: '',
    role: '',
    userVerificationStatus: null,
    requestType: null,
    approvalFieldsInfo: {
      isSingleField: true,
      fieldsNames: '',
      hasNonApprovalFieldChange: false,
    }
  });
  const [showVerificationSuggestion, setShowVerificationSuggestion] = useState(false);
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [errors, setErrors] = useState(null);
  const [notificationState, setNotificationState] = useState({
    profileVerificationRequest: {
      show: false,
      text: 'Your profile verification request has been submitted successfully! An admin will review your details shortly.',
      title: 'Successfully submitted!',
    },
    verificationSuccess: {
      show: false,
      text: 'Your verification request has been submitted successfully! An admin will review your details shortly.',
      title: 'Successfully submitted!',
    },
    dataChangeRequest: {
      show: false,
      text: '',
      title: 'Successfully submitted!',
    },
    dataChangeWithoutRequest: {
      show: false,
      text: 'Changes has been submitted successfully!',
      title: 'Successfully submitted!',
    },
    errorInfo: {
      show: false,
      text: 'There are errors in your submission. Please correct the highlighted fields on the dashboard and try submitting again.',
      title: 'Errors!',
    }
  });

  useEffect(() => {
    if (!userData?.user || Object.keys(userData?.user).length === 0) {
      setShowVerificationSuggestion(false);
    } else {
      setShowVerificationSuggestion(
        (userData.role === SERVICE_PROVIDER.type && activeTab !== 'settings') ||
        (userData.role === MANAGER.type && activeTab === 'edit_escort')
      );
    }
  }, [userData, activeTab]);

  useEffect(() => {
    userData?.unsavedChanges && setUserData({
      ...userData,
      approvalFieldsInfo: getApprovalFieldsInfo(),
    });
  }, [userData?.unsavedChanges]);

  useEffect(() => {
    if (userData?.approvalFieldsInfo?.fieldsNames) {
      setNotificationState((prevState) => ({
        ...prevState,
        dataChangeRequest: {
          ...prevState.dataChangeRequest,
          text: `Your ${userData?.approvalFieldsInfo.fieldsNames} ${userData?.approvalFieldsInfo.isSingleField ? 'change' : 'changes'} request has been submitted for admin approval. ${userData?.approvalFieldsInfo.hasNonApprovalFieldChange ? 'Other changes have been saved successfully.' : ''}`,
        },
      }));
    }
  }, [userData?.approvalFieldsInfo]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setNotificationState({
      ...notificationState,
      errorInfo: {
        ...notificationState.errorInfo,
        show: !!errors,
      },
    });
  }, [errors]);

  const { userVerificationStatus } = userData || {};
  const { verifiedLevel, badgeIcon } = userVerificationStatus || {};

  const fetchData = async () => {
    const userFetchedData = await fetchUserData(customerToken, userData);
    userFetchedData ? setUserData(userFetchedData) : navigate('/login');
  };

  const content = userData?.userVerificationStatus?.verifiedLevel === 'golden'
    ? [
        {
          Icon: <GoldenBadge className={styles.bigIcon}/>,
          title: 'Congrats! You got all badges',
          text: '',
          isVerifiedLevel: true,
          showButtons: false,
          buttons: null,
        },
      ]
    : [
        {
          title: 'Bronze Badge',
          text: `Verify your identity with ease! Upload a clear, high-quality photo of yourself that meets our guidelines to secure the Bronze Badge and enhance your profile's trustworthiness.`,
          Icon: <BronzeBadge/>,
          isVerifiedLevel: ['bronze', 'silver', 'golden'].includes(userData?.userVerificationStatus?.verifiedLevel),
          showButtons: !userData?.userVerificationStatus?.verifiedLevel,
          buttons: [
            {
              children: 'Submit to get a badge',
              type: 'submit',
              variant: 'main',
              onClick: () => handleSetActionType(
                userData?.userVerificationStatus?.verifiedLevel ? 'verification_upgrade' : 'get_verification',
              ),
            },
          ]
        },
        {
          title: 'Silver Badge',
          text: `Introduce yourself with confidence! Upload a short video explaining who you are and why you're a trusted professional. Follow our guidelines to complete your verification and earn the Silver Badge.`,
          Icon: <SilverBadge/>,
          isVerifiedLevel: ['silver', 'golden'].includes(userData?.userVerificationStatus?.verifiedLevel),
          showButtons: userData?.userVerificationStatus?.verifiedLevel === 'bronze',
          buttons: [
            {
              children: 'Submit to get a badge',
              type: 'submit',
              variant: 'main',
              onClick: () => handleSetActionType(
                userData?.userVerificationStatus?.verifiedLevel ? 'verification_upgrade' : 'get_verification',
              ),
            },
          ]
        },
        {
          title: 'Golden Badge',
          text: `Shine like gold! Book a session in our photobooth for a professional photoshoot. Once completed, you'll receive the prestigious Golden Badge, showcasing your authenticity and credibility.`,
          Icon: <GoldenBadge/>,
          isVerifiedLevel: userData?.userVerificationStatus?.verifiedLevel === 'golden',
          showButtons: userData?.userVerificationStatus?.verifiedLevel === 'silver',
          buttons: [
            {
              children: 'Submit to get a badge',
              type: 'submit',
              variant: 'main',
              onClick: () => handleSetActionType(
                userData?.userVerificationStatus?.verifiedLevel ? 'verification_upgrade' : 'get_verification',
              ),
            },
          ]
        },
      ];

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const isClientRole = userData?.role === CLIENT.type;
    const isServiceProviderRole = userData?.role === SERVICE_PROVIDER.type;
    const isManagerRole = userData?.role === MANAGER.type;
    const errors = validateForm(userData.user, isClientRole) || {};
    const hasErrors = Object.keys(errors).length > 0;
    // trigger error cases
    if (hasErrors) {
      setErrors(errors);
      setNotificationState({
        ...notificationState,
        errorInfo: {
          ...notificationState?.errorInfo,
          show: true,
        },
      });
      return;
    } else {
      setErrors(null);
      // if (!isClientRole) {
      //   showSuccessMessage(true)
      // };
      // showSuccessMessage(false)
    };

    // separate cases when form is submitted for different roles
    if (isServiceProviderRole) {
      // update user data in database
      if (customerToken && !userData?.userVerificationStatus?.verifiedLevel) submitData(userData.user);
      // sent a review link for admin
      requestReviewForApproval(userData.requestType);
    } else if (isManagerRole) {
      if (customerToken && !userData?.userVerificationStatus?.verifiedLevel) submitManagerEscortData(userData.user);
      requestReviewForApproval(userData.requestType);
    } else {
      // update User data
      if (customerToken) submitData(userData.user);
    };
  };
    // comment
    // should be created an userUnsavedData in userData object and when user makes changes on fields userData.unsavedChanges should be appdlied
    // if user clicks on Save changes button, this unsaved data should be applied on userData.user, if clicks on Cancel, the userData.unsavedChanges should be deleted ({})
  // }

  const matchUserAndOriginalUserData = (updatedUserData) => {
    setUserData({
      ...userData,
      originalUser: updatedUserData,
    });
  };

  const submitData = async (formData, showSuccessMessage) => {
    if (!customerToken || !userData?.userId || !formData) return;
    let id = userData?.userId;
    if (userData.role === MANAGER.type) id = userData.managerId;
    // validate Form when user if verified or when user submit to get verified from verification modal;
    const isVerified = userData?.userVerificationStatus?.verifiedLevel ? true : false;
    if (isVerified) {
      const errors = validateForm(userData.user, false) || {};
      const hasErrors = Object.keys(errors).length > 0;
      if (hasErrors) {
        setErrors(errors);
        return;
      } else {
        setErrors(null);
      };
    }
    const response = await useFetchData(`${strapiBaseUrl}/api/users/${id}`, {
      method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          'authorization': `Bearer ${customerToken}`
        },
        body: JSON.stringify(formData),
    });

    if (response.error) {
      console.error('Error updating user data:', response.error.message);
    } else {
      showSuccessMessage && showNonApprovalFieldChangesSuccessMessage();
    };
  };

  const submitManagerEscortData = async (formData, showSuccessMessage) => {
    const memberToken = process.env.NEXT_PUBLIC_API_TOKEN_MEMBER;;
    if (!memberToken || !userData?.userId || !formData) return;
    // const errors = validateForm(userData.user, false) || {};
    // const hasErrors = Object.keys(errors).length > 0;
    // if (hasErrors) {
    //   setErrors(errors);
    //   return;
    // } else {
    //   setErrors(null);
    // };

    useFetchData(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/members/${userData?.userId}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
      headers: {
        'Content-type': 'application/json',
        'authorization': `Bearer ${memberToken}`
      }
    }).then(res => {
      if (!res.error) {
        const isVerified = userData?.userVerificationStatus?.verifiedLevel ? true : false;
        showSuccessMessage && isVerified && showNonApprovalFieldChangesSuccessMessage();
      }
    })
  };

  const showNonApprovalFieldChangesSuccessMessage = () => {
    if (!userData?.userVerificationStatus?.verifiedLevel) {
      setNotificationState((prevState) => ({
        ...prevState,
        dataChangeWithoutRequest: { ...prevState.dataChangeWithoutRequest, show: true },
      }));
  
      setTimeout(() => {
        setNotificationState((prevState) => ({
          ...prevState,
          dataChangeWithoutRequest: { ...prevState.dataChangeWithoutRequest, show: false },
        }));
      }, 5000);
    }
  };

  const requestReviewForApproval = async (requestType) => {
    if (!customerToken || !userData?.user || !requestType) return;
    fetch(`${strapiBaseUrl}/api/profile-review/${customerToken}`,{
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'authorization': `Bearer ${customerToken}`
      },
      body: JSON.stringify({...userData?.user, id: userData?.userId, action: requestType}),
    })
    .then(response => {
      if (response.ok) {
        if (requestType === 'data_change') {
          setNotificationState((prevState) => ({
            ...prevState,
            dataChangeRequest: { ...prevState.dataChangeRequest, show: true },
          }));

          setTimeout(() => {
            setNotificationState((prevState) => ({
              ...prevState,
              dataChangeRequest: { ...prevState.dataChangeRequest, show: false },
            }));
          }, 5000);
        } else if (requestType === 'verification_upgrade') {
          setNotificationState((prevState) => ({
            ...prevState,
            verificationSuccess: { ...prevState.verificationSuccess, show: true },
          }));

          setTimeout(() => {
            setNotificationState((prevState) => ({
              ...prevState,
              verificationSuccess: { ...prevState.verificationSuccess, show: false },
            }));
            handleCloseVerificationModal();
          }, 5000);
        } else if (requestType === 'get_verification') {
          setNotificationState((prevState) => ({
            ...prevState,
            profileVerificationRequest: { ...prevState.profileVerificationRequest, show: true },
          }));

          setTimeout(() => {
            setNotificationState((prevState) => ({
              ...prevState,
              profileVerificationRequest: { ...prevState.profileVerificationRequest, show: false },
            }));
          }, 5000);
        }
      } else throw new Error(`Request approval failed: ${response.status}`);
    })
  };

  const updateUserPendingOverrides = (field, value) => {
    const ArrayDataFields = ['photos', 'selfies', 'aboutMe', 'services'];
    setUserData(prevState => ({
      ...prevState,
      userWithPendingOverrides: {
        ...prevState.userWithPendingOverrides,
        [field]: value,
      },
      unsavedChanges: {
        ...prevState.unsavedChanges,
        [field]: value,
      },
    }));
  };

  const discardUserPendingOverrides = () => {
    const userPendingData = JSON.parse(userData.user.pendingData);
    let previousValues = {};
    const approvalFieldsArray = Object.keys(userData.unsavedChanges);
    approvalFieldsArray.forEach(field => {
      previousValues[field] = userPendingData && userPendingData[field] || userData.user[field];
    });
    // get back previous value of field from pending data or user data
    setUserData({
      ...userData,
      userWithPendingOverrides: {
        ...userData.userWithPendingOverrides,
        ...previousValues,
      },
      unsavedChanges: null,
    });
  };

  const discardChanges = () => {
    const userPendingData = JSON.parse(userData?.originalUser?.pendingData);
    let previousValues = {};
    const approvalFieldsArray = ADMIN_APPROVAL_FIELDS;
    approvalFieldsArray.forEach(field => {
      previousValues[field] = userPendingData && userPendingData[field] || userData?.originalUser[field];
    });
    // get back previous value of field from pending data or user data
    setUserData({
      ...userData,
      userWithPendingOverrides: {
        ...userData.originalUser,
        ...previousValues,
      },
      user: userData.originalUser,
      unsavedChanges: null,
    });
  };

  const handleUpdateUser = (field, value, isProfileEditPage) => {
    const isVerified = userData?.userVerificationStatus?.verifiedLevel ? true : false;
    
    setErrors(null);
    const isServiceProviderRole = userData?.role === SERVICE_PROVIDER.type;
    const isManagerRole = userData?.role === MANAGER.type;
    const requiresApproval = !!userData.unsavedChanges;
    const updatedUserData = {
      ...userData.user,
      [field]: value,
    };
    setUserData({
      ...userData,
      user: updatedUserData,
      userWithPendingOverrides: {
        ...userData.userWithPendingOverrides,
        [field]: value,
      },
    });
    if (!requiresApproval && !isProfileEditPage) {
      // update user and show success message if is verified user
      if (isServiceProviderRole) {
        submitData(updatedUserData, isVerified);
      } else if (isManagerRole) {
        submitManagerEscortData(updatedUserData, isVerified);
      };
    };
  };

  const handleUpdateManagerNewEscort = (field, value) => {
    setErrors(null);
    const updatedUserData = {
      ...userData,
      managerNewEscort: {
        ...userData.managerNewEscort,
        [field]: value,
      },
    };
    setUserData(updatedUserData);
  };

  const updateUserPendingOvverridesAndSubmitUserData = (fieldsUpdatedData) => {
    // setErrors(null);
    const updatedUserData = {
      ...userData.user,
      ...fieldsUpdatedData,
    };
    setUserData({
      ...userData,
      user: updatedUserData,
      originalUser: updatedUserData,
      userWithPendingOverrides: {
        ...userData.userWithPendingOverrides,
        ...fieldsUpdatedData,
      }
    });
    // const errors = validateForm(userData.user, false) || {};
    // const hasErrors = Object.keys(errors).length > 0;
    // if (hasErrors) {
    //   setErrors(errors);
    //   return;
    // } else {
    //   setErrors(null);
    // };

    userData.role === MANAGER.type ? submitManagerEscortData(updatedUserData) : submitData(updatedUserData);
    const isVerified = userData?.userVerificationStatus?.verifiedLevel ? true : false;
    isVerified && showNonApprovalFieldChangesSuccessMessage();
  };

  const applyAdminApprovalFieldsChangesForVerifiedProvider = () => {
    // processed with user and userWithPendingOverrides data changes
    const pendingDataJSON = getPendingDataJson(userData.unsavedChanges);
    
    if (!pendingDataJSON) return;
    const userWithUpdatedPendingData = {
      ...userData.user,
      pendingData: pendingDataJSON,
    };

    setUserData({
      ...userData,
      user: userWithUpdatedPendingData,
      unsavedChanges: null,
      requestType: 'data_change',
    });

    // submit user data in database with updated pending data
    userData?.role === MANAGER.type ? submitManagerEscortData(userWithUpdatedPendingData) : submitData(userWithUpdatedPendingData);
    // sent a review link for admin
    requestReviewForApproval('data_change');
  };

  const handleCloseVerificationModal = () => {
    setShowVerificationPopup(false);
    // setErrors(null);
  };

  const handleSetActionType = (actionType) => {
    setUserData({
      ...userData,
      requestType: actionType,
    });
  };

  const handleClosePopup = () => {
    setNotificationState((prevState) => ({
      ...prevState,
      dataChangeRequest: { ...prevState.dataChangeRequest, show: false },
    }));
  };

  // for client Role
  const setChanges = (field, value) => {
    setErrors(null);
    setUserData({
      ...userData,
      user: {
        ...userData.user,
        [field]: value,
      }
    });
  };

  const getPendingDataJson = (approvalData) => {
    if (!approvalData || Object.keys(approvalData).length === 0) return null;
    let pendingDataJSON;
    let existingPendingData = userData.user?.pendingData ? JSON.parse(userData.user?.pendingData) : {};
    const existingAndRequestingParsedData = { ...existingPendingData, ...approvalData };
    pendingDataJSON = JSON.stringify(existingAndRequestingParsedData);
    return pendingDataJSON;
  };

  const getApprovalFieldsInfo = () => {
    if (!userData?.unsavedChanges) return null;
    const fieldsNames = Object.keys(userData?.unsavedChanges)
      .map((field) => `"${field}"`)
      .join(', ');
    const isSingleField = Object.keys(userData?.unsavedChanges).length === 1;
    const hasNonApprovalFieldChange = JSON.stringify(userData?.originalUser) !== JSON.stringify(userData?.user);
    return {
      isSingleField: isSingleField,
      fieldsNames: fieldsNames,
      hasNonApprovalFieldChange: hasNonApprovalFieldChange
    };
  };

// should be edited when doing manager dashboard
  const handleChildFormDataChange = (field, value) => {
    onChanges({...formData, [field]: value})
  };

  const handleResetNewEscortData = () => {
    setUserData({
      ...userData,
      managerNewEscort: USER_FORM_NEW_MEMBER(userData?.managerEmail, `${userData?.managerId}`),
    });
  };

  return (
    <div className={`${styles.mainWrap}`}>
      <div className="dashboard">
        <form onSubmit={(e) => handleFormSubmit(e)}>
          {showVerificationSuggestion &&
            <>
              {verifiedLevel !== 'golden' &&
                <div className="page-width">
                  <div className={styles.notificationBarContainer}>
                      <NotificationBar
                        content={
                          {
                            Icon: badgeIcon,
                            text: 'Boost your profile with verification badges! Get Bronze with a photo, Silver with a video, or go Golden with a photobooth shoot. Get verified now and stand out!',
                            buttons : [
                              {
                                type: 'button',
                                variant: 'secondary',
                                text: 'Start Now',
                                id: 1,
                                onClick: () => setShowVerificationPopup(true)
                              },
                              {
                                type: 'button',
                                variant: 'secondary',
                                text: 'Hide',
                                id: 2,
                                onClick: () => setShowVerificationSuggestion(false)
                              }
                            ]
                          }
                        }
                        onButtonClick={() => setShowVerificationPopup(true)}
                      />
                  </div>
                </div>
              }
              {showVerificationPopup &&
                <Modal
                  title={'Verify and get badges'}
                  content={content}
                  closeModal={handleCloseVerificationModal}
                  contentStyles={{
                    contentClassName: styles.modalContent,
                    itemClassName: styles.modalItem,
                  }}
                />
              }
              {['dataChangeRequest', 'dataChangeWithoutRequest', 'profileVerificationRequest','verificationSuccess', 'errorInfo'].map(
                (key) =>
                  notificationState?.[key]?.show && (
                    <Popup
                      key={key}
                      title={notificationState[key]?.title}
                      text={notificationState[key]?.text}
                      Icon={<InfoIcon />}
                      onClose={() =>
                        setNotificationState((prev) => ({
                          ...prev,
                          [key]: {
                            ...prev[key],
                            show: false,
                          },
                        }))
                      }
                      contentClassName={styles.modal}
                    />
                  )
              )}
            </>
          }
          {userData?.user && userData?.role === SERVICE_PROVIDER.type &&
            <ServiceProviderDetails
              user={userData?.userWithPendingOverrides}
              originalUser={userData?.originalUser}
              currentUserWithoutPendingChanges={userData?.user}
              token={customerToken}
              updateUser={handleUpdateUser}
              submitData={submitData}
              matchUserAndOriginalUserData={matchUserAndOriginalUserData}
              updateUserPendingOvverridesAndSubmitUserData={updateUserPendingOvverridesAndSubmitUserData}
              updateUserPendingOverrides={updateUserPendingOverrides}
              discardUserPendingOverrides={discardUserPendingOverrides}
              discardChanges={discardChanges}
              confirmAdminApprovalFieldsChanges={applyAdminApprovalFieldsChangesForVerifiedProvider}
              isVerified={userData?.userVerificationStatus?.verifiedLevel ? true : false}
              role={userData?.role}
              userId={userData?.userId}
              approvalFieldsInfo={userData?.approvalFieldsInfo}
              unsavedChanges={userData.unsavedChanges}
              errors={errors}
              setErrors={setErrors}
            />
          }
          {/* need to pass userId={userData?.userId} to ClientDetails component */}
          {userData?.user && userData?.role === CLIENT.type &&
            <>
              <ClientDetails
                user={userData?.user}
                userId={userData?.userId}
                onChanges={setChanges}
                errorMessage={errors}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </>
          }
          {userData?.user && userData?.role === MANAGER.type &&
            <>
            <div className={styles.mainWrap}>
              <ProfileDetailsTabs
                profileDetailsTabsData={MANAGER_PROFILE_DETAILS_TABS}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              <ManagerDetails
                userData={userData}
                setUserData={setUserData}
                user={userData?.user}
                originalUser={userData?.originalUser}
                userWithPendingOverrides={userData?.userWithPendingOverrides}
                newEscort={userData?.managerNewEscort}
                manager={userData?.manager}
                managerId={`${userData?.managerId}`}
                token={customerToken}
                matchUserAndOriginalUserData={matchUserAndOriginalUserData}
                updateUser={handleUpdateUser}
                updateManagerNewEscort={handleUpdateManagerNewEscort}
                submitManagerEscortData={submitManagerEscortData}
                updateUserPendingOvverridesAndSubmitUserData={updateUserPendingOvverridesAndSubmitUserData}
                updateUserPendingOverrides={updateUserPendingOverrides}
                discardUserPendingOverrides={discardUserPendingOverrides}
                confirmAdminApprovalFieldsChanges={applyAdminApprovalFieldsChangesForVerifiedProvider}
                discardChanges={discardChanges}
                isVerified={userData?.userVerificationStatus?.verifiedLevel ? true : false}
                role={userData?.role}
                userId={userData?.userId}
                approvalFieldsInfo={userData?.approvalFieldsInfo}
                unsavedChanges={userData.unsavedChanges}
                errors={errors}
                setErrors={setErrors}
                contentToDisplay={activeTab}
                setContentToDisplay={setActiveTab}
                resetNewEscortData={handleResetNewEscortData}
              />
              {/* should be edited: removed image uploading and gender */}
            
            </div>
            </>
          }
        </form>
      </div>
    </div>
  );
}


// incall or out rate structure 
  // {
  //   "id": 1,
  //   "general": [
  //       {
  //           "id": 49,
  //           "duration": "40min",
  //           "price": 2,
  //           "additionalInfo": null
  //       },
  //       {
  //           "id": 50,
  //           "duration": "1 hour",
  //           "price": 3,
  //           "additionalInfo": null
  //       }
  //   ],
  //   "PSE": [],
  //   "GFE": []
  // }
  // services data structure
  // {
  //   "id": 2,
  //   "general": [
  //       {
  //           "id": 5,
  //           "item": "gen 1"
  //       },
  //       {
  //           "id": 6,
  //           "item": "gen 2"
  //       }
  //   ],
  //   "PSE": [],
  //   "GFE": []
  // }
