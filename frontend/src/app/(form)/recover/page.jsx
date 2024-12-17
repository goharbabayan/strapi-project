'use client'

import Link from 'next/link';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { FORGOT_PASSWORD_MUTATION } from '@/app/graphql/forgotPasswordMutation';
import styles from '../form.module.css';
import Button from '@/components/button/Button.jsx';
import Text from '@/components/text/Text.jsx';
import CheckIcon from '@/components/icons/CheckIcon.jsx';
import PopUpCloseIcon from '@/components/icons/PopUpCloseIcon.jsx';
import { emailValidation } from '@/app/utils/helpers';
import FormInput from '@/components/formInput/FormInput';

export default function RecoverPage() {
  const [formData, setFormData] = useState({
    id: 'email',
    placeholder: 'Email',
    name: 'email',
    label: 'Email',
    type: 'text',
    validate: (value) => {
      setFieldValidation({
        ...emailValidation(value),
        show: false,
      });
    },
    email: '',
  });
  const [fieldValidation, setFieldValidation] = useState({
    isValid: false,
    errorMessage: 'Email is required.',
    show: false,
  });
  const [showState, setShowState] = useState({
    success: {
      show: false,
      title: 'Link Successfully sent',
      text: 'We have sent an email please check',
    },
    error: {
      show: false,
      message: '',
    },
  });
  const [forgotPassword, { loading: confirmatinLoading, error: confirmationError, data: confirmationData }] = useMutation(FORGOT_PASSWORD_MUTATION, {
    onError: (err => {
      setShowState({
        ...showState,
        error: {
          show: true,
          message: err.message,
        }
      });
    }),
    onCompleted: ((data) => {
      setShowState({
        ...showState,
        success: {
          ...showState['success'],
          show: true,
        }
      });
    }),
  });

  const updateData = (name, value) => {
    setShowState({
      ...showState,
      error: {
        show: false,
        message: '',
      }
    });
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const hasError = fieldValidation?.isValid === false;
    if (hasError) {
      setFieldValidation({
        ...fieldValidation,
        show: true,
      });
      return;
    };

    await forgotPassword({
      variables: {
        email: `${formData?.email}`
      }
    });
  };

  const handleCloseButtonClick = () => {
    setShowState({
      ...showState,
      success: {
        ...showState['success'],
        show: false,
      }
    })
  };

  return (
    <section className="page-width">
      <div className={styles.mainWrapper}>
        <div className={styles.wrapper}>
          <div className={styles.container}>
            <Text
              tag={'h2'}
              className={styles.heading}
              children={'Forget Password ?'}
            />
            <div>
              <Text
                tag={'h4'}
                className={styles.subtitle}
                children={` Enter the email address associated with your account.`}
              />
              <Text
                tag={'h4'}
                className={styles.subtitle}
                children={`If you have an account, we'll send a reset link to your email.`}
              />
            </div>
          </div>
          <form
            className={`${styles.form} ${showState?.success?.show ? styles.hidden : ''}`}
            onSubmit={handleSubmit}
          >
            <FormInput
              key={formData?.id}
              error={fieldValidation?.errorMessage}
              id={formData?.id}
              placeholder={formData?.placeholder}
              name={formData?.name}
              label={formData?.label}
              value={formData?.email}
              type={formData?.type}
              isRequired={true}
              updateData={updateData}
              validate={formData?.validate}
              showError={fieldValidation?.show}
            />
            <Button
              type={'submit'}
              children={'Forgot password'}
              className={styles.submitButton}
              variant={'main'}
            />
          </form>
          <div className={`${styles.backToLogin} ${showState?.success?.show ? styles.hidden : ''}`}>
            {showState?.error?.show &&
              <Text
                tag={'span'}
                children={showState?.error?.message}
                className={`${styles.errorMessage} ${styles.show}`}
              />
            }
            <Link
              href='/login'
              className={styles.textMiddle}
            >
              Back to Login
            </Link>
          </div>
          <div className={`${styles.successMessageWrapper} ${showState?.success?.show ? styles.show : ''}`}>
            <div className={styles.textWrap}>
              <CheckIcon/>
              <div>
                <Text
                  className={`${styles.successMessage} ${styles.show}`}
                  tag={'span'}
                  children={showState?.success?.title}
                />
                <Text
                  className={styles.textSmall}
                  tag={'span'}
                  children={showState?.success?.text}
                />
              </div>
            </div>
            <PopUpCloseIcon
              className={styles.closeButton}
              onClick={handleCloseButtonClick}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
