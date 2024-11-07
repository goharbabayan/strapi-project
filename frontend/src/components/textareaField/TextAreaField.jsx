import styles from './textareaField.module.css';
import Text from '../text/Text';

export default function TextareaField({
  label,
  name,
  placeholder,
  id,
  value,
  onChange,
  isRequired,
  errorMessage,
  className,
}) {
  return (
    <>
      <textarea
        label={label}
        name={name}
        placeholder={placeholder}
        id={id}
        value={value}
        onChange={onChange}
        required={isRequired}
        className={`${styles.textarea} ${className ? className : ''} ${errorMessage && errorMessage[name] && styles.invalid}`}
      >
      </textarea>
      {errorMessage && errorMessage[name] && 
        <Text
          tag={'span'}
          className={`${styles.errorText} text-extrasmall`}
          children={errorMessage && errorMessage[name]}
        />
      }
    </>
  )
}
