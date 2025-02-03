'use client'

import styles from './modal.module.css';
import Text from '../text/Text';
import Button from '../button/Button';
import PopUpCloseIcon from '../icons/PopUpCloseIcon';
import IconCheckedInCircle from '../icons/IconCheckedInCircle';
import { Fragment } from 'react';
import Popup from '../popup/Popup';
import InfoIcon from '../icons/Info';

export default function Modal ({
  title,
  content,
  contentStyles,
  closeModal,
}) {
  const handleModalClose = (e) => {
    const isModalCloseButtonClicked = e.currentTarget.classList.contains(`${styles.closeIcon}`)
    if (isModalCloseButtonClicked) {
      document.body.classList.remove('overflow_hidden');
      closeModal();
    };
  };

   // to ensure that content is always treated as an array
   const contentArray = Array.isArray(content) ? content : [content];

  return (
    <>
      <div className={`${styles.modal} modal-component`}>
        <div className={`${styles.overlay}`} onClick={(e) => handleModalClose(e)}></div>
        <div className={`${styles.mainWrapper}`}>
          <div className={`${styles.modalContainer}`}>
            <div  className={styles.row}>
              {title &&
                <Text
                  tag={'h3'}
                  className={styles.title}
                  children={title}
                />
              }
              <PopUpCloseIcon
                className={styles.closeIcon}
                onClick={(e) => handleModalClose(e)}
              />
            </div>
            <div className={`${styles.content} ${(contentStyles && contentStyles?.contentClassName) || ''}`}>
              {contentArray.map((item, index) => {
                const {
                  title = '',
                  text = '',
                  Icon = null,
                  buttons = [],
                  showButtons = false,
                  showButtonsCentered = false,
                  isVerifiedLevel = false,
                } = item || {};
                return (
                  <div
                    key={index}
                    className={(contentStyles && contentStyles?.itemClassName) || ''}
                    >
                    {Icon &&
                      <div className={styles.iconWrapper}>
                        {Icon}
                        {isVerifiedLevel &&
                          <IconCheckedInCircle className={styles.checkIcon}/>
                        }
                      </div>
                    }
                    {(title || text || showButtons) && (
                      <div className={styles.itemInfo}>
                        {(title || text) && (
                          <div>
                            {title &&
                              <Text
                                tag={'h5'}
                                children={title}
                                className={styles.itemTitle}
                              />
                            }
                            {text &&
                              <Text
                                tag={'span'}
                                children={text}
                                className={styles.itemText}
                              />
                            }
                          </div>
                        )}
                        {showButtons && buttons && buttons?.length > 0 &&
                          <div className={`${styles.buttonsWrap} ${showButtonsCentered ? styles.centered : ''}`}>
                            {buttons.map((button, index) => {
                                const {type, variant, children, onClick} = button;
                                return (
                                  <Fragment key={index}>
                                    <Button
                                      variant={variant}
                                      type={type}
                                      children={children}
                                      onClick={onClick}
                                    />
                                  </Fragment>
                                )
                              })
                            }
                          </div>
                        }
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
