import { useState } from 'react';
import styles from './managerDetails.module.css';
import Text from '../text/Text';
import AccountDetails from '../accountDetails/AccountDetails';
import { MANAGER } from '@/app/utils/constants/userRoles';

export default function ManagerDetails ({ user, onChanges, onSubmit, errorMessage }) {
  const {username, ressidentialAddress, email, password, id} = user;
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [formData, setFormData] = useState({
    username: username,
    email: email,
    isApprovedByAdmin: user.isApprovedByAdmin ? user.isApprovedByAdmin : false,
  })

  const handleChange = (event, noNeedToShowChanges) => {
    if (noNeedToShowChanges) {
      onSubmit(event, MANAGER);
    } else {
      setFormData({ ...formData, [event.target.name]: event.target.value });
      setHasUnsavedChanges(true);
      onChanges(true, { ...formData, [event.target.name]: event.target.value });
    }
  };

  const handleEditIconClick = (e, data) => {
    const input = (e.currentTarget).closest(`[${data}]`).querySelector('input');
    input.focus();
    setFormData({...formData, [input.name]: input.value})
    setHasUnsavedChanges(true);
    onChanges(hasUnsavedChanges, {...formData, [input.name]: input.value});
  }

  return (
    <div className={styles.mainWrap}>
      <div className={`page-width`}>
        <Text
          tag={'h2'}
          className={styles.title}
          children={`${user.username}'s dashboard`}
        />
        <AccountDetails 
          username={formData.username}
          ressidentialAddress={ressidentialAddress}
          password={password}
          email={email}
          id={id}
          onChange={handleChange}
          onEditIconClick={handleEditIconClick}
          isManagerDashboard={true}
          isApprovedByAdmin={formData.isApprovedByAdmin}
          errorMessage={errorMessage}
        />
      </div>
    </div>
  )
}
