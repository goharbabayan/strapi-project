import styles from './accountInfoPopup.module.css';
import Button from '../button/Button';
import AccountDetails from '../accountDetails/AccountDetails';

export default function AccountInfoPopup({onClose, username, onChange, onEditIconClick}) {

  return (
    <div id='modalOverlay' className={`${styles.modalOverlay}`}>
      <div className={styles.modalContent}>
        <AccountDetails
          username={username}
          onChange={onChange}
          onEditIconClick={onEditIconClick}
          className={styles.accountInfoResetPassword}
        />
        <Button className={`${styles.modalClose}`} onClick={() => onClose()}>&times;</Button>
      </div>
    </div>
  )
}
