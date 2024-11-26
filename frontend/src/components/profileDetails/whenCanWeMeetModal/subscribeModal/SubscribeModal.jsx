import { useFetchData } from '@/app/utils/hooks/useFetch';
import PopUpCloseIcon from '@/components/icons/PopUpCloseIcon';
import styles from './subscribeModal.module.css';
import { useState } from 'react';
import { validateEmail } from '@/app/utils/validation';
import WhenCanWeMeetIcon from '@/components/icons/WhenCanWeMeetIcon';
import Button from '@/components/button/Button';

export default function SubscribeModal({setShow, username, schedule}) {
  const [emailValue, setEmailValue] = useState('');
  const [showError, setShowError] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSubscribeToAvailability = () => {
    if (!validateEmail(emailValue)) {
      setShowError(true);
      
      setTimeout(() => {
        setShowError(false);
      }, 2000);
      return;
    }

    useFetchData(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/subscribers`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(
        {
          data: {
            email: emailValue,
            provider: username,
            schedule: schedule
          }
        }
      )
    }).then(() => {
      setShowSuccessMessage(true);

      setTimeout(() => {
      setShowSuccessMessage(false);
      }, 2000);
    })
  }

  const handleEmailChange = (e) => {

    setEmailValue(e.target.value);
  }

  return (
    <>
      <div className={styles.subscribeModalBackground}>
        <div className={styles.subscribeModal}>
          <div className={styles.subscribeModalHeader}>
            <h3 className={styles.subscribeModalTitle}>Subscribe to my availability</h3>
            <PopUpCloseIcon onClick={() => setShow(false)} className={styles.subscribeModalClose} />
          </div>
          <div className={styles.subscribeModalBody}>
            <WhenCanWeMeetIcon width={48} height={48} stroke={'#753642'} />
            <p className={styles.subscribeModalDesc}>Be notified when {username} becomes available for bookings on short notice.</p>
            <input
              onChange={(e) => handleEmailChange(e)}
              className={styles.subscribeModalInput}
              placeholder="Email"
            />
            {showError && <span className={styles.subscribeModalError}>Fill valid email</span>}
            <Button
              className={styles.subscribeModalButton}
              onClick={() => handleSubscribeToAvailability()}
              children={'Notify Me!'}
            />
            {showSuccessMessage && <span className={styles.subscribeModalSuccess}>You have subscribed successfully !</span>}
          </div>
        </div>
      </div>
    </>
  )
}
