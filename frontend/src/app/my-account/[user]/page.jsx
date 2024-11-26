'use client'

import { useState, useEffect } from 'react';
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
import { isInputLengthValid } from '@/app/utils/helpers';

export default function MyAccountPage() {
  const strapiBaseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const [user, setUser] = useState([]);
  const [userId, setUserId] = useState('');
  const [isApprovedByAdmin, setIsApprovedByAdmin] = useState(false);
  const [role, setRole] = useState('');
  const [token, setToken] = useState('');
  const [userUpdatedFormData, setUserUpdatedFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState({});
  const [notificationBarMessageAndStatus, setNotificationBarMessageAndStatus] = useState({
    show: false,
    message: ''
  });
  const [showSaveResetChangeBar, setShowSaveResetChangeBar] = useState(false);
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
    let userformData = userUpdatedFormData;
    const hasUserUpdatedFormData = Object.keys(userUpdatedFormData).length > 0;
    if (!hasUserUpdatedFormData) {
      const { id, blocked, createdAt, updatedAt, confirmed, role, ...rest } = user;
      userformData = rest;
    }
    if (role !== MANAGER) {
      if (!userformData.profilePicture) {
        setShowSaveResetChangeBar(true);
        setNotificationBarMessageAndStatus({
          show: true,
          message: `Please, add profile picture.`
        });
        return;
      }
      if (!userformData.coverPhoto && role !== CLIENT) {
        setShowSaveResetChangeBar(true);
        setNotificationBarMessageAndStatus({
          show: true,
          message: `Please, add cover photo.`
        });
        return;
      }

      const isUsernameLengthValid = isInputLengthValid(userformData.username, 3);
      if (!isUsernameLengthValid) {
        setShowSaveResetChangeBar(false);
        setNotificationBarMessageAndStatus({
          show: true,
          message: 'Username must be at least 3 characters.'
        });
        return;
      };
    }

    let errors;
    if (role !== CLIENT) {
      errors = validateForm(userformData, false);
    } else if (role === CLIENT) {
      errors = validateForm(userformData, true);
    };
    const hasErrors = Object.keys(errors).length > 0;

    if (hasErrors) {
      setErrorMessage(errors);
      setShowSaveResetChangeBar(true);
      setNotificationBarMessageAndStatus({
        show: true,
        message: `Please correct the errors and try again.`
      });
      return;
    } else {
      setErrorMessage('');
      setShowSaveResetChangeBar(false);
      setNotificationBarMessageAndStatus({
        show: false,
        message: ''
      });
    };

    if (hasUserUpdatedFormData) {
      token && userId && user &&
        fetch(`${strapiBaseUrl}/api/users/${userId}`, {
          method: 'PUT',
          body: JSON.stringify(userformData),
          headers: {
            'Content-type': 'application/json',
            'authorization': `Bearer ${token}`
          }
        })
        .then(res => res.json())
        .then(data => {
          setShowSaveResetChangeBar(true);          
          if (data.error) {
            setNotificationBarMessageAndStatus({
              show: true,
              message: data?.error?.message,
            });
            return;
          } else {
            setNotificationBarMessageAndStatus({
              show: true,
              message: 'Changes applied successfully.'
            });
            setTimeout(() => {
              setShowSaveResetChangeBar(false);
              setNotificationBarMessageAndStatus({
                show: false,
                message: ''
              });
            }, 5000);
          }
        });
    }

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
        .then(response => {
          if (response.ok) {
            setShowSaveResetChangeBar(true);
            setNotificationBarMessageAndStatus({
              show: true,
              message: 'Request was sent successfuly'
            });
          } else throw new Error(`HTTP error! status: ${response.status}`);
        })
    };
  }

  const handleSaveButtonClick = () => {
    const unsavedUserData = {
      ...userUpdatedFormData,
      isApprovedByAdmin: false
    }

    const isUsernameLengthValid = isInputLengthValid(userUpdatedFormData.username, 3);
    if (!isUsernameLengthValid) {
      setShowSaveResetChangeBar(false);
      setNotificationBarMessageAndStatus({
        show: true,
        message: 'Username must be at least 3 characters.'
      });
      return;
    }

    token && userId && user &&
      useFetchData(`${strapiBaseUrl}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(unsavedUserData),
      }).then(data => {
        if (data.error || data.errors) {
          setShowSaveResetChangeBar(false);
          setNotificationBarMessageAndStatus({
            show: true,
            message: data.error.message
          });
        } else {
          setShowSaveResetChangeBar(false);
          setNotificationBarMessageAndStatus({
            show: true,
            message: 'Changes applied successfully.'
          });
          setTimeout(() => {
            setNotificationBarMessageAndStatus({
              show: false,
              message: ''
            });
          }, 3000);
          setIsApprovedByAdmin(false);
        }
      })
  }

  const handleCancelChangesButtonClick = () => {
    setShowSaveResetChangeBar(true);
    setTimeout(() => {
      setShowSaveResetChangeBar(false);
      setNotificationBarMessageAndStatus({
        show: false,
        message: ''
      });
    }, 3000);
    window.location.reload();
  };

  const handleSetChanges = (childState, childFormData) => {
    setErrorMessage('');
    setShowSaveResetChangeBar(childState);
    setNotificationBarMessageAndStatus({
      show: false,
      message: ''
    });
    setUserUpdatedFormData(childFormData);
  };

  return (
    <div className={`${styles.mainWrap} ${role === CLIENT ? styles.client : null}`}>
      <div className="dashboard">
        <form onSubmit={(e) => handleFormSubmit(e, role)}>
          {(showSaveResetChangeBar || notificationBarMessageAndStatus.show) && (
            <NotificationBar
              isApprovedByAdmin={user.isApprovedByAdmin}
              onCancelButtonClick={handleCancelChangesButtonClick}
              onSaveButtonClick={handleSaveButtonClick}
              notificationBarMessageAndStatus={notificationBarMessageAndStatus}
              showSaveResetChangeBar={showSaveResetChangeBar}
              userRole={role}
            />
          )}
          {role === SERVICE_PROVIDER &&
            <section className="page-width">
              <div className={`${styles.info}`}>
                <Text
                  className={`text-middle ${styles.approvedStatus}`}
                  tag={'span'}
                  children={isApprovedByAdmin ? 'Your account is approved by admin.' : 'Your account has not been approved by admin yet.'}
                />
                {!isApprovedByAdmin &&
                  <Button
                    type='submit'
                    variant={'main'}
                    children={'Request to review'}
                    className={styles.button}
                  />
                }
              </div>
            </section>
          }
          {user && role === SERVICE_PROVIDER &&
            <>
              <ServiceProviderDetails
                user={user}
                onChanges={handleSetChanges}
                showSaveResetChangeBar={showSaveResetChangeBar}
                errorMessage={errorMessage}
              />
            </>
          }
          {user && role === CLIENT &&
            <>
              <ClientDetails
                user={user}
                onChanges={handleSetChanges}
                showSaveResetChangeBar={showSaveResetChangeBar}
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
  );
}
