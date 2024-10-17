import  { useState, useEffect } from 'react';
import InputField from '../inputField/InputField';
import SuburbField from '../suburbField/SuburbField';
import CityField from '../cityField/CityField';
import { CITIES_OPTIONS } from '@/app/utils/constants/cities';
import { SUBURBS } from '@/app/utils/constants/suburbs';

export default function LocationDetails ({
  formData,
  onChange,
  onMouseDown,
  userSuburbs,
  userSelectedCity,
  isCityDataChanged,
  errorMessage}) {

  const [suburbs, setSuburbs] = useState([]);

  useEffect(() => {
    userSelectedCity && setSuburbs(getSuburbsForCity(SUBURBS, userSelectedCity));
  }, [userSelectedCity]);

  const getSuburbsForCity = (data, city) => {
    const cityObject = data.find(cityObj => cityObj[city]);
    return cityObject ? cityObject[city] : [];
  };

  return (
    <div>
      <div className='userDetails location'>
        <InputField
          label='Country*'
          labelClassName={'selectOptionLabel'}
          selectClassName={'select'}
          fieldClassName={'selectOptionsWrapper'}
          type='select'
          name='country'
          id='country'
          value={formData.country ? formData.country : ''}
          onChange={onChange}
          onMouseDown={onMouseDown}
          isRequired={true}
          options={[{ value: 'Australia', label: 'Australia'}]}
          errorMessage={errorMessage}
        />
        <CityField
          label='City*'
          labelClassName={'selectOptionLabel'}
          selectClassName={'select'}
          fieldClassName={'selectOptionsWrapper'}
          type='text'
          name='city'
          value={formData.city ? formData.city : 'select city'}
          onMouseDown={onMouseDown}
          errorMessage={errorMessage}
          cities={CITIES_OPTIONS}
          isRequired={true}
        />
      </div>
      {userSelectedCity &&
        <div className='suburbs'>
          <SuburbField
            label='Suburbs'
            labelClassName={'selectOptionLabel'}
            selectClassName={'select'}
            fieldClassName={'selectOptionsWrapper'}
            type='text'
            name='suburbs'
            userSuburbs={userSuburbs}
            onChange={onChange}
            isCityDataChanged={isCityDataChanged}
            selectedCity={userSelectedCity}
            onMouseDown={onMouseDown}
            isRequired={true}
            errorMessage={errorMessage}
            suburbs={suburbs}
          />
        </div>
      }
    </div>
  )
}
