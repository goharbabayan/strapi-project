import ProviderInterests from "../providerInterests/ProviderInterests";
import WhenCanWeMeetModal from "../whenCanWeMeetModal/WhenCanWeMeetModal";
import styles from './whenCanWeMeetComponent.module.css';

export default function WhenCanWeMeetComponent({schedule, additionalInfo, username, hideSubscribeNow}) {
  return (
    <div className="page-width">
      <div className={styles.whenCanWeMeetContainer}>
        <div className={styles.scheduleContainer}>
          <ProviderInterests
            componentTitle="When can we meet?"
            data={additionalInfo}
            schedule={schedule}
            isScheduleData={true}
          />
        </div>
        {!hideSubscribeNow && <WhenCanWeMeetModal username={username} schedule={schedule} />}
      </div>
    </div>
  )
}
