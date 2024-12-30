'use client'

import { useState } from 'react';
import styles from './profileReviewPopup.module.css';
import CloseIcon from '../icons/CloseIcon';
import Text from '../text/Text';
import InputField from '../inputField/InputField';
import Button from '../button/Button';
import TextareaField from '../textareaField/TextAreaField';
import { validateFormData } from '@/app/utils/validation';
import { useFetchData } from '@/app/utils/hooks/useFetch';
import PopUpCloseIcon from '../icons/PopUpCloseIcon';

export default function ProfileReviewPopup({setShowReviewPopup, providerId}) {
  const [formData, setFormData] = useState({
    author: '',
    text: '',
    date: '',
    show: false,
  });
  const [errors, setErrors] = useState({
    author: '',
    text: '',
    date: '',
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  const handleModalClose = (e) => {
    const isModalCloseButtonClicked = e.currentTarget.classList.contains(`${styles.closeIcon}`)
    if (isModalCloseButtonClicked) {
      document.body.classList.remove('overflow_hidden');
      setShowReviewPopup(false);
    };
  }

  const getFormattedDate = () => {
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
  };

  const handleChange = (e) => {
    setErrors({
      author: '',
      text: '',
      date: '',
    });
    setShowSuccessMessage(false);
    setFormData({ ...formData,
      [e.target.name]: e.target.value,
      date: getFormattedDate(),
    });
  };

  const handleAddReview = async () => {
    const validationErrors = validateFormData(formData);
    const hasError = Object.values(validationErrors).length > 0;
    if (hasError) {
      setErrors({...errors, ...validationErrors});
      return;
    };
    const data = await useFetchData(`${baseUrl}/api/user/addReview/${providerId}`, {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    if (data.isSuccessfullyCreated) {
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    } else if (data?.error) {
      console.error(data?.error?.message);
    };
  };

  return (
    <div className={`${styles.modalOverlay}`} onClick={(e) => handleModalClose(e)}>
      <div className={styles.modalContent}>
      <div  className={styles.row}>
        <Text
          tag={'h3'}
          className={styles.title}
          children={'Add review'}
        />
        <PopUpCloseIcon
          className={styles.closeIcon}
          onClick={(e) => handleModalClose(e)}
        />
      </div>
      <div className={styles.infoWrap}>
        <InputField
          label={'Full name'}
          name={'author'}
          placeholder={'Enter your full name'}
          id={'author'}
          value={formData.author}
          onChange={handleChange}
          isRequired={true}
          fieldClassName={`${styles.inputWrap}`}
          labelClassName={styles.label}
          inputClassName={styles.input}
          errorMessage={errors}
        />
        <TextareaField
          label={'Comment'}
          name={'text'}
          placeholder={'Comment'}
          id={'text'}
          value={formData.text}
          onChange={handleChange}
          required={true}
          className={styles.comment}
          errorMessage={errors}
        />
      </div>
      <Text
        tag={'span'}
        className={`${styles.successMessage} ${showSuccessMessage ? styles.show : ''} text-small`}
        children={'Your review successfully submited.'}
      />
      <Button
        className={styles.submitButton}
        onClick={handleAddReview}
        children={'Add a review'}
        variant={'main'}
      />
      </div>
    </div>
  )
}
