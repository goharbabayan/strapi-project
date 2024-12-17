import styles from './whenCanWeMeetModal.module.css';
import SubscribeModal from './subscribeModal/SubscribeModal';
import { useEffect, useState } from 'react';
import WhenCanWeMeetIcon from '@/components/icons/WhenCanWeMeetIcon';
import Button from '@/components/button/Button';

export default function WhenCanWeMeetModal({username, schedule}) {
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    if (modalShow) {
      document.body.classList.add('overflow_hidden');
    } else {
      document.body.classList.remove('overflow_hidden');
    }
  }, [modalShow])

  return (
    <div className={styles.notifyModalContainer}>
      <div className={styles.notifyModalWrapper}>
        <WhenCanWeMeetIcon
          onClick={() => setModalShow(false)}
          width={30}
          height={30}
          stroke={'#ffffff'}
        />
        <h3 className={styles.notifyModalTitle}>Subscribe to my availability</h3>
        <p className={styles.notifyModalDesc}>Be notified when {username} becomes available for bookings on short notice.</p>
        <Button
          onClick={() => setModalShow(true)}
          className={styles.notifyModalButton}
          children={'Subscribe Now'}
        />
      </div>
      {modalShow && <SubscribeModal username={username} setShow={setModalShow} schedule={schedule} />}
    </div>
  )
}
