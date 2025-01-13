import { useContext, useState } from 'react';
import styles from './resetPassword.module.css';
import FormInput from '../formInput/FormInput';
import Text from '../text/Text';
import Button from '../button/Button';
import { AuthContext } from '@/app/Context';
import { isInputLengthValid } from '@/app/utils/helpers';
import { inputValidation, confirmPasswordValidation } from '@/app/utils/helpers';
import { useFetchData } from '@/app/utils/hooks/useFetch';

export default function ResetPassword({className}) {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const {setCustomerToken} = useContext(AuthContext);
  const {customerToken} = useContext(AuthContext);
  const [formData, setFormData] = useState({
    currentPassword: '',
    password: '',
    passwordConfirmation: '',
  });
  const [showState, setShowState] = useState({
    error: {
      show: false,
      message: '',
    },
    success: {
      message: 'Password successfully changed!'
    }
  });
  const [fieldsValidation, setFieldsValidation] = useState({
    currentPassword: {
      isValid: false,
      errorMessage: 'Current password is required.',
    },
    password: {
      isValid: false,
      errorMessage: 'New Password is required.',
    },
    passwordConfirmation: {
      isValid: false,
      errorMessage: 'Password confirmation is required.',
    },
    show: false,
  });

  const formFields = [
    {
      id: 'current_password',
      placeholder: 'current password',
      name: 'currentPassword',
      label: 'Current password',
      type: 'password',
      validate: (value) => {
        setFieldsValidation({
          ...fieldsValidation,
          currentPassword: inputValidation('Current password', value, 6),
          show: false,
        });
      },
    },
    {
      id: 'new_password',
      placeholder: 'new password',
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
      id: 'repeat_new_password',
      placeholder: 'repeat new password',
      name: 'passwordConfirmation',
      label: 'Repeat new password',
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

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const hasAtLeastOneError = Object.values(fieldsValidation).some(field => field.isValid === false);
    if (hasAtLeastOneError) {
      setFieldsValidation({
        ...fieldsValidation,
        show: true,
      });
      return;
    };

    if (!customerToken) navigate('/login');
    const data = await useFetchData(`${baseUrl}/api/auth/change-password?`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Authorization': `Bearer ${customerToken}`,
        'Content-type': 'application/json',
      }
    });

    if (data.error) {
      setShowState({
        ...showState,
        error: {
          show: true,
          message: data?.error?.message || 'Password change failed.'
        }
      });
    } else if (data.user) {
      const token = data.jwt;
      localStorage.setItem('token', JSON.stringify(token));
      setCustomerToken(token);
      setShowState({
        error: {
          show: false,
          message: '',
        },
        success: {
          ...showState?.success,
          show: true,
        }
      });
      setTimeout(() => {
        setShowState({
          ...showState,
          success: {
            ...showState?.success,
            show: false,
          }
        })
      }, 5000);
    };
  };

  const handleDataChange = (name, value) => {
    setShowState({
      ...showState,
      error: {
        show: false,
        message: '',
      }
    });
    setFormData({...formData, [name]: value});
  };

  return (
    <div className="page-width">
      <section className={`${styles.mainWrap} ${className ? className : ''}`}>
        <div className={`${styles.container}`}>
          <Text
            tag={'h3'}
            className={styles.title}
            children={'Change password'}
          />
          <div className={styles.content}>
          {formFields.map((input) => {
            const {id, name, label, type, placeholder, disabled, validate} = input;
            return (
              <FormInput
                key={id}
                error={fieldsValidation[name].errorMessage && fieldsValidation[name].errorMessage}
                id={id}
                placeholder={placeholder}
                name={name}
                label={label}
                value={formData[name] || ''}
                type={type}
                isRequired={true}
                updateData={handleDataChange}
                validate={validate}
                showError={fieldsValidation?.show}
                showInfoIcon={name === 'email' ? true : false}
              />
            )
          })}
          </div>
          <Button
            variant={'main'}
            onClick={handleChangePassword}
            children={'Save changes'}
          />
        </div>
        <div className={styles.messageContainer}>
          {showState?.error?.show &&
            <Text
              tag={'span'}
              children={showState?.error?.message}
              className={`${styles.error}`}
            />
          }
          {showState?.success?.show &&
            <Text
              tag={'span'}
              children={showState?.success?.message}
              className={`${styles.successMessage}`}
            />
          }
        </div>
      </section>
    </div>
  )
};
