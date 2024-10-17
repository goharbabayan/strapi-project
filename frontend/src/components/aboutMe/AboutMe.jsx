import { forwardRef } from 'react';
import styles from './aboutMe.module.css';
import Text from '../text/Text';
import Preferences from '../prerferences/Preferences';
import Favourites from '../favourites/Favourites';
import { COSTUME, EXTRAS, MAKEUP, POSSIBLE_OUTFITS_OPTIONS } from '@/app/utils/constants/userPossibleOutfits';
import { WISHLIST_OPTIONS } from '@/app/utils/constants/userWishlist';

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
            label='Possible outfits to wear'
            labelClassName={'selectOptionLabel'}
            selectClassName={'select'}
            fieldClassName={'selectOptionsWrapper'}
            type='text'
            name='outfits'
            userOptions={formData.outfits}
            onMouseDown={handlePreferencesChange}
            isRequired={false}
            optionsList={POSSIBLE_OUTFITS_OPTIONS}
            errorMessage={error?.favouriteThings}
          />
          <Favourites
            label='Makeup'
            labelClassName={'selectOptionLabel'}
            selectClassName={'select'}
            fieldClassName={'selectOptionsWrapper'}
            type='text'
            name='makeup'
            userOptions={formData.makeup}
            onMouseDown={handlePreferencesChange}
            isRequired={false}
            optionsList={MAKEUP}
            errorMessage={error?.favouriteThings}
          />
        </div>
        <div className={styles.selectionContainer}>
          <Favourites
            label='Costume'
            labelClassName={'selectOptionLabel'}
            selectClassName={'select'}
            fieldClassName={'selectOptionsWrapper'}
            type='text'
            name='costume'
            userOptions={formData.costume}
            onMouseDown={handlePreferencesChange}
            isRequired={false}
            optionsList={COSTUME}
            errorMessage={error?.favouriteThings}
          />
          <Favourites
            label='Extras'
            labelClassName={'selectOptionLabel'}
            selectClassName={'select'}
            fieldClassName={'selectOptionsWrapper'}
            type='text'
            name='extra'
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
