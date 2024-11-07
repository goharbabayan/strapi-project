'use client'

import Link from 'next/link';
import { useState } from 'react';
import Button from '@/components/button/Button.jsx';
import FormInput from '@/components/form/FormInput';
import FormSubmitButton from '@/components/form/FormSubmitButton';
import Layout from './layout.jsx';
import styles from './Signup.module.css';

export default function SignupPage() {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const formFields = [
    {id: 'username', type: 'text', placeholder: 'Username', name: 'Username', value: ''},
    {id: 'email', type: 'email', placeholder: 'Email', name: 'Email', value: ''},
    {id: 'password', type: 'password', placeholder: 'Password', name: 'Password', value: ''},
    {id: 'confirm_password', type: 'password', placeholder: 'Confirm password', name: 'Confirm password', value: ''},
  ]
  const [formData, setFormData] = useState(formFields);
  const [errorMessage, setErrorMessage] = useState({type: '', text: ''});
  const [showResendErrorMessage, setShowResendErrorMessage] = useState({text: ''});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showResendSuccesfullMessage, setShowResendSuccesfullMessage] = useState(false);
  const [selectedRole, setSelectedRole] = useState('select');
  const [role, setRole] = useState(null);
  const [isApproved, setIsApproved] = useState(false);

  let userData = {};
  formData.forEach((field) => {
    userData[field.id] = field.value;
  });

  const handleChange = (event) => {
    const index = formData.findIndex((field) => field.name === event.target.name);
    if (index !== -1) {
      setFormData([
        ...formData.slice(0, index),
        { ...formData[index], value: event.target.value },
        ...formData.slice(index + 1),
      ]);
      setErrorMessage({type: '', text: ''});
    }
  };

  const handleSelect = (e) => {
    setErrorMessage({type: '', text: ''});
    let selectedRole = e.target.value;
    setSelectedRole(selectedRole);
    if (selectedRole === 'client') {
      setRole(7);
      setIsApproved(true);
    } else if (selectedRole === 'manager') {
      setRole(6);
      setIsApproved(true);
    } else if (selectedRole === 'service_provider') {
      setRole(8);
      setIsApproved(false);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!userData) {
      throw new Error('Missing user data');
    };

    const userNameValue = userData.username;
    const passwordValue = userData.password;
    const confirmedPasswordValue = userData.confirm_password;
    const emailValue = userData.email;
    const emailRegex = /^[a-zA-Z0-9._%±]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
    const isEmailValueValid = emailRegex.test(emailValue);
    const isUsernameAtLeastThreeCharacters = userData.username && userData.username.length < 3;
    const isPasswordAtLeastSixCharacters = userData.password && userData.password.length < 6;
    const registerData = {
      'username': userNameValue,
      'email': emailValue,
      'password': passwordValue,
      'role': role,
      'isApprovedByAdmin': isApproved
    }

    if (confirmedPasswordValue && passwordValue != confirmedPasswordValue) {
      setErrorMessage({type: 'confirm_password', text: 'Passwords do not match.'});
      return;
    } else if (emailValue && !isEmailValueValid) {
      setErrorMessage({type: 'email', text: 'Please enter a valid email address.'});
      return;
    } else if (isUsernameAtLeastThreeCharacters) {
      setErrorMessage({type: 'username', text: 'Username must be at least 3 characters.'});
      return;
    } else if (isPasswordAtLeastSixCharacters) {
      setErrorMessage({type: 'password', text: 'Password must be at least 6 characters.'});
      return;
    } else if (role == null) {
      setErrorMessage({type: 'role', text: 'Please choose your role to continue.'});
      return;
    }

    await fetch(`${baseUrl}/api/auth/local/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerData),
      })
      .then(response => response.json())
      .then(json => {
        const {data, error, user} = json;
        if (error) {
          const errorMessage = error.message;
          const notUniqueUserNameMessage = errorMessage.includes('This attribute must be unique');
          const emailTakenMessage = errorMessage.includes('Email already taken');
          const notValidEmailMessage = errorMessage.includes('email must be a valid email');
          const notValidPasswordMessage = errorMessage.includes('password must be at least 6 characters');
          const userNameInValidMessage = errorMessage.includes('username must be at least 3 characters');
          const notValidIdentifierMessage = errorMessage.includes('Invalid identifier or password');
          if (emailTakenMessage) {
            setErrorMessage({type: 'email', text: 'This email address is already in use.'});
          } else if (notValidEmailMessage) {
            setErrorMessage({type: 'email', text: 'Please enter a valid email address.'});
          } else if (notUniqueUserNameMessage) {
            setErrorMessage({type: 'username', text: 'This username is already in use.'});
          } else if (notValidPasswordMessage) {
            setErrorMessage({type: 'password', text: 'Password must be at least 6 characters.'});
          } else if (userNameInValidMessage) {
            setErrorMessage({type: 'username', text: 'Username must be at least 3 characters.'});
          } else if (notValidIdentifierMessage) {
            setErrorMessage({type: 'password', text: 'Looks like your email or password is incorrect. Please try again'});
          } else {
            setErrorMessage({type: 'password', text: errorMessage});
          }
        } else if (user) {
          setShowSuccessMessage(true);
        }
      })
      .catch(err => {
        console.error('Error sending email confirmation:', err);
      });
  };

  const handleButtonClick = async () => {
    try {
      fetch(`${baseUrl}/api/auth/send-email-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: `${userData.email}`
        })
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errorData => {
            if (errorData.statusCode === 400) {
              setShowResendErrorMessage({ text: errorData.message });
            } else {
              setShowResendErrorMessage({ text: 'An unexpected error occurred. Please try again later.' });
            }
            throw new Error('Email confirmation failed');
          });
        }
        return response;
      })
      .then(data => {
        setShowResendSuccesfullMessage(true);
      })
      .catch(error => {
        console.error('Error sending email confirmation:', error);
        setShowResendErrorMessage({ text: 'Email confirmation failed.' });
      });
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  }

  return (
    <Layout>
      <div className={styles.mainWrap}>
        <div className={styles.formWrapper}>
          <h2 className='subtitle'>Sign Up</h2>
          <form onSubmit={handleSubmit} className={`${styles.form} ${showSuccessMessage ? styles.hidden : ''}`}>
            <div className={styles.roleWrap}>
              <label htmlFor='role' className='text-small'>What are you registering as?</label>
              <select id='role' name='role' required value={selectedRole} onChange={handleSelect} className='text-small'>
                <option value='select' disabled className='text-small'>-- Select Role --</option>
                <option value='client' className='text-small'>Client</option>
                <option value='manager' className='text-small'>Manager</option>
                <option value='service_provider' className='text-small'>Service Provider</option>
              </select>
              <span className={styles.errorMessage}>{errorMessage.text != '' && (errorMessage.type == 'role') ? errorMessage.text : ''}</span>
            </div>
            {formData.map((input) => (
              <FormInput
                key={input.id}
                id={input.id}
                type={input.type}
                placeholder={input.placeholder}
                name={input.name}
                errorMessage={errorMessage.text != '' && (errorMessage.type == input.id) ? errorMessage.text : ''}
                onChange={handleChange}
                value={input.value}
                formData={formData}
              />
            ))}
            <FormSubmitButton buttonText={"Sign up"}/>
            <div className={`${styles.signupText}`}>
              <Link href='/login' className={styles.link}>Already have an account?</Link>
              <Link href='/login' className={styles.loginButton}>Login</Link>
            </div>
          </form>
          <div className={`${styles.succesfullMessage} ${showSuccessMessage ? styles.show : ''}`}>
            <h2 className={`${styles.varificationMessage}`}>{`We've sent a verification email to your '${userData.email}' email. Please check your inbox (including spam) and click the link to activate your account and log in.`}</h2>
            <p>Didn't receive a verification email? No worries, you can request a new one below.</p>
            <Button className={styles.loginButton} onClick={handleButtonClick}>Resend</Button>
            <div className={`${styles.message}`}>
             <span className={`${styles.errorMessage} ${showResendErrorMessage ? styles.show : ''}`}>{showResendErrorMessage.text}</span>
             <span className={`${styles.succesfullMessage} ${showResendSuccesfullMessage ? styles.show : ''}`}>Email confirmation sent successfully</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
