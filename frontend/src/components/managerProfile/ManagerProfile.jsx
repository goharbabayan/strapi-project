import styles from './managerProfile.module.css';
import Text from '../text/Text';
import Button from '../button/Button';
import FormInput from '../formInput/FormInput';

export default function ManagerProfile ({
  title,
  formData,
  updateData,
  submitManagerPersonalProfileData,
  errorMessage,
}) {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const formFields = [
    {
      id: 'username',
      placeholder: 'Username',
      name: 'username',
      label: 'Username',
      type: 'text',
    },
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
  ];

  return (
    <div className="page-width">
      <section className={styles.section}>
        <div className={styles.mainWrap}>
          <Text
            tag={'h3'}
            className={styles.title}
            children={title}
          />
          {formFields.map((input) => {
            const {id, name, label, type, placeholder, disabled, validate} = input;
            return (
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
                updateData={updateData}
                validate={validate}
                showError={true}
                disabled={disabled || false}
                showInfoIcon={name === 'email' ? true : false}
              />
            )}
          )}
          <Button
            type={'button'}
            variant={'main'}
            children={'Save changes'}
            className={styles.button}
            onClick={submitManagerPersonalProfileData}
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
