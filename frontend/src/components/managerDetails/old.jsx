import { useState } from 'react';
import styles from './managerDetails.module.css';
import AccountDetails from '../accountDetails/AccountDetails';
import { MANAGER } from '@/app/utils/constants/userRoles';

export default function ManagerDetails ({ user, onChanges, onSubmit, errorMessage }) {
  const {username, name, lastName, email, password, id} = user;
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [formData, setFormData] = useState({
    username: username,
    name: name,
    lastName: lastName,
    email: email,
    isApprovedByAdmin: user.isApprovedByAdmin ? user.isApprovedByAdmin : false,
  });

  const handleChange = (event, noNeedToShowChanges) => {
    if (noNeedToShowChanges) {
      onSubmit(event, MANAGER.type);
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
  };

  return (
    <div className={styles.mainWrap}>
      <AccountDetails
        username={formData.username}
        password={password}
        email={email}
        name={formData.name}
        lastName={formData.lastName}
        id={id}
        onChange={handleChange}
        onEditIconClick={handleEditIconClick}
        isManagerDashboard={true}
        errorMessage={errorMessage}
      />
    </div>
  )
}
