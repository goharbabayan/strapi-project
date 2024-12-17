'use client'

import Link from 'next/link';
import { useState, useContext } from 'react';
import styles from '../form.module.css'
import { navigate } from '@/app/actions';
import Loading from '@/app/loading';
import Text from '@/components/text/Text';
import { AuthContext } from '@/app/Context';
import Button from '@/components/button/Button';
import FormInput from '@/components/formInput/FormInput';
import { inputValidation, emailValidation } from '@/app/utils/helpers';
import { useFetchData } from '@/app/utils/hooks/useFetch';

export default function LoginPage() {
  const {setCustomerToken, setLoggedInUserData} = useContext(AuthContext);
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const formFields = [
    {
      id: 'identifier',
      placeholder: 'Email',
      name: 'identifier',
      label: 'Email',
      type: 'text',
      validate: (value) => {
        setFieldsValidation({
          ...fieldsValidation,
          identifier: emailValidation(value),
          show: false,
        });
      },
    },
    {
      id: 'password',
      placeholder: 'Password',
      name: 'password',
      label: 'Password',
      type: 'password',
      validate: (value) => {
        setFieldsValidation({
          ...fieldsValidation,
          password: inputValidation('Password', value, 6),
          show: false,
        });
      },
    },
  ];
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [fieldsValidation, setFieldsValidation] = useState({
    identifier: {
      isValid: false,
      errorMessage: 'Email is required.',
    },
    password: {
      isValid: false,
      errorMessage: 'Password is required.',
    },
    show: false,
  });
  const [showState, setShowState] = useState({
    error: {
      show: false,
      message: '',
    },
    loading: false,
  });

  const updateData = (name, value) => {
    setShowState({
      error: {
        show: false,
        message: '',
      }
    });
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasAtLeastOneError = Object.values(fieldsValidation).some(field => field.isValid === false);
    if (hasAtLeastOneError) {
      setFieldsValidation({
        ...fieldsValidation,
        show: true,
      });
      return;
    };

    setShowState({
      ...showState,
      loading: true,
    });

    const fetchData = await useFetchData(`${baseUrl}/api/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
    });

    const {jwt, error, user} = fetchData;
    if (user && jwt) {
        const userName = user?.username;
        localStorage.setItem('token', JSON.stringify(jwt));
        localStorage.setItem('loggedInUserdata', JSON.stringify({
          id: user?.id,
          role: user?.role?.type,
        }));
        setCustomerToken(jwt);
        setLoggedInUserData({
          id: user?.id,
          role: user?.role?.type
        })
        userName && navigate(`/my-account/${userName}`);
    } else {
      setShowState({
        ...showState,
        loading: false,
        error: {
          show: true,
          message: error?.message || 'Login failed.'
        }
      });
    };
  };

  return (
    <>
      {showState?.loading
        ?
          <Loading/>
        :
        <section className="page-width">
          <div className={styles.mainWrapper}>
            <div className={styles.wrapper}>
              <div className={styles.container}>
                <Text
                  tag={'h2'}
                  className={styles.heading}
                  children={'Welcome Back'}
                />
                <Text
                  tag={'h4'}
                  className={styles.subtitle}
                  children={`Today is a new day. It's your day. You shape it. Sign in to start managing your projects.`}
                />
              </div>
              <form
                className={styles.form}
                onSubmit={handleSubmit}
              >
                {formFields.map((input) => {
                  const {id, name, label, type, placeholder, validate} = input;
                  return (
                    <FormInput
                      key={id}
                      error={fieldsValidation[name].errorMessage}
                      id={id}
                      placeholder={placeholder}
                      name={name}
                      label={label}
                      value={formData[name]}
                      type={type}
                      isRequired={true}
                      updateData={updateData}
                      validate={validate}
                      showError={fieldsValidation.show}
                    />
                  )}
                )}
                <div className={styles.forgotLink}>
                  <Link
                    href='/recover'
                    className={styles.forgot}
                  >
                    Forgot password?
                  </Link>
                </div>
                <Button
                  type={'submit'}
                  children={'Login'}
                  className={styles.submitButton}
                  variant={'main'}
                />
                <div>
                  {showState?.error?.show &&
                    <Text
                      tag={'span'}
                      children={showState?.error?.message}
                      className={`${styles.errorMessage} ${styles.show}`}
                    />
                  }
                  <Text
                    tag={'span'}
                    className={styles.text}
                    children={`Don't you have an account?`}
                  />
                  <Link
                    href='/signup'
                    className={styles.link}
                  >
                    Sign up
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </section>
      }
    </>
  );
}
