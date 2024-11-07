import styles from './notificationBar.module.css';
import Text from '../text/Text';
import Button from '../button/Button';

export default function NotificationBar({
  isApprovedByAdmin,
  onCancelButtonClick,
  onSaveButtonClick,
  showSuccessfullMessage,
  successfullMessageText,
  errorMessageText,
  isRegisteringANewMember
}) {

  return (
    <div className={styles.notificationBar}>
      {showSuccessfullMessage && successfullMessageText &&
        <Text
          tag={'h4'}
          className={`${styles.notificationText} text-middle white`}
          children={successfullMessageText}
        />
      }
      {errorMessageText &&
        <Text
          tag={'h4'}
          className={`${styles.notificationText} text-middle white`}
          children={errorMessageText}
        />
      }
      {!(errorMessageText || showSuccessfullMessage) &&
        <>
          <Text
            tag={'h4'}
            className={`${styles.notificationText} text-middle`}
            children={'Unsaved changes'}
          />
          <div className={`${styles.primaryButtonsWrapper}`}>
            <Button
              type='button'
              className={`btn btn_SECONDARY ${styles.cancelButton}`}
              onClick={onCancelButtonClick}
              children={'Cancel'}
            />
            {
              <Button
                type='button'
                className={`btn btn_SECONDARY ${styles.submitButton}`}
                onClick={onSaveButtonClick}
                children={isRegisteringANewMember ? 'Save as a draft' : 'Save'}
              />
            }
          </div>
        </>
      }
    </div>
  )
}
