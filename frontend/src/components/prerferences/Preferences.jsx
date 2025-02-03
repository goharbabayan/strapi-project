import { useEffect, useState } from 'react';
import styles from './preferences.module.css';
import Text from '../text/Text';
import Button from '../button/Button';

export default function Preferences({
  field,
  subtitle,
  data,
  resetInput,
  onPreferencesChange,
  error
}) {
  const [currentItem, setCurrentItem] = useState({
    services: {item: ''},
    additionalInfo: {item: ''},
  });

  useEffect(() => {
    setCurrentItem({
      services: {item: ''},
      additionalInfo: {item: ''},
    });
  }, []);

  useEffect(() => {
    setCurrentItem({
      services: { item: '' },
      additionalInfo: { item: '' },
    });
  }, [resetInput]);

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
    <>
      {subtitle &&
        <Text
          tag={'h4'}
          className={styles.subtitle}
          children={subtitle}
        />
      }
      <div className={styles.itemContainer}>
        <div className={`${styles.selectedItems} ${field === 'additionalInfo' ? styles.additionalInfo : ''}`}>
          {data && data.map((item, index) => (item.item.trim() != '' &&
            <div key={index} className={styles.selectedItem}>
              <Text
                tag={'span'}
                className={styles.selectedItemTitle}
                children={item.item}
              />
              <span aria-hidden='true' className={styles.closeIcon} onClick={() => handleRemoveItem(field, index)}>x</span>
            </div>
          ))}
        </div>
        <div className={styles.textInput}>
          <input
            id={field}
            type='text'
            value={currentItem[field].item === null ? '' : currentItem[field].item}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === 'Enter' ? handleAddItem(e, field) : null}
            placeholder='Type some text here...'
            className={styles.input}
          />
          {currentItem[field].item && (
            <Button
              className={`${styles.button} btn_small`}
              onClick={(e) => handleAddItem(e, field)}
              children={'Add'}
            />
          )}
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
