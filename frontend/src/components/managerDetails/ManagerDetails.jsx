import { useEffect, useState } from 'react';
import styles from './managerDetails.module.css';
import AccountDetails from '../accountDetails/AccountDetails';
import { MANAGER } from '@/app/utils/constants/userRoles';
import ProfileDetailsTabs from '../profileDetails/profileDetailsTabs/ProfileDetailsTabs';
import ClientProfile from '../clientProfile/ClientProfile';
import ResetPassword from '../resetPassword/ResetPassword';
import Escorts from '../escorts/Escorts';
import Button from '../button/Button';
import ProfileInfoEditForm from '../profileEditForm/ProfileEditForm';

import { useFetchData } from '@/app/utils/hooks/useFetch';
import { checkIsAdminApprovalField, fetchUserRatesAndServices, getVerificationStatus, inputValidation, isInputLengthValid, transformUserWithPendingOverrides } from '@/app/utils/helpers';
import ServiceProviderDetails from '../serviceProviderDetails/ServiceProviderDetails';
import InfoIcon from '../icons/Info';
import Popup from '../popup/Popup';

export default function ManagerDetails ({
  // user, onChanges, onSubmit, errorMessage,
  userData,
  setUserData,
  contentToDisplay,
  setContentToDisplay,
  newEscort,
  manager,
  managerId,
  token,
  matchUserAndOriginalUserData,
  updateUser,
  updateUserPendingOvverridesAndSubmitUserData,
  updateManagerNewEscort,
  updateManagerNewEscortLocationData,
  updateUserPendingOverrides,
  discardUserPendingOverrides,
  confirmAdminApprovalFieldsChanges,
  discardChanges,
  submitManagerEscortData,
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
  resetNewEscortData,
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
    updateManagerNewEscort(field, value);
  };

  const onSaveButtonClick = async () => {
    if (contentToDisplay === 'create_new_escort') {
      const validationInfo = inputValidation('Username', newEscort.username, 3, false);
      if (!newEscort.username || !validationInfo.isValid) {
        setErrors({'username': validationInfo.errorMessage});
        return;
      };
      await createNewEscort(newEscort);
      setContentToDisplay('account');
      return;
    } else if (contentToDisplay === 'edit_escort') {
      // if there is admin approval field change should show showAdminApprovalDataChangeConfirmationModal
      const requiresApproval = !!unsavedChanges;
      if (requiresApproval && isVerified) {
        setShowAdminApprovalDataChangeConfirmationModal(true);
        return;
      } else {
        // not verified user or verified user and not admin-approval field change
        submitManagerEscortData(user, true);
      }
    }
    // showSuccessMessage
    // const hasAtLeastOneChange = JSON.stringify(originalUser) !== JSON.stringify(currentUserWithoutPendingChanges);
    // hasAtLeastOneChange && submitManagerEscortData(newEscort, true);
  };

  const createNewEscort = async (formData) => {
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
          // redirect to My escorts page
          setPopup({
            ...popup,
            show: true,
            title: 'Escort successfully created!'
          });

          setTimeout(() => {
            setPopup({
              ...popup,
              show: false,
              title: '',
            });
          }, 3000);
        }
      })
      resetNewEscortData();
  };

  const handleEditEscortButtonClick = async (username) => {
    const userRatesAndServicesData = await fetchUserRatesAndServices(null, username);
    await useFetchData(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users?filters[username][$eq]=${username}&populate=*`, {
      method: 'GET',
    }).then((res) => {
        const {data, error} = res;
        if (error) {
          setErrors(error)
        } else {
          if (res && Array.isArray(res)) {
            const { id, blocked, createdAt, updatedAt, confirmed, role, ...escortData } = res[0];
            setUserData({
              ...userData,
              user: {
                ...escortData,
                ...userRatesAndServicesData,
              },
              userId: id,
              originalUser: {
                ...escortData,
                ...userRatesAndServicesData,
              },
              userWithPendingOverrides: transformUserWithPendingOverrides({
                ...escortData,
                ...userRatesAndServicesData,
              }, escortData?.pendingData),
              userVerificationStatus: getVerificationStatus(escortData.verificationStatus),
            })
          }
        }
      });

    setContentToDisplay('edit_escort');
  };

  const handleClosePopup = () => {
    setPopup({
      ...popup,
      show: false,
    })
  };

  return (
    <div className={styles.mainWrap}>
      {contentToDisplay === 'account' &&
        <section className={`${styles.section} page-width`}>
          <div className={`${styles.container} ${styles.buttonsWrap}`}>
            <Button
              children={'Create new escort'}
              onClick={() => setContentToDisplay('create_new_escort')}
              variant={'general'}
            />
          </div>
          <Escorts
            managerId={userData?.managerId}
            setUserData={setUserData}
            onEditEscortButtonClick={handleEditEscortButtonClick}
          />
        </section>
      }
      {contentToDisplay === 'create_new_escort' &&
        <>
          <ProfileInfoEditForm
            user={newEscort}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            onMouseDown={handleChange}
            onCancelButtonClick={() => setContentToDisplay('account')}
            onSaveButtonClick={onSaveButtonClick}
            updateManagerNewEscortLocationData={updateManagerNewEscortLocationData}
            pageTitle={'Create escort profile'}
            role={role}
            showUsername={true}
            isCreatingNewEscort={true}
            errors={errors}
          />
        </>
      }
      {(contentToDisplay === 'edit_escort' || contentToDisplay === 'profile_info') &&
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
            submitData={submitManagerEscortData}
            updateUserPendingOvverridesAndSubmitUserData={updateUserPendingOvverridesAndSubmitUserData}
            updateUserPendingOverrides={updateUserPendingOverrides}
            discardUserPendingOverrides={discardUserPendingOverrides}
            discardChanges={discardChanges}
            confirmAdminApprovalFieldsChanges={confirmAdminApprovalFieldsChanges}
            isVerified={isVerified}
            role={role}
            userId={userId}
            approvalFieldsInfo={approvalFieldsInfo}
            unsavedChanges={unsavedChanges}
            errors={errors}
            setErrors={setErrors}
            updateServicesTypeChange={updateServicesTypeChange}
          />
        </>
      }
      {contentToDisplay === 'profile' &&
        <ClientProfile
          hideImage={true}
          title={'Profile'}
          formData={userData?.manager}
          // onChildFormDataChange={handleChildFormDataChange}
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
    </div>
  )
}
