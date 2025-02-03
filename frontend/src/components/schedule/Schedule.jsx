import { forwardRef } from 'react';
import styles from './schedule.module.css';
import Preferences from '../prerferences/Preferences';
import Text from '../text/Text';
import Button from '../button/Button';

const Schedule = ({
  userSchedule,
  onPreferencesChange,
  additionalInfo,
  resetInput,
  onChange,
  onSaveChanges,
  onCancelChanges,
  error
}) => {
  return (
    <section>
      <div className={styles.mainWrapper}>
        <div className={styles.container}>
          <Text
            tag={'h4'}
            className={styles.subtitle}
            children={'Schedule*'}
          />
          {userSchedule && userSchedule.map((dayData, index) => (
            <div key={index} className={styles.itemWrap}>
              <label className={`${styles.label} ${styles.workday}`}>{dayData.workday}</label>
              <div className={styles.itemContainer}>
                <div className={`${styles.timeWrapper}`}>
                  <label className={styles.label}>From:</label>
                  <input
                    type='time'
                    value={dayData.start}
                    className={styles.input}
                    onKeyDown={(e) => e.key === 'Enter' ? e.preventDefault() : null}
                    onChange={(e) => onChange(index, 'start', e)}
                    placeholder='Start time'
                  />
                </div>
                <div className={`${styles.timeWrapper}`}>
                  <label className={styles.label}>To:</label>
                  <input
                    type='time'
                    value={dayData.end}
                    className={styles.input}
                    onKeyDown={(e) => e.key === 'Enter' ? e.preventDefault() : null}
                    onChange={(e) => onChange(index, 'end', e)}
                    placeholder='End time'
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        {error?.schedule &&
          <Text
            tag={'span'}
            className='text-small errorText schedule-error page-width'
            children={error.schedule}
          />
        }
        <div className={`${styles.additionalInfoWrapper}`}>
          <Text
            tag={'h4'}
            className={styles.subtitle}
            children={'Additional information'}
          />
          <Preferences
            field='additionalInfo'
            data={additionalInfo || []}
            resetInput={resetInput}
            onPreferencesChange={onPreferencesChange}
            error={error?.additionalInfo}
          />
        </div>
      </div>
      <div className={styles.buttons}>
        <Button
          children={'Cancel'}
          variant={'general'}
          onClick={onCancelChanges}
        />
        <Button
          type={'button'}
          children={'Save changes'}
          variant={'main'}
          onClick={onSaveChanges}
        />
      </div>
    </section>
  );
};

export default Schedule;
