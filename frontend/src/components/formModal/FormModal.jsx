'use client'

import styles from './formModal.module.css';
import Text from '../text/Text';
import PopUpCloseIcon from '../icons/PopUpCloseIcon';

export default function FormModal ({title, className, onClose, children}) {
  const handleModalClose = (e) => {
    const isModalCloseButtonClicked = e.currentTarget.classList.contains(`${styles.closeIcon}`)
    if (isModalCloseButtonClicked) {
      document.body.classList.remove('overflow_hidden');
      onClose();
    };
  };

  return (
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
          <div className={`${styles.content} ${className ? className : ''}`}>
           {children}
          </div>
        </div>
      </div>
    </div>
  )
}
