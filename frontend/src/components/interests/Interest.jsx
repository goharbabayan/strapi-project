import styles from './interest.module.css';
import Text from '../text/Text';
import { EXTRAS, MY_GLAM, MY_CLOSET } from '@/app/utils/constants/userPossibleOutfits';
import Button from '../button/Button';
import { useEffect, useState } from 'react';
import Checkbox from '../checkbox/CheckBox';
import PopUpCloseIcon from '../icons/PopUpCloseIcon';
import EditContentIcon from '../icons/EditContent';
import EditIcon from '../icons/Edit';
import PlusIcon from '../icons/plusIcon';

export default function Interest ({userSelectedInterests, optionsList, updateChange, title, setParentState, showEditAndDeleteButtons, showServicesOptions, onShowOptions, hideSaveAndCancelButtons, resetUserSelectedServices}) {
  const [options, setOptions] = useState(userSelectedInterests);
  const [interestCheckboxesState, setInterestCheckboxesState] = useState([]);
  const [updatedSelectedInterest, setUpdatedSelectedInterest] = useState(userSelectedInterests);

  useEffect(() => {
    if (!updatedSelectedInterest) return;
    const optionsListWithoutUserSelectedInterest = optionsList.filter(option => !updatedSelectedInterest.some(interest => option.value === interest.item));
    setOptions(optionsListWithoutUserSelectedInterest);
  }, [userSelectedInterests]);

  useEffect(() => {
    if (!updatedSelectedInterest) return;
    cancelChanges();
  }, [resetUserSelectedServices]);

  const saveChanges = () => {
    updateChange(updatedSelectedInterest);
  };

  const cancelChanges = () => {
    setUpdatedSelectedInterest(userSelectedInterests);
    const optionsListWithoutUserSelectedInterest = optionsList.filter(option => !userSelectedInterests.some(interest => option.value === interest.item));
    setOptions(optionsListWithoutUserSelectedInterest);
    setInterestCheckboxesState([]);
  };

  const onCheckboxChange = (optionValue, isChecked) => {
    setInterestCheckboxesState((prevState) =>
      isChecked
        ? [...prevState, optionValue]
        : prevState.filter((item) => item !== optionValue)
    );
    if (isChecked) {
      setUpdatedSelectedInterest([...updatedSelectedInterest, {item: optionValue}]);
      setParentState && setParentState([...updatedSelectedInterest, {item: optionValue}]);
    } else {
      setUpdatedSelectedInterest(updatedSelectedInterest.filter(interest => interest.item !== optionValue));
      setParentState && setParentState(updatedSelectedInterest.filter(interest => interest.item !== optionValue));
    };
  };

  const handleRemoveInterest = (name) => {
    const newSelectedInterest = updatedSelectedInterest.filter(interest => interest.item !== name);
    const checkboxesData = interestCheckboxesState.filter(item => item !== name);
    setUpdatedSelectedInterest(newSelectedInterest);
    setParentState && setParentState(newSelectedInterest);
    setInterestCheckboxesState(checkboxesData);

    // if removed an item from selected interests, add it as option in options list
    userSelectedInterests.some(interest => {
      if (interest.item === name) {
        const updatedOptions = [...options, { value: name, label: name }].sort((a, b) =>
          a.label.localeCompare(b.label)
        );
        setOptions(updatedOptions);
        return true;
      }
      return false;
    });
  };

  return (
    <>
      <div
        className={`${styles.mainWrapper}`}
      >
        {showEditAndDeleteButtons && title &&
          <div className={styles.title}>
            <Text
              tag={'span'}
              className={styles.subtitle}
              children={title}
            />
          </div>
        }
        {updatedSelectedInterest && updatedSelectedInterest?.length > 0 &&
          <ul className={`${styles.selectedItems}`}>
            {updatedSelectedInterest.map((item, index) => (
              <div key={index} className={styles.selectedItem}>
                <li className={`${styles.selectedItemTitle} unstyled-list`}>
                  {item.item}
                </li>
                <PopUpCloseIcon className={styles.closeIcon} onClick={() => handleRemoveInterest(item.item)}/>
              </div>
            ))}
          </ul>
        }
        {!showServicesOptions &&
          <div className={styles.add}>
            <PlusIcon
              className={styles.iconPlus}
              text={'Add from List'}
              textClassName={styles.buttonText}
              fill={`var(--neutral-white-n10)`}
              onClick={onShowOptions}
            />
          </div>
        }
        {Array.isArray(options) && options.length > 0 && showServicesOptions &&
          <ul id="optionsList" className={`${styles.options} ${title === 'GFE' || title === 'PSE' ? styles.gfepseOptions : ''} unstyled-list`}>
            {options.map((option, index) => {
              const {value} = option;
              return (
                <li key={index} className={`${styles.option} text-small`}>
                  <input type="text" value={value || ''} readOnly={true} hidden/>
                    {value}
                    <Checkbox
                      props={{
                        containerClassName: styles.checkboxContainer,
                        value: value,
                        onChange: (e) => onCheckboxChange(value, !interestCheckboxesState.includes(value)),
                        isChecked: interestCheckboxesState.some(item => item === value),
                      }}
                    />
                </li>
              )
            })}
          </ul>
        }
        {showServicesOptions && !hideSaveAndCancelButtons &&
          <div className={styles.buttons}>
            <Button
              children={'Cancel'}
              variant={'general'}
              onClick={cancelChanges}
            />
            <Button
              type={'button'}
              children={'Save changes'}
              variant={'main'}
              onClick={saveChanges}
            />
          </div>
        }
      </div>
    </>
  )
};
