import { useState } from 'react';
import styles from './managerDetails.module.css';
import { MANAGER } from '@/app/utils/constants/userRoles';
import ResetPassword from '../resetPassword/ResetPassword';
import ProfileInfoEditForm from '../profileEditForm/ProfileEditForm';
import { useFetchData } from '@/app/utils/hooks/useFetch';
import { fetchUserRatesAndServices, getVerificationStatus, inputValidation, isInputLengthValid, transformUserWithPendingOverrides } from '@/app/utils/helpers';
import ServiceProviderDetails from '../serviceProviderDetails/ServiceProviderDetails';
import InfoIcon from '../icons/Info';
import Popup from '../popup/Popup';
import Text from '../text/Text';
import PlusIcon from '../icons/plusIcon';
import ManagerProfile from '../managerProfile/ManagerProfile';
import Members from '../managerMembers/Members';

export default function ManagerDetails ({
  userData,
  setUserData,
  setShowVerificationPopup,
  contentToDisplay,
  setContentToDisplay,
  newProvider,
  manager,
  token,
  matchUserAndOriginalUserData,
  updateUser,
  updateUserPendingOvverridesAndSubmitUserData,
  updateManagerNewProvider,
  updateManagerNewProviderLocationData,
  updateUserPendingOverrides,
  discardUserPendingOverrides,
  confirmAdminApprovalFieldsChanges,
  discardChanges,
  submitManagerProviderData,
  isVerified,
  approvalFieldsInfo,
  unsavedChanges,
  errors,
  setErrors,
  userId,
  role,
  user,
  originalUser,
  userWithPendingOverrides,
  setManagerPersonalProfileChange,
  submitManagerPersonalProfileData,
  resetNewProviderData,
  updateServicesTypeChange,
 }) {
  const {username, name, lastName, email, password, id} = manager;
  const [popup, setPopup] = useState({
    show: false,
    title: '',
    text: '',
  });

// code from service provider details component
  const handleChange = (field, value) => {
    setPopup({
      show: false,
      title: '',
    });
    updateManagerNewProvider(field, value);
  };

  const onSaveButtonClick = async () => {
    const validationInfo = inputValidation('Username', newProvider.username, 3, false);
    if (!newProvider.username || !validationInfo.isValid) {
      setErrors({'username': validationInfo.errorMessage});
      return;
    };

    await createNewProvider(newProvider);
  };

  const createNewProvider = async (formData) => {
    await useFetchData(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local/registerMember`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN_MEMBER}`
      },
      body: JSON.stringify(formData),
    }).then((res) => {
        const {data, error, user} = res;
        if (error) {
          setPopup({
            ...popup,
            show: true,
            title: error.message,
          });
        } else if (user) {
          // show success message for creating user
          // redirect to My providers page
          setPopup({
            ...popup,
            show: true,
            title: 'Provider successfully created!'
          });

          setTimeout(() => {
            setPopup({
              ...popup,
              show: false,
              title: '',
            });
            setContentToDisplay('account');
          }, 3000);
        }
      })
      resetNewProviderData();
  };

  const handleVisitProfileButtonClick = async (username) => {
    setErrors(null);
    const userRatesAndServicesData = await fetchUserRatesAndServices(null, username);
    await useFetchData(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users?filters[username][$eq]=${username}&populate=*`, {
      method: 'GET',
    }).then((res) => {
        const {data, error} = res;
        if (error) {
          setErrors(error)
        } else {
          if (res && Array.isArray(res)) {
            const { id, blocked, createdAt, updatedAt, confirmed, role, ...ProviderData } = res[0];
            setUserData({
              ...userData,
              user: {
                ...ProviderData,
                ...userRatesAndServicesData,
              },
              userId: id,
              originalUser: {
                ...ProviderData,
                ...userRatesAndServicesData,
              },
              userWithPendingOverrides: transformUserWithPendingOverrides({
                ...ProviderData,
                ...userRatesAndServicesData,
              }, ProviderData?.pendingData),
              userVerificationStatus: getVerificationStatus(ProviderData.verificationStatus),
            })
          }
        }
      });

    setContentToDisplay('edit_Provider');
  };

  const handleClosePopup = () => {
    setPopup({
      ...popup,
      show: false,
    })
  };

  return (
    <>
      {contentToDisplay === 'account' &&
        <div className={styles.sectionWrapper}>
          <section className="page-width">
            <div className={styles.mainWrap}>
              <div className={`${styles.wrapper}`}>
                <Text
                  tag={'h2'}
                  className={styles.title}
                  children={'My providers'}
                />
                <PlusIcon
                  className={styles.iconPlus}
                  text={'Add Provider'}
                  textClassName={styles.buttonText}
                  fill={`var(--neutral-white-n10)`}
                  onClick={() => setContentToDisplay('create_new_Provider')}
                />
              </div>
              <Members
                managerId={userData?.managerId}
                userData={userData}
                setUserData={setUserData}
                setErrors={setErrors}
                submitManagerProviderData={submitManagerProviderData}
                onVisitProfileButtonClick={handleVisitProfileButtonClick}
              />
            </div>
          </section>
        </div>
      }
      {contentToDisplay === 'create_new_Provider' &&
        <>
          <ProfileInfoEditForm
            user={newProvider}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            onMouseDown={handleChange}
            onCancelButtonClick={() => setContentToDisplay('account')}
            onSaveButtonClick={onSaveButtonClick}
            updateManagerNewProviderLocationData={updateManagerNewProviderLocationData}
            pageTitle={'Create provider profile'}
            role={role}
            showUsername={true}
            isCreatingNewProvider={true}
            errors={errors}
          />
        </>
      }
      {(contentToDisplay === 'edit_Provider' || contentToDisplay === 'profile_info') &&
        <>
          <ServiceProviderDetails
            activeTab={contentToDisplay}
            setActiveTab={setContentToDisplay}
            user={userWithPendingOverrides}
            originalUser={originalUser}
            currentUserWithoutPendingChanges={user}
            token={token}
            hideTabs={true}
            updateUser={updateUser}
            matchUserAndOriginalUserData={matchUserAndOriginalUserData}
            submitData={submitManagerProviderData}
            updateUserPendingOvverridesAndSubmitUserData={updateUserPendingOvverridesAndSubmitUserData}
            updateUserPendingOverrides={updateUserPendingOverrides}
            discardUserPendingOverrides={discardUserPendingOverrides}
            discardChanges={discardChanges}
            confirmAdminApprovalFieldsChanges={confirmAdminApprovalFieldsChanges}
            isVerified={isVerified}
            role={role}
            userId={userId}
            isForManagerProvider={true}
            approvalFieldsInfo={approvalFieldsInfo}
            unsavedChanges={unsavedChanges}
            updateServicesTypeChange={updateServicesTypeChange}
            errors={errors}
            setErrors={setErrors}
            setShowVerificationPopup={setShowVerificationPopup}
          />
        </>
      }
      {contentToDisplay === 'profile' &&
        <ManagerProfile
          title={'Profile'}
          formData={userData?.manager}
          updateData={setManagerPersonalProfileChange}
          submitManagerPersonalProfileData={submitManagerPersonalProfileData}
          errorMessage={errors}
        />
      }
      {contentToDisplay === 'settings' &&
        <ResetPassword/>
      }
      {popup.show &&
        <Popup
          title={popup.title}
          text={popup.text}
          Icon={<InfoIcon/>}
          onClose={handleClosePopup}
          contentClassName={styles.modal}
        />
      }
    </>
  )
}
