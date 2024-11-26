'use client'

import Link from 'next/link';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { FORGOT_PASSWORD_MUTATION } from '../graphql/forgotPasswordMutation.js';
import Layout from './layuot.jsx';
import styles from './recover.module.css';
import FormInput from '@/components/form/FormInput';
import Button from '@/components/button/Button.jsx';

export default function RecoverPage() {
  const formFields = [{ id: 'email', type: 'email', placeholder: 'Email', name: 'Email', value: '' }]
  const [formData, setFormData] = useState(formFields);
  const [errorMessage, setErrorMessage] = useState({type: '', text: ''});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [forgotPassword, { loading: confirmatinLoading, error: confirmationError, data: confirmationData }] = useMutation(FORGOT_PASSWORD_MUTATION, {
    onError: (err => console.error(err)),
    onCompleted: (data) => {
      setShowSuccessMessage(true);
    }
  });

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
    let email;
    for (const field of formData) {
      if (field.name === 'email') {
        email = field.value;
      }
    }

    await forgotPassword({
      variables: {
          'email': `${userData.email}`
        }
      }
    );
  };

  return (
    <Layout>
      <div className={styles.mainWrap}>
        <div className={styles.formWrapper}>
          <h4 className={`subtitle`}>Forget Password ?</h4>
          <form onSubmit={handleSubmit} className={`${styles.form}`}>
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
            <Button
              type={'submit'}
              children={'Reset Password'}
              className={'submitButton'}
            />
            <Link href='/login' className={styles.loginButton}>CANCEL</Link>
            <div className={`${styles.recoverText} ${showSuccessMessage ? styles.show : ''}`}>
              <h2 className={styles.message}>A password reset link has been sent to your email address.</h2>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
