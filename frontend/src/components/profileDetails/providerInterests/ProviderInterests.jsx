import styles from './providerInterests.module.css';
import aboutMeStyles from '../profileAboutMe/profileAboutMe.module.css';
import React from 'react';
import EditContentIcon from '@/components/icons/EditContent';
import Text from '@/components/text/Text';

// ToDo: change component structure
export default function ProviderInterests({componentTitle, data, data2, dataTitle, dataTitle2, isRateData, schedule, showEditButton, onClick}) {
  return (
    <div className={aboutMeStyles.aboutMeContainer}>
      {componentTitle &&
        <div className={styles.titleAndIconWrapper}>
          <Text
            tag={'h3'}
            children={componentTitle}
            className={aboutMeStyles.aboutMeTitle}
          />
          {showEditButton &&
            <EditContentIcon
              className={styles.editIcon}
              onClick={onClick}
            />
          }
        </div>
      }
      <div className={`${schedule ? styles.scheduleWrapper : ''}`}>
        {schedule && schedule.length > 0 &&
          <div className={`${styles.scheduleContainer}`}>
            {schedule.map((dataItem, index) => {
              return (
                <React.Fragment key={index}>
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
        {data && Array.isArray(data) &&
          <>
            {dataTitle && data.length > 0 &&
              <Text
                tag={'span'}
                className={styles.subtitle}
                children={dataTitle}
              />
            }
            <div className={`${styles.interestsItemsWrapper} ${schedule ? styles.scheduleInfoWrapper : ''}`}>
              {data.length > 0 && data.map((dataItem, index) => {
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
          </>
        }
        {isRateData && data && Array.isArray(data) &&
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
        {data2 && Array.isArray(data2) &&
          <>
            {dataTitle2 && data2.length > 0 && 
              <Text
                tag={'span'}
                className={styles.subtitle}
                children={dataTitle2}
              />
            }
            <div className={`${styles.interestsItemsWrapper} ${schedule ? styles.scheduleInfoWrapper : ''}`}>
              {data2.length > 0 && data2.map((dataItem, index) => {
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
          </>
        }
        {isRateData && data2 && Array.isArray(data2) &&
          <div className={styles.additionalInfoContainer}>
            {data2.map((dataItem, index) => {
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
    </div>
  )
}
