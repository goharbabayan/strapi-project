import styles from './accountInfo.module.css';
import { forwardRef } from 'react';
import Text from '../text/Text';
import InputField from '../inputField/InputField';
import { GENDER_OPTIONS } from '@/app/utils/constants/userPhisicalDetails';
import ProfilePageImage from '../profilePageImage/ProfilePageImage';

const AccountInfo = forwardRef(({gender, email, formData, onChange, onMouseDown, onChildFormDataChange, errorMessage}, ref) => {
  return (
    <section ref={ref} className={`section`}>
      <Text
        tag={'h2'}
        className={styles.heading}
        children={'Account Details'}
      />
      <div className={styles.mainWrap}>
        <ProfilePageImage
          type='profilePicture'
          formData={formData}
          onChildFormDataChange={onChildFormDataChange}
          className={styles.imageContainer}
        />
        <div className={`${styles.container}`}>
          <div className={`${styles.profileName}`}>
            <InputField 
              label='Name:'
              type='text'
              name='name'
              id='name'
              required={true}
              className={styles.input}
              value={formData.name || ''}
              onChange={onChange}
              errorMessage={errorMessage}
              errorMessageClassName={styles.error}
            />
          </div>
          <div className={`${styles.profileName}`}>
            <InputField 
              label='Lastname:'
              type='text'
              name='lastName'
              id='lastName'
              required={true}
              className={styles.input}
              value={formData.lastName || ''}
              onChange={onChange}
              errorMessage={errorMessage}
              errorMessageClassName={styles.error}
            />
          </div>
          <div className={`${styles.profileName}`}>
            <InputField 
              label='Gender:'
              labelClassName={'selectOptionLabel'}
              selectClassName={'select'}
              fieldClassName={'selectOptionsWrapper'}
              type='select'
              name='gender'
              id='gender'
              value={gender || ''}
              onChange={onChange}
              onMouseDown={onMouseDown}
              isRequired={true}
              options={GENDER_OPTIONS}
              errorMessage={errorMessage}
              errorMessageClassName={styles.error}
            />
          </div>
          <div className={`${styles.emailWrapper}`}>
            <div className={`${styles.email}`} data-address>
              <InputField 
                label='Email address:'
                type='text'
                name='email'
                id='email'
                className={styles.input}
                value={email}
                disabled
                errorMessage={errorMessage}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
});

export default AccountInfo;
