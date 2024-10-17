import { useState } from 'react';
import styles from './accountDetails.module.css';
import EditIcon from '../icons/Edit';
import Button from '../button/Button';
import InputField from '../inputField/InputField';
import Text from '../text/Text';
import { navigate } from '@/app/actions';
import ResetPassword from '../resetPassword/ResetPassword';

export default function AccountDetails({
  username,
  errorMessage,
  password,
  email,
  id,
  onChange,
  onEditIconClick,
  isManagerDashboard,
  isClientDashboard,
  isApprovedByAdmin,
}) {

  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const [error, setError] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showRequestMessage, setShowRequestMessage] = useState(false);
  const [newPasswordData, setNewPasswordData] = useState({
    currentPassword: '',
    password: '',
    passwordConfirmation: '',
  })

  const handlePasswordDataChange = (e) => {
    setShowErrorMessage(false);
    setError('');
    setNewPasswordData({...newPasswordData, [e.target.name]:  e.target.value})
  }

  const handleReviewButtonClick = (e) => {
    onChange(e, true);
    setShowRequestMessage(true);
    setTimeout(() => {
      setShowRequestMessage(false);
    }, 5000);
  }

  const handleChangePassword = (e) => {
    e.preventDefault();
    const password = newPasswordData.password;
    const confirmPassword = newPasswordData.passwordConfirmation;
    const currentPassword = newPasswordData.currentPassword;

    // check validation
    if (password === '') {
      setShowErrorMessage(true);
      setError('Please enter new password.');
      return;
    } else if (confirmPassword === '') {
      setShowErrorMessage(true);
      setError('Please enter password confirmation.');
      return;
    } else if (currentPassword === '') {
      setShowErrorMessage(true);
      setError('Please enter Your current password.');
      return;
    } else if (password != confirmPassword) {
      setShowErrorMessage(true);
      setError('Password and password confirmation do not match.');
      return;
    }
    // end check validation

    const token = JSON.parse(localStorage.getItem('token'))
    if (!token) navigate('/login');
    try {
      fetch(`${baseUrl}/api/auth/change-password?`, {
        method: 'POST',
        body: JSON.stringify(newPasswordData),
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-type': 'application/json',
        }
      })
      .then(resp => resp.json())
      .then(data => {
        if (data.error) {
          setShowErrorMessage(true);
          setError(data.error.message);
        } else if (data.user) {
          const token = data.jwt;
          localStorage.setItem("token", JSON.stringify(token));
          setShowSuccessMessage(true);
          setTimeout(() => {
            setShowSuccessMessage(false);
          }, 5000);
        }
      })
    } catch (err) {
      console.log('error', err);
    }
  }

  const handleAddNewMember = (e) => {
    navigate(`/my-account/${username}/new-member?email=${email}&id=${id}`);
  }

  const handleShowMembers = (e) => {
    navigate(`/my-account/${username}/members?id=${id}&email=${email}`);
  }

  return (
    <section className={`${styles.infoWrap} ${(isManagerDashboard || isClientDashboard) ? styles.row : ''}`}>
      {!(isManagerDashboard || isClientDashboard) &&
        <Text
          tag={'h2'}
          className={styles.heading}
          children={'Account Details'}
        />
      }
      <div className={`${isClientDashboard ? styles.clientDashboard : styles.centered} ${isManagerDashboard ? styles.column : ''}`}>
        {(isManagerDashboard  || isClientDashboard )&&
          <Text
            tag={'h3'}
            className={styles.subtitle}
            children={'Account Details'}
          />
        }
        <div className={`${(isManagerDashboard || isClientDashboard) ? styles.manager : ''} ${styles.profileName}`} data-username>
          <InputField 
            label='Username*'
            type='text'
            name='username'
            id='username'
            className={styles.input}
            value={username}
            onChange={onChange}
            isRequired={true}
            errorMessage={errorMessage}
          />
          <EditIcon className={styles.editIcon} onClick={(e) => onEditIconClick(e, 'data-username')}/>
        </div>
        {(isManagerDashboard || isClientDashboard )&&
          <div className={`${styles.emailWrapper}`}>
            <div className={`${styles.email} ${styles.manager}`} data-address>
              <InputField 
                label='Email address:'
                type='text'
                name='email'
                id='email'
                className={styles.input}
                value={email}
                disabled
                errorMessage={errorMessage}
              />
            </div>
            {showRequestMessage &&
              <Text
                tag={'span'}
                className={`text-small ${styles.successMessage} ${styles.show} ${styles.requestMessage}`}
                children={'Your request was successfully sent.'}
              />
            }
          </div>
        }
        {isManagerDashboard ?
          isApprovedByAdmin
            ?
              <div className='buttonsWrap'>
                <Button children={'Create new member'} onClick={handleAddNewMember} className='btn button'/>
                <Button children={'My members list'} onClick={handleShowMembers} className='btn button'/>
              </div>
            :
              <div className={`buttonsWrap ${styles.buttons}`}>
                <Button children={'Request to review profile'} onClick={(e) => handleReviewButtonClick(e)} className={`btn button`}/>
              </div>
          :
          <></>
        }
      </div>
      <div className={`${isManagerDashboard ? styles.column : '' } ${isClientDashboard ? styles.clientDashboard : ''} `}>
        <ResetPassword />
      </div>
    </section>
  )
}
