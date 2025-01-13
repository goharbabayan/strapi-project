import { forwardRef } from 'react';
import styles from './aboutMe.module.css';
import Text from '../text/Text';
import Favourites from '../favourites/Favourites';
import { EXTRAS, MY_GLAM, MY_CLOSET } from '@/app/utils/constants/userPossibleOutfits';

const AboutMe = forwardRef(({formData, onChildFormDataChange, error}, ref) => {
  const handleChangeAboutMeText = (e) => {
    onChildFormDataChange('aboutMe', e.target.value);
  };

  const handlePreferencesChange = (field, value) => {
    onChildFormDataChange(field, value);
  };

  return (
    <>
      <section
        id='About'
        className={`${styles.aboutText} ${styles.section} page-width`}
        ref={ref}
      >
        <Text
          tag={'h2'}
          className={styles.title}
          children={'About Me'}
        />
        <div className={`${styles.formGroup} ${styles.mainInfo}`}>
          <Text
            tag={'textarea'}
            className={`${styles.textarea} text-middle`}
            value={formData.aboutMe === null ? '' : formData.aboutMe}
            onChange={handleChangeAboutMeText}
            placeholder={'Enter your text here...'}
          />
        </div>
      </section>
      <section className={`${styles.aboutText} ${styles.section} page-width`}>
        {/* <Preferences
          field='interests'
          subtitle='Interests'
          data={formData.interests}
          onPreferencesChange={onChildFormDataChange}
          error={error?.interests}
        /> */}
        {/* comment for wishlist field */}
        {/* <Favourites
          label='Wishlist:'
          labelClassName={'selectOptionLabel'}
          selectClassName={'select'}
          fieldClassName={'selectOptionsWrapper'}
          type='text'
          name='wishlist'
          userOptions={formData.wishlist}
          onMouseDown={handlePreferencesChange}
          isRequired={true}
          optionsList={WISHLIST_OPTIONS}
          errorMessage={error?.wishlist}
        /> */}
        {/* comment for wishlist field */}
        <div className={`${styles.selectionContainer}`}>
          <Favourites
            label='My closet'
            labelClassName={'selectOptionLabel'}
            selectClassName={'select'}
            fieldClassName={'selectOptionsWrapper'}
            type='text'
            name='closet'
            userOptions={formData.closet}
            onMouseDown={handlePreferencesChange}
            isRequired={false}
            optionsList={MY_CLOSET}
            errorMessage={error?.favouriteThings}
          />
          <Favourites
            label='My glam'
            labelClassName={'selectOptionLabel'}
            selectClassName={'select'}
            fieldClassName={'selectOptionsWrapper'}
            type='text'
            name='makeup'
            userOptions={formData.glam}
            onMouseDown={handlePreferencesChange}
            isRequired={false}
            optionsList={MY_GLAM}
            errorMessage={error?.favouriteThings}
          />
          <Favourites
            label='My extras'
            labelClassName={'selectOptionLabel'}
            selectClassName={'select'}
            fieldClassName={'selectOptionsWrapper'}
            type='text'
            name='extras'
            userOptions={formData.extras}
            onMouseDown={handlePreferencesChange}
            isRequired={false}
            optionsList={EXTRAS}
            errorMessage={error?.favouriteThings}
          />
        </div>
      </section>
    </>
  )
});

export default AboutMe;
