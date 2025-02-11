import styles from './locationDetails.module.css';
import  { useState, useEffect } from 'react';
import InputField from '../inputField/InputField';
import SuburbField from '../suburbField/SuburbField';
import CityField from '../cityField/CityField';
import { CITIES_OPTIONS } from '@/app/utils/constants/cities';
import { SUBURBS } from '@/app/utils/constants/suburbs';
import Button from '../button/Button';

export default function LocationDetails ({
  onSaveChangesButtonClick,
  userCountry,
  userSuburbs,
  userCity,
  hideSaveAndCancelButtons,
  errorMessage,
  setErrors,
  setShowLocationMoodal,
}) {

  const initialLocationInfo = {
    country: userCountry || 'select country',
    suburbs: userSuburbs || [],
    city: userCity || 'select your city',
  };

  const [locationInfo, setLocationInfo] = useState(initialLocationInfo);
  const [suburbsOptions, setSuburbsOptions] = useState([]);
  const [suburbCheckboxesState, setSuburbCheckboxesState] = useState([]);

  useEffect(() => {
    if(locationInfo?.city) {
      const suburbsForSelectedCity = getSuburbsForCity(SUBURBS, locationInfo?.city);
      const filterSuburbsWithoutSelectedOnes = suburbsForSelectedCity.filter((suburb) => !locationInfo.suburbs.some((selectedSuburb) => selectedSuburb.name === suburb.value));
      setSuburbsOptions(filterSuburbsWithoutSelectedOnes);
    };
  }, [locationInfo?.city]);

  const handleChange = (name, value) => {
    setErrors && setErrors(null);
    if (value === 'select your city') return;
    if (name === 'city') {
      setLocationInfo({
        ...locationInfo,
        [name] : value,
        suburbs: [],
      });
      return;
    }
    setLocationInfo({
      ...locationInfo,
      [name] : value
    });
  };

  const handleCheckboxChange = (optionValue, isChecked) => {
    setSuburbCheckboxesState((prevState) =>
      isChecked
        ? [...prevState, optionValue]
        : prevState.filter((item) => item !== optionValue)
    );
    if (isChecked) {
      setLocationInfo({
        ...locationInfo,
        suburbs: [
          ...locationInfo.suburbs,
          {name: optionValue},
        ],
      });
    } else {
      setLocationInfo({
        ...locationInfo,
        suburbs: locationInfo.suburbs.filter(suburb => suburb.name !== optionValue),
      });
    };
  };

  const getSuburbsForCity = (data, city) => {
    const cityObject = data.find(cityObj => cityObj[city]);
    return cityObject ? cityObject[city] : [];
  };

  // Check if any changes have been made
  const isChangedAtLeastOneData = () => {
    return JSON.stringify(locationInfo) !== JSON.stringify(initialLocationInfo);
  };

  const onSaveChanges = () => {
     // locationFieldsData is object with country, city, suburbs data, so I need to update this 3 fields data in userWithPendingOverrides and also submit data to database
    const hasAtLeastOneChange = isChangedAtLeastOneData();
    hasAtLeastOneChange && onSaveChangesButtonClick(locationInfo);
    setShowLocationMoodal && setShowLocationMoodal(false);
  };

  const onSelectedSuburbDelete = (removedSuburb) => {
    setSuburbCheckboxesState(suburbCheckboxesState.filter(suburb => suburb !== removedSuburb));
    if (!suburbsOptions.some(option => option.value === removedSuburb)) {
      setSuburbsOptions(
        [...suburbsOptions, { value: removedSuburb, label: removedSuburb }].sort(
          (a, b) => a.label.localeCompare(b.label)
        )
      );
    }
  };

  const onCancelChanges = () => {
    setLocationInfo({
      country: userCountry,
      suburbs: userSuburbs,
      city: userCity,
    });
    setSuburbCheckboxesState([]);
    setShowLocationMoodal(false);
  };

  return (
    <div>
      <div className={styles.location}>
        <div className={styles.item}>
          <InputField
            label='Country'
            labelClassName={'selectOptionLabel'}
            selectClassName={'select'}
            fieldClassName={'selectOptionsWrapper'}
            type='select'
            name='country'
            id='country'
            value={locationInfo?.country}
            onChange={handleChange}
            onMouseDown={handleChange}
            isRequired={true}
            options={[{ value: 'Australia', label: 'Australia'}]}
            errorMessage={errorMessage}
          />
        </div>
         <div className={styles.item}>
          <CityField
            label='City'
            labelClassName={'selectOptionLabel'}
            selectClassName={'select'}
            fieldClassName={'selectOptionsWrapper'}
            type='text'
            name='city'
            value={locationInfo?.city}
            onMouseDown={handleChange}
            errorMessage={errorMessage}
            cities={CITIES_OPTIONS}
            isRequired={true}
          />
        </div>
      </div>
      {locationInfo?.city &&
        <div className='suburbs'>
          <SuburbField
            label='Suburbs'
            type='text'
            name='suburbs'
            onCheckboxChange={handleCheckboxChange}
            onChange={handleChange}
            suburbCheckboxesState={suburbCheckboxesState}
            suburbsOptions={suburbsOptions}
            userSuburbs={locationInfo?.suburbs}
            onSelectedSuburbDelete={onSelectedSuburbDelete}
            errorMessage={errorMessage}
          />
        </div>
      }
      {!hideSaveAndCancelButtons &&
        <div className={styles.buttons}>
          <Button
            children={'Cancel'}
            variant={'general'}
            onClick={onCancelChanges}
          />
          <Button
            type={'button'}
            children={'Save changes'}
            variant={'main'}
            onClick={onSaveChanges}
          />
        </div>
      }
    </div>
  )
}
