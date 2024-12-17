import InputField from '../inputField/InputField';

export default function ContactDetails ({formData, onChange, role, errorMessage}) {
  return (
    <div className={`socialLinks ${role === 'new-member' || role === 'manager-member' ? 'member' : ''}`}>
      {role === 'service-provider' &&
        <div className='formGroup email socialLink'>
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
      <InputField
        label='Phone Number'
        type='number'
        name='phoneNumber'
        id='phoneNumber'
        fieldClassName='socialLink phoneNumber'
        value={formData.phoneNumber ? formData.phoneNumber : ''}
        onChange={onChange}
        isRequired={true}
        min={1}
        errorMessage={errorMessage}
      />
      <InputField
        label='Instagram link'
        type='text'
        name='instagramLink'
        id='instagramLink'
        fieldClassName='socialLink'
        value={formData.instagramLink ? formData.instagramLink : ''}
        onChange={onChange}
        errorMessage={errorMessage}
      />
      <InputField
        label='OnlyFans link'
        type='text'
        name='onlyFansLink'
        id='onlyFansLink'
        fieldClassName='socialLink'
        value={formData.onlyFansLink ? formData.onlyFansLink : ''}
        onChange={onChange}
        errorMessage={errorMessage}
      />
      {/* ToDo: use here roles from constants */}
      {(role === 'manager-member' || role === 'new-member' || role === 'service-provider') &&
        <InputField 
          label='My website'
          type='text'
          name='websiteLink'
          id='websiteLink'
          fieldClassName='socialLink'
          value={formData.websiteLink === null ? '' : formData.websiteLink}
          onChange={onChange}
          errorMessage={errorMessage}
        />
      }
    </div>
  )
}
