import { forwardRef, useContext, useState } from 'react';
import styles from './resetPassword.module.css';
import InputField from '../inputField/InputField';
import Text from '../text/Text';
import Button from '../button/Button';
import { AuthContext } from '@/app/Context';

const ResetPassword = forwardRef(({password}, ref) => {
// ToDo: please check if the password and ref params are used in this component
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const {setCustomerToken} = useContext(AuthContext);
  const [error, setError] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [newPasswordData, setNewPasswordData] = useState({
    currentPassword: '',
    password: '',
    passwordConfirmation: '',
  });

  const handleChangePassword = (e) => {
    e.preventDefault();
    const password = newPasswordData.password;
    const confirmPassword = newPasswordData.passwordConfirmation;
    const currentPassword = newPasswordData.currentPassword;

    // check validation
    if (password === '' || confirmPassword === '' || currentPassword === '') {
      setShowErrorMessage(true);
      setError('Please fill in all required fields.');
      return;
    } else if (password != confirmPassword) {
      setShowErrorMessage(true);
      setError('Password and password confirmation do not match.');
      return;
    }
    // end check validation

    const token = JSON.parse(localStorage.getItem('token'));
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
          localStorage.setItem('token', JSON.stringify(token));
          setCustomerToken(token);
          setShowSuccessMessage(true);
          setTimeout(() => {
            setShowSuccessMessage(false);
          }, 5000);
        }
      })
    } catch (err) {
      console.log('error', err);
    }
  };

  const handleDataChange = (e) => {
    setShowErrorMessage(false);
    setError('');
    setNewPasswordData({...newPasswordData, [e.target.name]:  e.target.value});
  };

  return (
    <section className={`${styles.container} section`} ref={ref}>
      <h3 className={`subtitle ${styles.center}`}>Change password</h3>
      <div className={`${styles.container}`}>
        <div className={`${styles.passwordContainer} ${styles.newPassword}`}>
          <InputField 
            label='Current Password*'
            type='password'
            name='currentPassword'
            id='current_password'
            className={styles.input}
            value={newPasswordData.currentPassword}
            onChange={handleDataChange}
            isPassword={true}
          />
          <InputField 
            label='New Password*'
            type='password'
            name='password'
            id='password'
            className={styles.input}
            value={password}
            onChange={handleDataChange}
            isPassword={true}
          />
          <InputField 
            label='Confirm Password*'
            type='password'
            name='passwordConfirmation'
            id='confirm_password'
            className={styles.input}
            value={password}
            onChange={handleDataChange}
            isPassword={true}
          />
        </div>
        <Text
          tag={'span'}
          className={`errorMessage ${styles.error} ${showErrorMessage ? styles.show : ''} text-small`}
          children={error}
        />
        <Text
          tag={'span'}
          className={`${styles.successMessage} ${showSuccessMessage ? styles.show : ''} text-small`}
          children={'Password succesfully changed.'}
        />
      </div>
      <div className={`${styles.buttonWrap}`}>
        <Button className={`btn button`} onClick={handleChangePassword}>Save new password</Button>
      </div>
    </section>
  )
});

export default ResetPassword;
