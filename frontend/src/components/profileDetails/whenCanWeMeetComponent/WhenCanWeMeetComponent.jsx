import { useState } from "react";
import ProviderInterests from "../providerInterests/ProviderInterests";
import WhenCanWeMeetModal from "../whenCanWeMeetModal/WhenCanWeMeetModal";
import styles from './whenCanWeMeetComponent.module.css';
import FormModal from "@/components/formModal/FormModal";
import Schedule from "@/components/schedule/Schedule";
import Text from "@/components/text/Text";

export default function WhenCanWeMeetComponent({
  schedule,
  additionalInfo,
  error,
  setErrors,
  username,
  hideSubscribeNow,
  showEditButton,
  updateUserPendingOvverridesAndSubmitUserData,
}) {
  let userSchedule = [];
  const userScheduleIsEmpty = !schedule || (Array.isArray(schedule) && schedule.length === 0);
  const scheduleForm = [
    { workday: 'Monday', start: '', end: '' },
    { workday: 'Tuesday', start: '', end: '' },
    { workday: 'Wednesday', start: '', end: '' },
    { workday: 'Thursday', start: '', end: '' },
    { workday: 'Friday', start: '', end: '' },
    { workday: 'Saturday', start: '', end: '' },
    { workday: 'Sunday', start: '', end: '' }
  ];
  if (userScheduleIsEmpty) {
    userSchedule = scheduleForm;
  } else {
    const originalUserSchedule = schedule.map((day) => ({ ...day }));
    userSchedule = originalUserSchedule;
  };

  const [showModal, setShowModal] = useState(false);
  const [mySchedule, setMySchedule] = useState(userSchedule);
  const [myAdditionalInfo, setMyAdditionalInfo] = useState(additionalInfo || []);
  const [resetInput, setResetInput] = useState(false);

  const handleEditIconClick = () => {
    setShowModal(true);
  };

  const handleAdditionalInfoChange = (field, updatedAdditionalInfo) => {
    setErrors(null);
    setMyAdditionalInfo(updatedAdditionalInfo);
  };

  const onSaveChanges = () => {
    updateUserPendingOvverridesAndSubmitUserData({'schedule': mySchedule, 'additionalInfo': myAdditionalInfo});
  };

  const onCancelChanges = () => {
    setMySchedule(userSchedule);
    setMyAdditionalInfo(additionalInfo || []);
    setResetInput(!resetInput)
  };

  const handleScheduleChange = (index, timeType, e) => {
    setErrors(null);
    e.preventDefault();
    const updatedWorkingTimes = mySchedule.map((day, i) =>
      i === index ? { ...day, [timeType]: e.target.value } : day
    );
    setMySchedule(updatedWorkingTimes);
  };

  return (
    <div className="page-width">
      {showModal &&
        <FormModal
          title={'My schedule'}
          className={styles.locationForm}
          onClose={() => {
            setShowModal(false);
          }}
        >
          <Schedule
            userSchedule={mySchedule}
            onPreferencesChange={handleAdditionalInfoChange}
            additionalInfo={myAdditionalInfo}
            resetInput={resetInput}
            onChange={handleScheduleChange}
            onSaveChanges={onSaveChanges}
            onCancelChanges={onCancelChanges}
          />
        </FormModal>
      }
      <div className={`${(showEditButton || hideSubscribeNow) ? styles.whenCanWeMeetContainerDashboardPage : styles.whenCanWeMeetContainer}`}>
        <div className={styles.scheduleContainer}>
          <ProviderInterests
            componentTitle={'When can we meet?'}
            data={myAdditionalInfo}
            schedule={schedule}
            isScheduleData={true}
            showEditButton={showEditButton}
            onClick={handleEditIconClick}
          />
        </div>
        {!hideSubscribeNow && <WhenCanWeMeetModal username={username} schedule={schedule} />}
      </div>
      {error &&
        <div className={styles.errorContainer}>
          <Text
            tag={'span'}
            children={error}
          />
        </div>
      }
    </div>
  )
}
