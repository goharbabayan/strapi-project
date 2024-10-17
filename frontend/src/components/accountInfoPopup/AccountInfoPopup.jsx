import styles from './accountInfoPopup.module.css';
import Button from '../button/Button';
import AccountDetails from '../accountDetails/AccountDetails';

export default function AccountInfoPopup({onClose, username, ressidentialAddress, password, onChange, onEditIconClick}) {
  const handleModalClose = (e) => {
    const isClickedOutsideModalContent = !(e.target.closest(`.${styles.modalContent}`) || e.target.classList.contains(`${styles.modalContent}`))
    const isModalCloseButtonClicked = e.target.classList.contains(`${styles.modalClose}`)
    if (isClickedOutsideModalContent || isModalCloseButtonClicked) {
     onClose();
    }
  };

  return (
    <div id='modalOverlay' className={`${styles.modalOverlay}`} onClick={(e) => handleModalClose(e)}>
      <div className={styles.modalContent}>
        <AccountDetails
          username={username}
          ressidentialAddress={ressidentialAddress}
          password={password}
          onChange={onChange}
          onEditIconClick={onEditIconClick}
        />
        <Button className={`${styles.modalClose}`} onClick={(e) => handleModalClose(e)}>&times;</Button>
      </div>
    </div>
  )
}
