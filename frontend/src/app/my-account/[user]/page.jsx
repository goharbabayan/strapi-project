'use client'

import { useState, useEffect } from 'react';
import Layout from './layout.jsx';
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

export default function MyAccountPage() {
  const strapiBaseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const [user, setUser] = useState([]);
  const [userId, setUserId] = useState('');
  const [isApprovedByAdmin, setIsApprovedByAdmin] = useState(false);
  const [role, setRole] = useState('');
  const [token, setToken] = useState('');
  const [userUpdatedFormData, setUserUpdatedFormData] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [globalErrorText, setGlobalErrorText] = useState('');
  const [errorMessage, setErrorMessage] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'));
    token && setToken(token);
    token
      ?
        useFetchData(`${strapiBaseUrl}/api/users/me?populate=*`, {
          method: 'GET',
          headers: {
            'authorization': `Bearer ${token}`
          } 
        }).then(data => {
          if (data.error) {
            // the token is expired, need to login again to update existing token;
            navigate('/login');
          } else {
            setUser(data);
            setUserId(data.id);
            setRole(data.role.type.toLowerCase());
            setIsApprovedByAdmin(data?.isApprovedByAdmin);
          }
        })
        .catch(err => console.log('err', err))
      :
        navigate('/login');
  }, []);

  const handleFormSubmit = (event, role) => {
    event.preventDefault();

    if (role !== MANAGER) {
      if (!userUpdatedFormData.profilePicture) {
        setGlobalErrorText(`Please, add member's profile picture.`);
        return;
      }
      if (!userUpdatedFormData.coverPhoto && role !== CLIENT) {
        setGlobalErrorText(`Please, add member's cover photo.`);
        return;
      }
    }

    let errors;
    if (role !== CLIENT) {
      errors = validateForm(userUpdatedFormData, false);
    } else if (role === CLIENT) {
      errors = validateForm(userUpdatedFormData, true);
    };
    const hasErrors = Object.keys(errors).length > 0;

    if (hasErrors) {
      setErrorMessage(errors);
      setGlobalErrorText('Please correct the errors and try again.');
      return;
    } else {
      setErrorMessage('');
      setGlobalErrorText('');
    }

    token && userId && user &&
      fetch(`${strapiBaseUrl}/api/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userUpdatedFormData),
        headers: {
          'Content-type': 'application/json',
          'authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          const hasMoreThanOneError = data.error.errors?.length > 0;
          if (hasMoreThanOneError) {
            data.error.errors.map(error => {
              setGlobalErrorText(error.message);
            })
          }
          setGlobalErrorText(data.error.message);
        } else {
          setShowSuccessMessage(true);
          setTimeout(() => {
            setHasUnsavedChanges(false);
            setShowSuccessMessage(false);
          }, 5000);
        }
      });

    if (!user.isApprovedByAdmin) {
      token && userId && user &&
        fetch(`${strapiBaseUrl}/api/profile-review/${token}`,{
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            'authorization': `Bearer ${token}`
          },
          body: JSON.stringify(user),
        })
        .then(res => res.json())
    }
  };

  const handleSaveButtonClick = () => {
    const unsavedUserData = {
      ...userUpdatedFormData,
      isApprovedByAdmin: false
    }

    token && userId && user &&
      useFetchData(`${strapiBaseUrl}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(unsavedUserData),
      })
    setHasUnsavedChanges(false);
    setIsApprovedByAdmin(false);
  }

  const handleCancelChangesButtonClick = () => {
    setHasUnsavedChanges(false);
  };

  const handleSetChanges = (childState, childFormData) => {
    setGlobalErrorText('');
    setShowSuccessMessage(false);
    setErrorMessage('');
    setHasUnsavedChanges(childState);
    setUserUpdatedFormData(childFormData);
  };

  return (
    <Layout>
      <div className={`${styles.mainWrap} ${role === CLIENT ? styles.client : null}`}>
        <div className="dashboard">
          <form onSubmit={(e) => handleFormSubmit(e, role)}>
            {hasUnsavedChanges && (
              <NotificationBar
                isApprovedByAdmin={user.isApprovedByAdmin}
                onCancelButtonClick={handleCancelChangesButtonClick}
                onSaveButtonClick={handleSaveButtonClick}
                showSuccessfullMessage={showSuccessMessage}
                successfullMessageText={user.isApprovedByAdmin ? 'All changes have been applied successfully.' : 'Your request has been sent successfully.'}
                errorMessageText={globalErrorText}
                userRole={role}
              />
            )}
            {role === SERVICE_PROVIDER &&
              <div className={`${styles.info} page-width`}>
                <Text
                  className='text-middle'
                  tag={'span'}
                  children={isApprovedByAdmin ? 'Your account is approved by admin.' : 'Your account has not been approved by admin yet.'}
                />
                {!isApprovedByAdmin &&
                  <Button
                    type='submit'
                    className={`button_main ${styles.submitButton}`}
                    children={'Request to review'}
                  />
                }
              </div>
            }
            {user && role === SERVICE_PROVIDER &&
              <>
                <ServiceProviderDetails
                  user={user}
                  onChanges={handleSetChanges}
                  hasUnsavedChanges={hasUnsavedChanges}
                  errorMessage={errorMessage}
                />
              </>
            }
            {user && role === CLIENT &&
              <>
                <ClientDetails
                  user={user}
                  onChanges={handleSetChanges}
                  hasUnsavedChanges={hasUnsavedChanges}
                  errorMessage={errorMessage}
                />
              </>
            }
            {user && role === MANAGER &&
              <>
                <ManagerDetails
                  user={user}
                  onChanges={handleSetChanges}
                  onSubmit={handleFormSubmit}
                  errorMessage={errorMessage}
                />
              </>
            }
          </form>
        </div>
      </div>
    </Layout>
  );
}
