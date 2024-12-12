'use client'

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { RESET_PASSWORD_MUTATION } from '@/app/graphql/resetPasswordMutation.js';
import { navigate } from '@/app/actions';
import styles from '../form.module.css';
import Loading from '@/app/loading';
import Button from '@/components/button/Button.jsx';
import Text from '@/components/text/Text.jsx';
import { confirmPasswordValidation, inputValidation } from '@/app/utils/helpers';
import FormInput from '@/components/formInput/FormInput';

export default function ResetPage() {
  const searchParams = useSearchParams();
  const privateCode = searchParams.get('code');
  const [formData, setFormData] = useState({
    code: privateCode,
    password: '',
    passwordConfirmation: '',
  });
  const formFields = [
    {
      id: 'new_password',
      placeholder: 'New password',
      name: 'password',
      label: 'New password',
      type: 'password',
      validate: (value) => {
        setFieldsValidation({
          ...fieldsValidation,
          password: inputValidation('New password', value, 6),
          passwordConfirmation: confirmPasswordValidation(formData?.passwordConfirmation, value),
          show: false,
        });
      },
    },
    {
      id: 'confirm_password',
      placeholder: 'Repeat password',
      name: 'passwordConfirmation',
      label: 'Repeat password',
      type: 'password',
      validate: (value) => {
        setFieldsValidation({
          ...fieldsValidation,
          passwordConfirmation: confirmPasswordValidation(value, formData?.password),
          show: false,
        });
      },
    },
  ];
  const [fieldsValidation, setFieldsValidation] = useState({
    password: {
      isValid: false,
      errorMessage: 'New password is required.',
    },
    passwordConfirmation: {
      isValid: false,
      errorMessage: 'Password confirmation is required.',
    },
    show: false,
  });
  const [showState, setShowState] = useState({
    error: {
      show: false,
      message: '',
    },
    loading: false,
    success: {
      show: false,
    }
  });
  const [resetPassword, { loading, error, data }] = useMutation(RESET_PASSWORD_MUTATION, {
    onError: (err => {
      console.log(err);
      setShowState({
        ...showState,
        error: {
          show: true,
          message: 'Reset password failed.',
        }
      });
      return;
    }),
    onCompleted: (data) => {
      setShowState({
        ...showState,
        success: {
          message: 'Password reset complete. You can now log in with your new password.',
          show: true,
        }
      });

      setTimeout(() => {
        navigate('/login');
      }, 5000)
    }
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

    const privateCodeDoesNotExist = privateCode === '' || privateCode === null;
    if (privateCodeDoesNotExist) {
      setShowState({
        ...showState,
        error: {
          show: true,
          message: 'Reset password failed.'
        },
      });
      return;
    };

    const hasAtLeastOneError = Object.values(fieldsValidation).some(field => field.isValid === false);
    if (hasAtLeastOneError) {
      setFieldsValidation({
        ...fieldsValidation,
        show: true,
      });
      return;
    };
    await resetPassword({ variables: formData});
  };

  return (
    <Suspense>
      {loading ? <Loading /> :
        <section className="page-width">
          <div className={styles.mainWrapper}>
            <div className={styles.wrapper}>
              <Text
                tag={'h2'}
                className={styles.heading}
                children={'Reset password'}
              />
              <form
                className={`${styles.form} ${showState?.success?.show ? styles.hidden : ''}`}
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
                <Button
                  type={'submit'}
                  children={'Reset Password'}
                  className={styles.submitButton}
                  variant={'main'}
                />
                <div className={styles.errorWrapper}>
                  {showState?.error?.show &&
                    <Text
                      tag={'span'}
                      children={showState?.error?.message}
                      className={`${styles.errorMessage} ${styles.show}`}
                    />
                  }
                </div>
              </form>
              {showState?.success?.show  &&
                <Text
                  tag={'span'}
                  children={showState?.success?.message}
                  className={`${styles.subtitle}`}
                />
              }
            </div>
          </div>
        </section>
      }
    </Suspense>
  );
}
