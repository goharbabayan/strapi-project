import { USER_REQUIRED_FIELDS } from '@/app/utils/constants/userForm';
import InfoIcon from '../icons/Info';
import styles from './errorInfo.module.css';

export default function ErrorInfo ({errors, requiredFieldsArray, showInfoIcon}) {
  let requiredFields = [];
  if (!requiredFieldsArray) requiredFields = USER_REQUIRED_FIELDS;
  const requiredFieldNames = errors
    ? Object.keys(errors)
        .filter((key) => requiredFields.includes(key))
        .map((key) =>
          `"${key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}"`
        )
        .join(', ')
    : 'Something went wrong!';

  const isSingleField = errors 
    ? Object.keys(errors).filter((key) => requiredFields.includes(key)).length === 1
    : false;

  const requiredFieldsInfoMessage = requiredFieldNames
    ? `${requiredFieldNames} ${isSingleField ? 'is required, please add it.' : 'are required, please add them.'}`
    : '';

  return (
    <div className="page-width">
      <div className={styles.errors}>
        {(requiredFieldsInfoMessage) &&
          <div className={styles.container}>
            {showInfoIcon && <InfoIcon/>}
            <span className={`${styles.message}`}>
              {requiredFieldsInfoMessage}
            </span>
          </div>
        }
      </div>
    </div>
  )
};
