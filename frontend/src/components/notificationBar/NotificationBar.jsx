import styles from './notificationBar.module.css';
import Text from '../text/Text';
import Button from '../button/Button';
import { CLIENT, SERVICE_PROVIDER } from '@/app/utils/constants/userRoles';

export default function NotificationBar({
  isApprovedByAdmin,
  onCancelButtonClick,
  onSaveButtonClick,
  showSuccessfullMessage,
  successfullMessageText,
  errorMessageText,
  userRole,
  isRegisteringANewMember
}) {
console.log('userRole: ', userRole);

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
          {!isRegisteringANewMember && userRole !== CLIENT &&
            <Button
              type='submit'
              className={`btn btn_SECONDARY ${styles.submitButton}`}
              children={'Request to review'}
            />
          }
        </>
      }
    </div>
  )
}
