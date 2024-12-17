import { useState } from 'react';
import styles from './preferences.module.css';
import Text from '../text/Text';
import Button from '../button/Button';

export default function Preferences({field, subtitle, data, onPreferencesChange, error}) {
  const [currentItem, setCurrentItem] = useState({
    services: {item: ''},
    additionalInfo: {item: ''},
  })

  const handleInputChange = (event) => {
    const id = event.target.id;
    setCurrentItem({...currentItem, [id]: {...currentItem[id], item: event.target.value}});
  };

  const handleAddItem = (e, field) => {
    e.preventDefault();
    const currentInterestIsNotEmpty = currentItem[field].item.trim() != '';
    if (currentInterestIsNotEmpty) {
      setCurrentItem({[field] : {item: '' }});
      onPreferencesChange(field, [...data, currentItem[field]]);
    };
  };

  const handleRemoveItem = (field, index) => {
    const preferencesAfterRemove = data.filter((item, i) => i !== index);
    onPreferencesChange(field, preferencesAfterRemove);
  };

  return (
    <div>
      {subtitle &&
        <Text
          tag={'h4'}
          className={styles.subtitle}
          children={subtitle}
        />
      }
      <div className={styles.itemContainer}>
        <div className={styles.preferences}>
          <div className={styles.preferencesList}>
            {data && data.map((item, index) => (item.item.trim() != '' &&
              <div key={index} className={styles.preference}>
                <Text
                  tag={'span'}
                  className={`text-small`}
                  children={item.item}
                />
                <span aria-hidden='true' className={styles.closeIcon} onClick={() => handleRemoveItem(field, index)}>x</span>
              </div>
            ))}
          </div>
          <div>
            <input
              id={field}
              type='text'
              value={currentItem[field].item === null ? '' : currentItem[field].item}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === 'Enter' ? handleAddItem(e, field) : null}
              placeholder='Enter here ...'
              className={`input text-small`}
            />
            {currentItem[field].item && (
              <Button
                className={`${styles.button} btn_small`}
                onClick={(e) => handleAddItem(e, field)}
                children={'Add'}
              />
            )}
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
    </div>
  )
}
