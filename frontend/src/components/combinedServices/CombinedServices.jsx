import styles from './combinedServices.module.css';
import { useState } from 'react';
import Button from '../button/Button';
import Interest from '../interests/Interest';

export default function CombinedServices({
  type,
  subType1,
  subType2,
  userServices1,
  userServices2,
  updateChange,
  optionsList,
  error,
}) {
  const [services1, setServices1] = useState(userServices1);
  const [services2, setServices2] = useState(userServices2);
  const [showServicesOptions, setShowServicesOptions] = useState(null);
  const [resetUserSelectedServices, setResetUserSelectedServices] = useState(false);

const saveChanges = () => {
  const updatedServices = {
    [subType1]: services1,
    [subType2]: services2,
  };
  
  updateChange(type, updatedServices);
};

  const cancelChanges = () => {
    setServices1(userServices1);
    setServices2(userServices2);
    setResetUserSelectedServices(!resetUserSelectedServices);
  };

  const handleShowOptions = (subType) => {
    setShowServicesOptions((prev) => (prev === subType ? null : subType));
  };

  return (
    <>
      <Interest
        userSelectedInterests={userServices1}
        optionsList={optionsList}
        setParentState={(data) => setServices1(data)}
        showEditAndDeleteButtons={true}
        showServicesOptions={showServicesOptions === subType1}
        onShowOptions={() => handleShowOptions(subType1)}
        title={subType1}
        hideSaveAndCancelButtons={true}
        resetUserSelectedServices={resetUserSelectedServices}
      />
      <Interest
        userSelectedInterests={userServices2}
        optionsList={optionsList}
        setParentState={(data) => setServices2(data)}
        showServicesOptions={showServicesOptions === subType2}
        onShowOptions={() => handleShowOptions(subType2)}
        showEditAndDeleteButtons={true}
        title={subType2}
        hideSaveAndCancelButtons={true}
        resetUserSelectedServices={resetUserSelectedServices}
      />
      <div className={styles.buttons}>
        <Button
          children="Cancel"
          variant="general"
          onClick={cancelChanges}
        />
        <Button
          type="button"
          children="Save changes"
          variant="main"
          onClick={saveChanges}
        />
      </div>
    </>
  );
}
