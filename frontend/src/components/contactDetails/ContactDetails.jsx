import styles from './contactDetails.module.css';
import InputField from '../inputField/InputField';
import { DIGITAL_SERVICE_OPTIONS } from '@/app/utils/constants/userPhisicalDetails';
import { MANAGER } from '@/app/utils/constants/userRoles';

export default function ContactDetails ({formData, onChange, onMouseDown, errorMessage, role}) {
  return (
    <div className={`${styles.socialLinks}`}>
      {role !== MANAGER.type &&
        <div className='formGroup email'>
          <InputField
            label='Email Address'
            type='text'
            name='email'
            id='email'
            value={formData.email}
            inputClassName='inputEmail'
            disabled={true}
            errorMessage={errorMessage}
            isRequired={true}
          />
        </div>
      }
      {/* show info that it will be shown on escort profile details*/}
      {role === MANAGER.type &&
        <InputField
          label='Escort email Address'
          type='text'
          name='managerEscortEmail'
          id='managerEscortEmail'
          value={formData.managerEscortEmail || ''}
          inputClassName='inputEmail'
          onChange={onChange}
          // disabled={true}
          isRequired={true}
          errorMessage={errorMessage}
        />
      }
      <InputField
        label='Phone Number'
        type='number'
        name='phoneNumber'
        id='phoneNumber'
        fieldClassName='phoneNumber'
        value={formData.phoneNumber ? formData.phoneNumber : ''}
        onChange={onChange}
        isRequired={true}
        min={1}
        errorMessage={errorMessage}
      />
      <InputField
        label='Digital Services'
        labelClassName={'selectOptionLabel'}
        selectClassName={'select'}
        fieldClassName={'selectOptionsWrapper'}
        type='select'
        name='digitalService'
        id='digitalService'
        value={formData.digitalService ? formData.digitalService : ''}
        onChange={onChange}
        onMouseDown={onMouseDown}
        options={DIGITAL_SERVICE_OPTIONS}
        errorMessage={errorMessage}
      />
      <InputField 
        label='My website'
        type='text'
        name='websiteLink'
        id='websiteLink'
        value={formData.websiteLink === null ? '' : formData.websiteLink}
        onChange={onChange}
        errorMessage={errorMessage}
      />
      <InputField
        label='Instagram link'
        type='text'
        name='instagramLink'
        id='instagramLink'
        value={formData.instagramLink ? formData.instagramLink : ''}
        onChange={onChange}
        errorMessage={errorMessage}
      />
      <InputField
        label='Twitter link'
        type='text'
        name='twitterLink'
        id='twitterLink'
        fieldClassName='twitterLink'
        value={formData.twitterLink ? formData.twitterLink : ''}
        onChange={onChange}
        errorMessage={errorMessage}
      />
      <InputField
        label='Only Fans link'
        type='text'
        name='onlyFansLink'
        id='onlyFansLink'
        value={formData.onlyFansLink ? formData.onlyFansLink : ''}
        onChange={onChange}
        errorMessage={errorMessage}
      />
      <InputField
        label='Other URL'
        type='text'
        name='otherLink'
        id='otherLink'
        fieldClassName='otherLink'
        value={formData.otherLink ? formData.otherLink : ''}
        onChange={onChange}
        errorMessage={errorMessage}
      />
    </div>
  )
}
