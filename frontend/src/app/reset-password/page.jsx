'use client'

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { RESET_PASSWORD_MUTATION } from '../graphql/resetPasswordMutation.js'; 
import Layout from './layuot.jsx';
import styles from './reset-password.module.css';
import FormInput from '@/components/form/FormInput';
import FormSubmitButton from '@/components/form/FormSubmitButton';
import { navigate } from '../actions.js';
import Loading from '../loading.js';

export default function ResetPage() {
  const formFields = [
    { id: 'new_password', type: 'password', placeholder: 'New password', name: 'New password', value: '' },
    { id: 'confirm_new_password', type: 'password', placeholder: 'Confirm password', name: 'Confirm new password', value: ''},
  ]

  const [formData, setFormData] = useState(formFields);
  const [errorMessage, setErrorMessage] = useState({type: '', text: ''});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [resetPassword, { loading, error, data }] = useMutation(RESET_PASSWORD_MUTATION);

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

  const searchParams = useSearchParams();
  const privateCode = searchParams.get('code');
  const newPassword = formData[0].value;

  const handleSubmit = async (event) => {
    event.preventDefault();

    await resetPassword({ variables: {
        'code': privateCode,
        'password': newPassword,
        'passwordConfirmation': newPassword
      }
    });

    navigate('/login');
  };
  return (
    <Suspense>
      {loading ? <Loading /> :
        <Layout>
          <div className={styles.mainWrap}>
            <div className={styles.formWrapper}>
            <h4 className={`subtitle`}>Reset password</h4>
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
                <FormSubmitButton buttonText="Reset Password"/>
                <Link href='/login' className={styles.loginButton}>CANCEL</Link>
              </form>
            </div>
          </div>
        </Layout>
      }
    </Suspense>
  );
}
