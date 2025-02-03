import { useState } from 'react';
import Button from '../button/Button';
import InputField from '../inputField/InputField';
import Text from '../text/Text';
import styles from './rates.module.css';
import PlusIcon from '../icons/plusIcon';
import RemoveIcon from '../icons/RemoveIcon';

export default function Rates ({type, subType, userRates, memberIndex, updateChange, setParentState, error, optionsList, hideButtons, showSubType}) {
  const [rates, setRates] = useState(userRates);
  const handleAddRate = (e, type) => {
    const updatedRates = [...rates,
      {
        duration: '',
        price: '',
        additionalInfo: ''
      }
    ];
    setRates(updatedRates);
    setParentState && setParentState(updatedRates);
  };

  const handleRemoveRate = (e, index, type, subType) => {
    const ratesAfterRemove = rates.filter((item, i) => i !== index);
    setRates(ratesAfterRemove);
    setParentState && setParentState(ratesAfterRemove);
  };

  const handleChange = (e, index, field, type, subType) => {
    const updatedRates = rates.map((rate, i) => {
      if (i === index) {
        return { ...rate, [field]: e.target.value };
      }
      return rate;
    });
    
    setRates(updatedRates);
    setParentState && setParentState(updatedRates);
  };

  const handleMouseDown = (field, fieldValue, index, type, subType) => {
    if (!Array.isArray(rates) && !rates.length > 0) return;
    const updatedRates = rates.map((rate, i) => {
      if (i === index) {
        return { ...rate, [field]: fieldValue };
      }
      return rate;
    });
    setRates(updatedRates);
    setParentState && setParentState(updatedRates);
  };

  const saveChanges = () => {
    updateChange(rates)
  };

  const cancelChanges = () => {
    setRates(userRates);
  };

  return (
    <>
      <div className={`${styles.formGroup} ${styles.mainInfo}`}>
        {showSubType &&
          <Text
            tag={'h2'}
            className={styles.subType}
            children={subType}
          />
        }
        <div className={`${styles.ratesContainer}`}>
          {rates && rates.map(({duration, price, additionalInfo}, index) => (
            <div className={styles.rateItem} key={index}>
              <div className={styles.itemWrapper}>
                <InputField
                  name={'duration'}
                  selectClassName={`${styles.duration} select`}
                  fieldClassName={'selectOptionsWrapper'}
                  type='select'
                  id={`duration_${index}`}
                  datatype={type}
                  data-index={memberIndex}
                  value={duration || ''}
                  onChange={(e) => handleChange(e, index, 'duration')}
                  onMouseDown={(name, fieldValue) => handleMouseDown(name, fieldValue, index, type, subType)}
                  isRequired={true}
                  options={optionsList}
                  errorMessage={error}
                />
                <div className={styles.inputWrap}>
                  <div className={`${styles.priceInput}`}>
                    <input
                      type='number'
                      id={`price_${index}`}
                      placeholder='Enter price'
                      value={price || ''}
                      className={styles.input}
                      required
                      datatype={type}
                      min={1}
                      data-index={memberIndex}
                      onKeyDown={(e) => e.key === 'Enter' ? e.preventDefault() : null}
                      onChange={(e) => handleChange(e, index, 'price', type, subType)}
                    />
                    <span className={styles.dollarIcon}>$</span>
                  </div>
                </div>
              </div>
              <div className={styles.itemWrapper}>
                <div className={`${styles.inputWrap} ${styles.additionalInfoWrap}`}>
                  <input
                    type='text'
                    id={`additionalInfo_${index}`}
                    placeholder='Enter yor notes...'
                    value={additionalInfo || ''}
                    className={`${styles.input} ${styles.additionalInfo}`}
                    datatype={type}
                    data-index={memberIndex}
                    onKeyDown={(e) => e.key === 'Enter' ? e.preventDefault() : null}
                    onChange={(e) => handleChange(e, index, 'additionalInfo', type, subType)}
                  />
                </div>
                <RemoveIcon
                  className={`${styles.smallButton}`}
                  onClick={(e) => handleRemoveRate(e, index, type, subType)}
                />
              </div>
            </div>
          ))}
          <div className={styles.add}>
            <PlusIcon
              className={styles.iconPlus}
              text={'Add condition'}
              textClassName={styles.buttonText}
              fill={`var(--neutral-black)`}
              onClick={(e) => handleAddRate(e, type, subType)}
            />
          </div>
        </div>
        {error &&
          <Text
            tag={'span'}
            className={`text-small ${styles.error}`}
            children={error}
          />
        }
      </div>
      {!hideButtons &&
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
    </>
  )
}
