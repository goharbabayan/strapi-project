import { useRef } from 'react';
import styles from './suburbField.module.css';
import Text from '../text/Text';
import PopUpCloseIcon from '../icons/PopUpCloseIcon';
import Checkbox from '../checkbox/CheckBox';

export default function SuburbField ({
  label,
  type,
  name,
  onCheckboxChange,
  onChange,
  suburbCheckboxesState,
  suburbsOptions,
  userSuburbs,
  onSelectedSuburbDelete,
  errorMessage,
}) {
  const suburbRef=useRef(null);
  const listItemsRefs = useRef([]);

  const handleRemoveSuburbItem = (index) => {
    const clickedElementName = listItemsRefs.current[index].dataset.name;
    const updatedSelectedSuburbs = userSuburbs.filter(suburb => suburb.name !== clickedElementName);
    onSelectedSuburbDelete(clickedElementName)
    onChange('suburbs', updatedSelectedSuburbs);
  };

// ToDo: For select options change the component to be one for all select options
  return (
    <>
        <div className={styles.container}>
          <div>
            {userSuburbs.length > 0 &&
              <>
                <label className='label'>{label}</label>
                <ul className={`${styles.selectedSuburbs} unstyled-list`}>
                  {userSuburbs.map((suburb, index) => (
                    <li key={index} className={`${styles.suburbItem}`}>
                      <span
                        className={styles.item}
                        ref={(element) => element ? listItemsRefs.current[index] = element : null}
                        data-name={`${suburb.name}`}
                      >
                        {suburb.name}
                      </span>
                      <PopUpCloseIcon className={styles.closeIcon} onClick={() => handleRemoveSuburbItem(index)}/>
                    </li>
                  ))}
                </ul>
              </>
            }
            {suburbsOptions.length > 0 &&
              <ul id="optionsList" className={`${styles.options} unstyled-list options`}>
                {suburbsOptions.map((option, index) => (
                  <li key={index} value={option.value} name={name} className={`${styles.option} text-small`} ref={suburbRef} >
                    <input type={type} name={name} value={option.value} data-code={option.code} readOnly={true} hidden/>
                    {option.label ? option.label : option.value}
                      <Checkbox props={{
                        containerClassName: styles.checkboxContainer,
                        value: option.value,
                        onChange: onCheckboxChange,
                        isChecked: suburbCheckboxesState.some(item => item === option.value),
                      }}
                    />
                  </li>
                ))}
              </ul>
            }
          </div>
          {errorMessage && errorMessage?.suburbs &&
            <Text
              tag={'span'}
              className={`${styles.errorText} text-extrasmall errorText`}
              children={errorMessage && errorMessage?.suburbs}
            />
          }
      </div>
    </>
  )
}
