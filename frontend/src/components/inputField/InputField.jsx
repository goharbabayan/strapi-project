import { useState, useRef, useEffect } from 'react';
import styles from './inputField.module.css';
import InfoIcon from '../icons/Info';
import InfoMessage from '../infoMessage/infoMessage';
import Text from '../text/Text';

export default function InputField ({
  label,
  type,
  name,
  id,
  value,
  onChange,
  isRequired,
  disabled,
  fieldClassName,
  inputClassName,
  options,
  errorMessage,
  errorBorderColor,
  labelClassName,
  selectClassName,
  errorMessageClassName,
  onMouseDown,
  ...other
}) {
  const [showOptions, setShowOptions] = useState(false);
  const [inputType, setInputType] = useState({
    id: '',
    showPassword: false
  });
  const inputRef = useRef(null);
  const arrowRef = useRef(null);
  const labelRef = useRef(null);
  const suburbRef = useRef(null);

  useEffect(() => {
    if (!type === 'select') return;
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClickOutside = (e) => {
    const isOutsideSelectTag = !(e.target.matches(`.${selectClassName}`) && e.target.matches('.arrow')) && !(inputRef.current && inputRef.current.contains(e.target) || arrowRef.current && arrowRef.current.contains(e.target));
    if (isOutsideSelectTag) {
      setShowOptions(false);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (inputRef.current && inputRef.current.contains(e.target) || arrowRef.current && arrowRef.current.contains(e.target)) {
      setShowOptions(!showOptions);
    };
  };

  const handleMouseDown = (e) => {
    e.stopPropagation();
    const target = e.target;
    const { name, value } = target.children[0];
    const needToBeNumberValue = name === 'dressSize' || name === 'phoneNumber';
    const fieldValue = needToBeNumberValue ? Number(value) : value;
    onMouseDown(name, fieldValue);
  };

  const handleShowHidePassword = (e) => {
    const closestInputId = e.currentTarget.dataset.id;

    setInputType({
      id: closestInputId,
      showPassword: !inputType.showPassword
    })
  }

  return (
    <div className={`${fieldClassName ? fieldClassName : ''}`}>
      {type === 'select' ? (
        <>
          <label htmlFor={id} className={`${styles.label} ${labelClassName ? labelClassName : ''}`} onMouseDown={(e) => handleClick(e)} ref={labelRef}>{label}
            <select
              name={name}
              id={id}
              ref={inputRef} 
              className={`${styles.selectClassName} ${selectClassName ? selectClassName : ''}`}
              value={value}
              required={isRequired}
              disabled={disabled}
              onChange={onChange}
              {...other}
            >
              {[{ label: `select ${label}`.toLowerCase(), value: '' }, ...options].map((option, index) => (
                <option key={index} value={option.value} data-code={option.code}>{option.label ? option.label : option.value}</option>
              ))}
            </select>
            <span className='arrow' ref={arrowRef}></span>
          </label>
          <ul className={`${styles.options} ${showOptions ? styles.show : ''} unstyled-list options`}>
            {options.map((option, index) => (
              <li key={index} value={option.value} name={name} className={`${styles.option} text-small`} ref={suburbRef} onMouseDown={(e) => handleMouseDown(e)}>
                <input type="text" name={name} value={option.value} data-code={option.code} readOnly={true} hidden/>
                {option.label ? option.label : option.value}
              </li>
            ))}
          </ul>
          {errorMessage && errorMessage[name] && 
            <Text
              tag={'span'}
              className={`${styles.errorText} text-extrasmall errorText ${errorMessageClassName ? errorMessageClassName : null}`}
              children={errorMessage && errorMessage[name]}
            />
          }
        </>
      ) : (
        <label htmlFor={id} className={`${styles.label} ${labelClassName ? labelClassName : ''}`}>{label}
          <input
            type={inputType.id === id && inputType.showPassword ? 'text' : type}
            name={name}
            id={id}
            className={`${styles.input} ${inputClassName ? inputClassName : ''} ${errorMessage && errorMessage[name] && styles.invalid}`}
            value={value}
            onChange={onChange}
            required={isRequired}
            disabled={disabled}
            checked={other.checked}
            onKeyDown={(e) => e.key === 'Enter' ? e.preventDefault() : null}
            {...other}
          />
          {!!other.isPassword && <span data-id={id} className={styles.showPasswordButton} onClick={(e) => handleShowHidePassword(e)}>
            {inputType.id === id && inputType.showPassword ? "Hide password" : "Show password"}
          </span>}
          {name === 'email' &&
            <>
              <InfoIcon className='infoIcon'/>
              <InfoMessage className='infoMessageWrapper' text={`To change your email, please contact with our team 'contact@test.com'`}/>
            </>
          }
          {errorMessage && errorMessage[name] && 
            <Text
              tag={'span'}
              className={`${styles.errorText} text-extrasmall errorText ${errorMessageClassName ? errorMessageClassName : null}`}
              children={errorMessage && errorMessage[name]}
            />
          }
        </label>
      )}
    </div>
  )
}
