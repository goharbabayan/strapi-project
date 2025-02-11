import styles from './personalDetails.module.css';
import InputField from '../inputField/InputField';
import StrokeBorder from '../strokeBorder/StrokeBorder';
import {
  AGE_OPTIONS,
  EYE_COLOR_OPTIONS,
  HEIGHT_OPTIONS,
  HAIR_COLOR_OPTIONS,
  PLACE_OF_SERVICE_OPTIONS,
  BODY_TYPE_OPTIONS,
  BUST_OPTIONS,
  GENDER_OPTIONS,
} from '@/app/utils/constants/userPhisicalDetails';
import Text from '../text/Text';
import { MANAGER } from '@/app/utils/constants/userRoles';

export default function PersonalDetails ({
  formData,
  onChange,
  onMouseDown,
  onClick,
  errorMessage,
  showUsername,
  role,
}) {

  return (
    <div>
      <div className={styles.fullName}>
        {showUsername &&
          <InputField
            label='Escort username'
            type='text'
            name='username'
            id='username'
            min={3}
            value={formData.username ? formData.username : ''}
            onChange={onChange}
            isRequired={true}
            errorMessage={errorMessage}
          />
        }
        <InputField
          label='Name'
          type='text'
          name='name'
          id='name'
          value={formData.name ? formData.name : ''}
          onChange={onChange}
          isRequired={true}
          errorMessage={errorMessage}
        />
        <InputField
          label='Last name'
          type='text'
          name='lastName'
          id='lastName'
          value={formData.lastName ? formData.lastName : ''}
          onChange={onChange}
          isRequired={true}
          errorMessage={errorMessage}
        />
        <InputField
          label='Gender'
          labelClassName={'selectOptionLabel'}
          selectClassName={'select'}
          fieldClassName={'selectOptionsWrapper'}
          type='select'
          name='gender'
          id='gender'
          value={formData.gender ? formData.gender : ''}
          onChange={onChange}
          onMouseDown={onMouseDown}
          isRequired={true}
          options={GENDER_OPTIONS}
          errorMessage={errorMessage}
        />
      </div>
      <div className={styles.userDetails}>
        <div className={styles.location}>
          <Text
            className={`${styles.label} ${errorMessage?.country || errorMessage?.city ? styles.invalid : ''}`}
            children={'Location *'}
            tag={'span'}
          />
          <input
            type="button"
            onClick={onClick}
            value={formData?.city || 'choose your location'}
            className={`${styles.input} ${errorMessage?.country || errorMessage?.city ? styles.invalid : ''}`}
          />
        </div>
        <InputField
          label='Age'
          labelClassName={'selectOptionLabel'}
          selectClassName={'select'}
          fieldClassName={'selectOptionsWrapper'}
          type='select'
          name='age'
          id='age'
          value={formData.age ? formData.age : ''}
          onChange={onChange}
          onMouseDown={onMouseDown}
          isRequired={true}
          options={AGE_OPTIONS}
          errorMessage={errorMessage}
        />
        <InputField
          label='Eye color'
          labelClassName={'selectOptionLabel'}
          selectClassName={'select'}
          fieldClassName={'selectOptionsWrapper'}
          type='select'
          name='eyeColor'
          id='eyeColor'
          value={formData.eyeColor ? formData.eyeColor : ''}
          onChange={onChange}
          onMouseDown={onMouseDown}
          isRequired={true}
          options={EYE_COLOR_OPTIONS}
          errorMessage={errorMessage}
        />
        <InputField
          label='Hair color'
          labelClassName={'selectOptionLabel'}
          selectClassName={'select'}
          fieldClassName={'selectOptionsWrapper'}
          type='select'
          name='hairColor'
          id='hairColor'
          value={formData.hairColor ? formData.hairColor : ''}
          onChange={onChange}
          onMouseDown={onMouseDown}
          isRequired={true}
          options={HAIR_COLOR_OPTIONS}
          errorMessage={errorMessage}
        />
        <InputField
          label='Bust'
          labelClassName={'selectOptionLabel'}
          selectClassName={'select'}
          fieldClassName={'selectOptionsWrapper'}
          type='select'
          name='bust'
          id='bust'
          value={formData.bust ? formData.bust : ''}
          onChange={onChange}
          onMouseDown={onMouseDown}
          isRequired={true}
          options={BUST_OPTIONS}
          errorMessage={errorMessage}
        />
        <InputField
          label='Place of service'
          labelClassName={'selectOptionLabel'}
          selectClassName={'select'}
          fieldClassName={'selectOptionsWrapper'}
          type='select'
          name='placeOfService'
          id='placeOfService'
          value={formData.placeOfService ? formData.placeOfService : ''}
          onChange={onChange}
          onMouseDown={onMouseDown}
          isRequired={true}
          options={PLACE_OF_SERVICE_OPTIONS}
          errorMessage={errorMessage}
        />
        <InputField
          label='Height'
          labelClassName={'selectOptionLabel'}
          selectClassName={'select'}
          fieldClassName={'selectOptionsWrapper'}
          type='select'
          name='height'
          id='height'
          value={formData.height ? formData.height : ''}
          onChange={onChange}
          onMouseDown={onMouseDown}
          isRequired={true}
          options={HEIGHT_OPTIONS}
          errorMessage={errorMessage}
        />
        <InputField
          label='Dress size'
          type='number'
          name='dressSize'
          id='dressSize'
          value={formData.dressSize ? formData.dressSize : ''}
          onChange={onChange}
          isRequired={true}
          min={1}
          errorMessage={errorMessage}
        />
        <InputField
          label='Body type'
          labelClassName={'selectOptionLabel'}
          selectClassName={'select'}
          fieldClassName={'selectOptionsWrapper'}
          type='select'
          name='bodyType'
          id='bodyType'
          value={formData.bodyType ? formData.bodyType : ''}
          onChange={onChange}
          onMouseDown={onMouseDown}
          isRequired={false}
          options={BODY_TYPE_OPTIONS}
          errorMessage={errorMessage}
        />
      </div>
      <StrokeBorder/>
    </div>
  )
}
