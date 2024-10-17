import styles from './notificationBar.module.css';
import Text from '../text/Text';
import Button from '../button/Button';
import { SERVICE_PROVIDER } from '@/app/utils/constants/userRoles';

export default function NotificationBar({
  isApprovedByAdmin,
  onCancelButtonClick,
  onSaveButtonClick,
  showSuccessfullMessage,
  successfullMessageText,
  showErrorMessage,
  errorMessageText,
  userRole
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
      {showErrorMessage && errorMessageText &&
        <Text
          tag={'h4'}
          className={`${styles.notificationText} text-middle white`}
          children={errorMessageText}
        />
      }
      {!(showErrorMessage || showSuccessfullMessage) &&
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
            {userRole === SERVICE_PROVIDER &&
              <Button
                type='button'
                className={`btn btn_SECONDARY ${styles.submitButton}`}
                onClick={onSaveButtonClick}
                children={'Save'}
              />
            }
          </div>
          <Button
            type='submit'
            className={`btn btn_SECONDARY ${styles.submitButton}`}
            children={!isApprovedByAdmin ? 'Request to review' : 'Submit for review'}
          />
        </>
      }
    </div>
  )
}
