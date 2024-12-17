import { forwardRef } from 'react';
import styles from './schedule.module.css';
import Preferences from '../prerferences/Preferences';
import Text from '../text/Text';

const Schedule = forwardRef(({
  userSchedule,
  onPreferencesChange,
  formData,
  onChildFormDataChange,
  error
},
  ref) => {

  const handleChange = (index, timeType, e) => {
    e.preventDefault();
    const updatedWorkingTimes = [...userSchedule];
    updatedWorkingTimes[index][timeType] = e.target.value;
    onChildFormDataChange(updatedWorkingTimes);
  };

  return (
    <section id='When Can we met' className='formGroup schedule section page-width' ref={ref}>
      <Text
        tag={'h2'}
        className='title'
        children={'When Can we met'}
      />
      <div className=''>
        <Text
          tag={'h4'}
          className='subtitle'
          children={'Schedule*'}
        />
        <div className={styles.container}>
          {userSchedule && userSchedule.map((dayData, index) => (
            <div key={index} className={styles.itemWrap}>
              <label className={`${styles.label} ${styles.workday}`}>{dayData.workday}</label>
              <div className={`${styles.timeWrapper}`}>
                <label className={styles.label}>Start time</label>
                <input
                  type='time'
                  value={dayData.start}
                  className={styles.input}
                  onKeyDown={(e) => e.key === 'Enter' ? e.preventDefault() : null}
                  onChange={(e) => handleChange(index, 'start', e)}
                  placeholder='Start time'
                />
              </div>
              <div className={`${styles.timeWrapper}`}>
                <label className={styles.label}>End time:</label>
                <input
                  type='time'
                  value={dayData.end}
                  className={styles.input}
                  onKeyDown={(e) => e.key === 'Enter' ? e.preventDefault() : null}
                  onChange={(e) => handleChange(index, 'end', e)}
                  placeholder='End time'
                />
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
      </div>
      <div className={`column ${styles.additionalInfoWrapper}`}>
        <Text
          tag={'h4'}
          className='subtitle'
          children={'Additional information'}
        />
        <Preferences
          field='additionalInfo'
          data={formData?.additionalInfo || []}
          onPreferencesChange={onPreferencesChange}
          error={error?.additionalInfo}
        />
      </div>
    </section>
  );
});

export default Schedule;
