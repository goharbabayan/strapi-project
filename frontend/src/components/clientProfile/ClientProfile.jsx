import styles from './clientProfile.module.css';
import Text from '../text/Text';
import Image from '../image/Image';
import RemoveIcon from '../icons/RemoveIcon';
import { GENDER_OPTIONS } from '@/app/utils/constants/userPhisicalDetails';
import Button from '../button/Button';
import FormInput from '../formInput/FormInput';
import SelectOptions from '../selectOptions/SelectOptions';
import InfoIcon from '../icons/Info';

export default function ClientProfile ({
  hideImage,
  title,
  formData,
  onChange,
  errorMessage,
}) {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const formFields = [
    {
      id: 'name',
      placeholder: 'Name',
      name: 'name',
      label: 'Name',
      type: 'text',
    },
    {
      id: 'lastName',
      placeholder: 'Last name',
      name: 'lastName',
      label: 'Last name',
      type: 'text',
    },
    {
      id: 'email',
      name: 'email',
      label: 'Email',
      type: 'text',
      disabled: true,
    },
    {
      id: 'gender',
      name: 'gender',
      label: 'Gender',
    },
  ];

  async function handleUpload(e) {
    const token = JSON.parse(window.localStorage.getItem('token'));
    const imageFile = e.target.files[0];
    const form = new FormData();
    form.append('files', imageFile);
    if (!imageFile) return;
  
    await fetch(`${baseUrl}/api/upload?populate=*`, {
        method: 'POST',
        headers: {
          'authorization': `Bearer ${token}`
        },
        body: form,
      })
      .then(resp => resp.json())
      .then(data => onChange('profilePicture', data[0]));
    e.target.value = '';
  };

  const handleRemoveProfilePicture = () => {
    onChange('profilePicture', null);
  };

  return (
    <div className="page-width">
      <section className={styles.section}>
        <div className={styles.mainWrap}>
          <Text
            tag={'h3'}
            className={styles.title}
            children={title}
          />
          {!hideImage &&
            <div>
              <div className={`${styles.container} `}>
                {formData?.profilePicture && formData?.profilePicture?.url ?
                  <div className={styles.imageContainer}>
                    <Image
                      src={`${baseUrl}${formData?.profilePicture.url}`}
                      alt={`${formData?.profilePicture?.alternativeText || formData?.profilePicture?.name}`}
                      width={91}
                      height={91}
                      providerCartAspectRatio={1}
                    />
                  </div> :
                  <div className={`${styles.emptyPicture} ${errorMessage?.profilePicture ? styles.invalid : ''}`}></div>
                }
                <div className={`${styles.buttonsWrap}`}>
                  <RemoveIcon
                    className={styles.iconRemove}
                    onClick={handleRemoveProfilePicture}
                  />
                  <input
                    type='file'
                    id='profileImageInput'
                    name='profileImage'
                    accept='image/*'
                    hidden
                    onChange={(e) => handleUpload(e, 'profilePicture')}
                  />
                  <label htmlFor='profileImageInput' className={`${styles.uploadButton}`}>
                    <Text
                      tag={'span'}
                      children={'Upload image'}
                    />
                  </label>
                </div>
              </div>
              <div className={styles.info}>
                <InfoIcon/>
                <Text
                  tag={'span'}
                  className="text-small"
                  children={'Upload picture with 3x4 resolution'}
                />
              </div>
              {errorMessage?.profilePicture &&
                <Text
                  tag={'span'}
                  className={`${styles.error}`}
                  children={errorMessage?.profilePicture}
                />
              }
            </div>
          }
          {formFields.map((input) => {
            const {id, name, label, type, placeholder, disabled, validate} = input;
            if (name === 'gender') {
              return (
                <SelectOptions
                  key={id}
                  id={id}
                  isRequired={true}
                  label={label}
                  name={name}
                  value={formData[name] || ''}
                  onChange={onChange}
                  options={GENDER_OPTIONS}
                  error={errorMessage && errorMessage[name]}
                  showError={true}
                />
              )
            } else return (
              <FormInput
                key={id}
                error={errorMessage && errorMessage[name]}
                id={id}
                placeholder={placeholder}
                name={name}
                label={label}
                value={formData[name] || ''}
                type={type}
                isRequired={true}
                updateData={onChange}
                validate={validate}
                showError={true}
                disabled={disabled || false}
                showInfoIcon={name === 'email' ? true : false}
              />
            )}
          )}
          <Button
            type={'submit'}
            variant={'main'}
            children={'Save changes'}
            className={styles.button}
          />
        </div>
      </section>
      {errorMessage && errorMessage?.text &&
        <Text
          tag={'span'}
          className={`${styles.error}`}
          children={errorMessage.text}
        />
      }
    </div>
  )
}
