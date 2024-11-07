import styles from './whenCanWeMeetModal.module.css';
import SubscribeModal from './subscribeModal/SubscribeModal';
import { useEffect, useState } from 'react';
import WhenCanWeMeetIcon from '@/components/icons/WhenCanWeMeetIcon';

export default function WhenCanWeMeetModal({username, schedule}) {
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('overflow_hidden');
  }, [modalShow])

  return (
    <div className={styles.notifyModalContainer}>
      <div className={styles.notifyModalWrapper}>
        <WhenCanWeMeetIcon width={30} height={30} stroke={'#ffffff'}/>
        <h3 className={styles.notifyModalTitle}>Subscribe to my availability</h3>
        <p className={styles.notifyModalDesc}>Be notified when {username} becomes available for bookings on short notice.</p>
        <button onClick={() => setModalShow(true)} className={styles.notifyModalButton}>Subscribe Now</button>
      </div>
      {modalShow && <SubscribeModal username={username} setShow={setModalShow} schedule={schedule} />}
    </div>
  )
}
