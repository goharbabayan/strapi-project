import Button from '../button/Button';
import InputField from '../inputField/InputField';
import Text from '../text/Text';
import styles from './rates.module.css';

export default function Rates ({title, type, memberFormData, memberIndex, onChildFormDataChange, error, optionsList}) {
  const handleAddRate = (e, type) => {
    const updatedRates = [...memberFormData[type],
      {
        duration: '',
        price: '',
        additionalInfo: ''
      }
    ];
    onChildFormDataChange(type, updatedRates);
  };

  const handleRemoveRate = (e, index, type) => {
    const ratesAfterRemove = memberFormData[type].filter((item, i) => i !== index);
    onChildFormDataChange(type, ratesAfterRemove);
  };

  const handleChange = (e, index, field, type) => {
    const updatedRates = memberFormData[type].map((rate, i) => {
      if (i === index) {
        return { ...rate, [field]: e.target.value };
      }
      return rate;
    });
    onChildFormDataChange(type, updatedRates);
  };

  const handleMouseDown = (field, fieldValue, index, type) => {
    if (!Array.isArray(memberFormData[type]) && !memberFormData[type].length > 0) return;
    const updatedRates = memberFormData[type].map((rate, i) => {
      if (i === index) {
        return { ...rate, [field]: fieldValue };
      }
      return rate;
    });
    onChildFormDataChange(type, updatedRates);
  }

  return (
    <>
      <h4 className={styles.subtitle}>{title}</h4>
      <div className={`${styles.formGroup} ${styles.mainInfo}`}>
        <div className={`${styles.ratesContainer}`}>
          {memberFormData && memberFormData[type].map((rate, index) => (
            <div className={styles.rateItem} key={index}>
              <InputField
                label='Duration:'
                labelClassName={'selectOptionLabel'}
                selectClassName={`${styles.duration} select`}
                fieldClassName={'selectOptionsWrapper'}
                type='select'
                name='duration'
                id={`duration_${index}`}
                datatype={type}
                data-index={memberIndex}
                value={rate.duration ? rate.duration : ''}
                onChange={handleChange}
                onMouseDown={(name, fieldValue) => handleMouseDown(name, fieldValue, index, type)}
                isRequired={true}
                options={optionsList}
                errorMessage={error}
              />
              <div className={styles.inputWrap}>
                <label
                  htmlFor={`price_${index}`}
                  className={styles.label}
                >
                  Price:
                </label>
                <div className={`${styles.priceInput}`}>
                  <span className={styles.dollarIcon}>$</span>
                  <input
                    type='number'
                    id={`price_${index}`}
                    placeholder='Enter price'
                    value={rate.price ? rate.price : ''}
                    className={styles.input}
                    required
                    datatype={type}
                    min={1}
                    data-index={memberIndex}
                    onKeyDown={(e) => e.key === 'Enter' ? e.preventDefault() : null}
                    onChange={(e) => handleChange(e, index, 'price', type)}
                  />
                </div>
              </div>
              <div className={styles.inputWrap}>
                <label
                  htmlFor={`additionalInfo_${index}`}
                  className={`${styles.label} ${styles.additionalInfoLabel}`}
                >
                  Additional Information:
                </label>
                <input
                  type='text'
                  id={`additionalInfo_${index}`}
                  placeholder='Enter additional information'
                  value={rate.additionalInfo === null ? '' : rate.additionalInfo}
                  className={styles.input}
                  datatype={type}
                  data-index={memberIndex}
                  onKeyDown={(e) => e.key === 'Enter' ? e.preventDefault() : null}
                  onChange={(e) => handleChange(e, index, 'additionalInfo', type)}
                />
              </div>
              <Button
                type='button'
                className={`${styles.smallButton} btn_small button`}
                onClick={(e) => handleRemoveRate(e, index, type)}
                children={'Remove'}
              />
            </div>
          ))}
          <Button
            type='button'
            className={`${styles.button} btn`}
            onClick={(e) => handleAddRate(e, type)}
            children={'ADD NEW RATE HERE'}
          />
        </div>
        {error &&
          <Text
            tag={'span'}
            className={`text-small ${styles.error}`}
            children={error}
          />
        }
      </div>
    </>
  )
}
