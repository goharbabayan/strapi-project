import styles from './combinedRates.module.css';
import Rates from '../rates/Rates';
import { useState } from 'react';
import Button from '../button/Button';

export default function CombinedRates({
  type,
  subType1,
  subType2,
  userRates1,
  userRates2,
  updateChange,
  optionsList,
  setUpdate,
}) {
  const [rates1, setRates1] = useState(userRates1);
  const [rates2, setRates2] = useState(userRates2);

const saveChanges = () => {
  const updatedRates = {
    [subType1]: rates1,
    [subType2]: rates2,
  };

  updateChange(type, updatedRates);
};

  const cancelChanges = () => {
    setRates1(userRates1);
    setRates2(userRates2);
  };

  return (
    <>
      <Rates
        type={type}
        subType={subType1}
        userRates={rates1}
        setParentState={(data) => setRates1(data)}
        optionsList={optionsList}
        hideButtons={true}
        showSubType={true}
        setUpdate={setUpdate}
      />
      <Rates
        type={type}
        subType={subType2}
        userRates={rates2}
        setParentState={(data) => setRates2(data)}
        optionsList={optionsList}
        hideButtons={true}
        showSubType={true}
        setUpdate={setUpdate}
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
