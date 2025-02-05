import { useState, useCallback, useMemo } from 'react';
import PersonalDetails from '../personalDetails/PersonalDetails';
import Text from '../text/Text';
import styles from './profileEditForm.module.css';
import MemoizedLocationDetails from '../locationDetails/MemoizedLocationDetails';
import Button from '../button/Button';
import MemoizedFormModal from '../formModal/MemoizedFormModal';
import ContactDetails from '../contactDetails/ContactDetails';
import FormModal from '../formModal/FormModal';
import LocationDetails from '../locationDetails/LocationDetails';
import Interest from '../interests/Interest';

export default function ProfileInfoEditForm ({
  user,
  onChange,
  onMouseDown,
  updateUserPendingOvverridesAndSubmitUserData,
  onCancelButtonClick,
  onSaveButtonClick,
  pageTitle,
  role,
  showUsername,
  isCreatingNewEscort,
  updateManagerNewEscortLocationData,
  errors,
  setErrors,
}) {
  const [showLocationMoodal, setShowLocationMoodal] = useState(false);
  const handleClick = () => {
    setShowLocationMoodal(true);
  };

  return (
    <section className="page-width">
      <div className={styles.mainWrapper}>
        <Text
          tag={'h2'}
          className={styles.title}
          children={pageTitle}
        />
        <div>
          {showLocationMoodal &&
            <FormModal
              title={'Location'}
              className={styles.locationForm}
              onClose={() => setShowLocationMoodal(false)}
            >
              <LocationDetails
                user={user}
                onSaveChangesButtonClick={(locationInfo) => isCreatingNewEscort ? updateManagerNewEscortLocationData(locationInfo) : updateUserPendingOvverridesAndSubmitUserData(locationInfo)}
                userCountry={user?.country}
                userSuburbs={user?.suburbs}
                userCity={user?.city}
                errorMessage={errors}
                setErrors={setErrors}
                setShowLocationMoodal={setShowLocationMoodal}
              />
            </FormModal>
          }
          <PersonalDetails
            formData={user}
            onChange={onChange}
            onMouseDown={onMouseDown}
            onClick={handleClick}
            errorMessage={errors}
            showUsername={showUsername}
            role={role}
          />
          <ContactDetails
            formData={user}
            onChange={onChange}
            onMouseDown={onMouseDown}
            errorMessage={errors}
            role={role}
          />
          <div className={styles.buttons}>
            <Button
              children={'Cancel'}
              variant={'general'}
              onClick={onCancelButtonClick}
            />
            <Button
              type={'button'}
              children={'Save changes'}
              variant={'main'}
              onClick={onSaveButtonClick}
            />
          </div>
        </div>
      </div>
    </section>
  )
};
