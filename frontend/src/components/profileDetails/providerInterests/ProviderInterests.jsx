import styles from './providerInterests.module.css';
import aboutMeStyles from '../profileAboutMe/profileAboutMe.module.css';
import React from 'react';

// ToDo: change component structure
export default function ProviderInterests({componentTitle, data, isRateData, schedule}) {
  return (
    <div className={aboutMeStyles.aboutMeContainer}>
      <h3 className={aboutMeStyles.aboutMeTitle}>{componentTitle}</h3>
      <div className={`${schedule ? styles.scheduleWrapper : ''}`}>
        {schedule && schedule.length &&
          <div className={`${styles.scheduleContainer}`}>
            {schedule.map(dataItem => {
              return (
                <React.Fragment key={dataItem.id}>
                  {dataItem.start && dataItem.end && dataItem.workday &&
                    <p className={`${styles.providerInterestsItem} ${styles.providerRatesItem} ${styles.providerInterestsItemContainer}`}>
                      {dataItem.workday} - <span className={styles.providerRatesItemPrice}>{dataItem.start} - {dataItem.end}</span>
                    </p>
                  }
                </React.Fragment>
              )
            })}
          </div>
        }
        <div className={`${styles.interestsItemsWrapper} ${schedule ? styles.scheduleInfoWrapper : ''}`}>
          {data.map((dataItem, index) => {
              return (
                <React.Fragment key={index}>
                  {!!isRateData && dataItem.price && dataItem.duration &&
                    <p className={`${styles.providerInterestsItem} ${styles.providerRatesItem} ${styles.providerInterestsItemContainer}`}>
                      {dataItem.duration} - <span className={styles.providerRatesItemPrice}>${dataItem.price}</span>
                    </p>
                  }
                  {dataItem.item && <span key={index} className={`${styles.providerInterestsItem} ${styles.providerInterestsItemContainer}`}>{dataItem.item}</span>}
                </React.Fragment>
              )
            })
          }
        </div>
      </div>
      {isRateData &&
        <div className={styles.additionalInfoContainer}>
          {data.map((dataItem, index) => {
            if (!dataItem.additionalInfo) return;

            return (
              <div key={dataItem.id + index} className={styles.providerInterestsItemContainer}>
                <span className={styles.providerInterestsItem}>{dataItem.additionalInfo}</span>
              </div>
            )
          })}
        </div>
      }
    </div>
  )
}
