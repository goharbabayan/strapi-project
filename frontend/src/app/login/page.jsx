'use client'

import Link from 'next/link';
import { useState } from 'react';
import { navigate } from '../../app/actions';
import Loading from '../loading';
import Layout from './layuot.jsx';
import styles from './login.module.css';
import FormInput from '@/components/form/FormInput';
import FormSubmitButton from '@/components/form/FormSubmitButton';

export default function LoginPage() {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const [ isLoading, setIsLoading ] = useState(false);
  const formFields = [
    {id: 'email', type: 'email', placeholder: 'Email', name: 'Email', value: ''},
    {id: 'password', type: 'password', placeholder: 'Password', name: 'Password', value: ''},
  ]
  const [formData, setFormData] = useState(formFields);
  const [errorMessage, setErrorMessage] = useState({type: '', text: ''});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const userData = {};
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
      }
      setIsLoading(true)
      await fetch(`${baseUrl}/api/auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({'identifier': emailValue, 'password': passwordValue })
      })
      .then(resp => {
        if (resp.status !== 200) {
          const errorData = resp.json();
          errorData.then(error => {
            const errorMessage = error?.error?.message;
            setErrorMessage({type: 'password', text: errorMessage ? errorMessage : 'Login failed.'});
          });
        } else {
          return resp.json();
        }
      })
      .then(data => {
        const isLoggedinSuccesfully = data != undefined;
        const token = isLoggedinSuccesfully && data.jwt;
        if (isLoggedinSuccesfully && token) {
          const userName = data.user.username;
          localStorage.setItem('token', JSON.stringify(token));
          navigate(`/my-account/${userName}`);
          setIsLoading(false);
        }
      })
      .catch(err => console.error(err));
  };

  return (
    <>
    {isLoading ? <Loading className={styles.loading} /> :
      <Layout>
        <div className={styles.mainWrap}>
          <div className={styles.formWrapper}>
            <div className={styles.forgotPassword}>
              <h2 className="subtitle">Login</h2>
            </div>
            <form onSubmit={handleSubmit} className={`${styles.form} ${showSuccessMessage ? styles.hidden : ''}`}>
              {formData.map((input) => (
                <FormInput
                  key={input.id}
                  id={input.id}
                  type={input.type}
                  placeholder={input.placeholder}
                  name={input.name}
                  formData={formData}
                  errorMessage={errorMessage.text != '' && (errorMessage.type == input.id) ? errorMessage.text : ''}
                  onChange={handleChange}
                  value={input.value}
                />
              ))}
              <FormSubmitButton buttonText={"Login"}/>
              <Link href='/recover' className={`${styles.link} ${styles.forgotPassword}`}>Forgot password?</Link>
              <div className={styles.loginText}>
                <Link href='/signup' className={styles.link}>I don't have an account.</Link>
                <Link href='/signup' className={styles.loginButton}>Sign up</Link>
              </div>
            </form>
          </div>
        </div>
      </Layout>
      }
    </>
  );
}
