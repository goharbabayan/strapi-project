import styles from './notificationBar.module.css';
import Text from '../text/Text';
import Button from '../button/Button';

export default function NotificationBar({
  notificationBarMessageAndStatus,
  isApprovedByAdmin,
  onCancelButtonClick,
  onSaveButtonClick,
  showNotificationBar,
}) {

  return (
    <div className={styles.notificationBar}>
      {notificationBarMessageAndStatus?.show &&
        <Text
          tag={'h4'}
          className={`${styles.notificationText} text-middle white`}
          children={notificationBarMessageAndStatus.message}
        />
      }
      {showNotificationBar && !notificationBarMessageAndStatus?.show &&
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
              children={'Reset to the original'}
            />
            {
              <Button
                type='button'
                className={`btn btn_SECONDARY ${styles.submitButton}`}
                onClick={onSaveButtonClick}
                children={'Save as a draft'}
              />
            }
          </div>
        </>
      }
    </div>
  )
}
