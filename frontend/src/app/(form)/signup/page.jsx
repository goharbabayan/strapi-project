'use client'

import Link from 'next/link';
import { useState } from 'react';
import styles from '../form.module.css';
import { SERVICE_PROVIDER, MANAGER, CLIENT } from '@/app/utils/constants/userRoles';
import Button from '@/components/button/Button.jsx';
import Text from '@/components/text/Text.jsx';
import CheckIcon from '@/components/icons/CheckIcon.jsx';
import PopUpCloseIcon from '@/components/icons/PopUpCloseIcon.jsx';
import { inputValidation, emailValidation, confirmPasswordValidation } from '@/app/utils/helpers';
import { useFetchData } from '@/app/utils/hooks/useFetch';
import FormInput from '@/components/formInput/FormInput';

export default function SignupPage() {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const formFields = [
    {
      id: 'username',
      placeholder: 'Username',
      name: 'username',
      label: 'Username',
      type: 'text',
      validate: (value) => {
        setFieldsValidation({
          ...fieldsValidation,
          username: inputValidation('Username', value, 3),
          show: false,
        });
      },
    },
    {
      id: 'email',
      placeholder: 'Email',
      name: 'email',
      label: 'Email',
      type: 'text',
      validate: (value) => {
        setFieldsValidation({
          ...fieldsValidation,
          email: emailValidation(value),
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
          confirm_password: confirmPasswordValidation(formData.confirm_password, value),
          show: false,
        });
      },
    },
    {
      id: 'confirm_password',
      placeholder: 'Repeat password',
      name: 'confirm_password',
      label: 'Repeat password',
      type: 'password',
      validate: (value) => {
        setFieldsValidation({
          ...fieldsValidation,
          confirm_password: confirmPasswordValidation(value, formData.password),
          show: false,
        });
      },
    },
  ];
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    role: '',
    isApprovedByAdmin: false,
  });
  const [fieldsValidation, setFieldsValidation] = useState({
    username: {
      isValid: false,
      errorMessage: 'Username is required.',
    },
    email: {
      isValid: false,
      errorMessage: 'Email is required.',
    },
    password: {
      isValid: false,
      errorMessage: 'Password is required.',
    },
    confirm_password: {
      isValid: false,
      errorMessage: 'Password confirmation is required.',
    },
    role: {
      isValid: false,
      errorMessage: 'Role is required.',
    },
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
    verificationSection: {
      show: false,
    },
    resendError:  {
      show: false,
    },
  });

  const updateData = (name, value) => {
    setShowState({
      ...showState,
      error: {
        show: false,
        message: '',
      }
    });
    if (name === 'role') {
      setFieldsValidation({
        ...fieldsValidation,
        role: {
          isValid: true,
          errorMessage: '',
        },
        show: false,
      });
      setFormData({
        ...formData,
        [name]: value,
        isApprovedByAdmin: value === CLIENT.roleNumber,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const hasAtLeastOneError = Object.values(fieldsValidation).some(field => field.isValid === false);
    if (hasAtLeastOneError) {
      setFieldsValidation({
        ...fieldsValidation,
        show: true,
      });
      return;
    };

    const {confirm_password, ...data} = formData;
    const fetchData = await useFetchData(`${baseUrl}/api/auth/local/register`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data),
    });

    if (fetchData?.error) {
      setShowState({
        ...showState,
        error: {
          show: true,
          message: fetchData?.error?.message,
        }
      });
    } else {
      setShowState({
        ...showState,
        success: {
          ...showState['success'],
          show: true,
        },
        verificationSection: {
          show: true,
        }
      })
    };
  };

  const handleButtonClick = async () => {
    setShowState({
      ...showState,
      success: {
        ...showState['success'],
        show: false,
      }
    });

    try {
      const fetchData = await useFetchData(`${baseUrl}/api/auth/send-email-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: `${formData.email}`
        })
      });
      if (fetchData?.sent) {
        setShowState({
          ...showState,
          success: {
            ...showState['success'],
            show: true,
          }
        })
      } else {
        setShowState({
          ...showState,
          resendError: {
            show: true,
            message: fetchData?.error?.message || 'Error sending email confirmation:'
          }
        });
      };
    } catch (err) {
      console.error('Unexpected error:', err);
    };
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
          <Text
            tag={'h2'}
            className={styles.heading}
            children={'Sign up'}
          />
          <form
            onSubmit={handleSubmit}
            className={`${styles.form} ${showState?.verificationSection?.show ? styles.hidden : ''}`}
          >
            <div className={styles.roleWrapper}>
              <div className={`${styles.roles} ${fieldsValidation?.show && fieldsValidation?.role?.isValid === false ? styles.redBorder : ''}`}>
                <Text
                  tag={'span'}
                  className={`${styles.role} ${SERVICE_PROVIDER.roleNumber === formData?.role ? styles.active : ''}`}
                  children={SERVICE_PROVIDER.name}
                  onClick={() => updateData('role', SERVICE_PROVIDER.roleNumber)}
                />
                <Text
                  tag={'span'}
                  className={`${styles.role} ${MANAGER.roleNumber === formData?.role ? styles.active : ''}`}
                  children={MANAGER.name}
                  onClick={() => updateData('role', MANAGER.roleNumber)}
                />
                <Text
                  tag={'span'}
                  className={`${styles.role} ${CLIENT.roleNumber === formData?.role ? styles.active : ''}`}
                  children={CLIENT.name}
                  onClick={() => updateData('role', CLIENT.roleNumber)}
                />
              </div>
              <Text
                tag={'span'}
                className={`${styles.errorMessage} ${styles.roleError} ${fieldsValidation?.show && fieldsValidation?.role?.isValid === false ? styles.show : ''}`}
                children={fieldsValidation?.role?.errorMessage}
              />
            </div>
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
              children={'Sign up'}
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
                children={'Already have an account?'}
              />
              <Link
                href='/login'
                className={styles.link}
              >
                Login
              </Link>
            </div>
          </form>
          <div className={`${styles.verification} ${showState?.verificationSection?.show ? styles.show : ''}`}>
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
            <div>
              <Text
                tag={'span'}
                className={styles.text}
                children={`Didn't receive a verification email? No worries, you can request a new one.`}
              />
              <Text
                tag={'span'}
                onClick={handleButtonClick}
                className={styles.link}
                children={'Resend'}
              />
            </div>
            {showState?.resendError?.show &&
              <Text
                tag={'span'}
                children={showState?.resendError?.message}
                className={`${styles.errorMessage} ${styles.show}`}
              />
            }
          </div>
        </div>
      </div>
    </section>
  );
}
