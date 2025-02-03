import styles from './accountDetails.module.css';
import EditIcon from '../icons/Edit';
import InputField from '../inputField/InputField';
import Text from '../text/Text';
import ResetPassword from '../resetPassword/ResetPassword';
import ProfileDetailsTabs from '../profileDetails/profileDetailsTabs/ProfileDetailsTabs';
import { useState } from 'react';
// import Members from '@/app/my-account/[user]/members/page';

// ToDo: combine the user's fields in one object //username, name, lastname, email
export default function AccountDetails({
  username,
  name,
  lastName,
  errorMessage,
  email,
  id,
  onChange,
  onEditIconClick,
  isManagerDashboard,
  className,
}) {
  const [activeTabId, setActiveTabId] = useState(0);
// ToDo: move this constant to constant file
  const MANAGER_PROFILE_DETAILS_TABS = [
    {
      id: 0,
      label: 'My escorts',
      icon: null
    },
    {
      id: 1,
      label: 'Account details',
      icon: null,
    },
    {
      id: 2,
      label: 'Settings',
      icon: null
    }
  ];

  return (
    <section className={`${styles.infoWrap} ${styles.row}`}>
      {isManagerDashboard &&
        <ProfileDetailsTabs
          profileDetailsTabsData={MANAGER_PROFILE_DETAILS_TABS}
          activeTabId={activeTabId}
          setActiveTabId={setActiveTabId}
        />
      }
      {!isManagerDashboard &&
        <Text
          tag={'h2'}
          className={styles.heading}
          children={'Account Details'}
        />
      }
      {/* {isManagerDashboard && activeTabId === 0 &&
        <Members
          id={id}
          email={email}
          user={username}
        />
      } */}
      <div className="page-width">
        {(activeTabId === 1 || !isManagerDashboard) &&
          <>
            <div className={`${styles.profileName}`} data-username>
              <InputField 
                label='Username'
                type='text'
                name='username'
                id='username'
                className={styles.input}
                value={username}
                onChange={onChange}
                isRequired={true}
                errorMessage={errorMessage}
              />
              {/* ToDo: remove the data attribute */}
              <EditIcon className={styles.editIcon} onClick={(e) => onEditIconClick(e, 'data-username')}/>
            </div>
            {/* ToDo: move to separate component and render in the map */}
            {isManagerDashboard &&
              <>
                <div className={`${styles.nameInputsContainer}`}>
                  <div className={`${styles.profileName}`} data-name>
                    <InputField
                      label='Name'
                      type='text'
                      name='name'
                      id='name'
                      className={styles.input}
                      value={name}
                      onChange={onChange}
                      errorMessage={errorMessage}
                    />
                    <EditIcon className={styles.editIcon} onClick={(e) => onEditIconClick(e, 'data-name')}/>
                  </div>
                  <div className={`${styles.profileName}`} data-lastName>
                    <InputField
                      label='Lastname'
                      type='text'
                      name='lastName'
                      id='lastName'
                      className={styles.input}
                      value={lastName}
                      onChange={onChange}
                      errorMessage={errorMessage}
                    />
                    <EditIcon className={styles.editIcon} onClick={(e) => onEditIconClick(e, 'data-lastName')}/>
                  </div>
                </div>
                <div className={`${styles.emailWrapper}`}>
                  <div className={`${styles.address} ${styles.manager}`} data-address>
                    <InputField 
                      label='Email address'
                      type='text'
                      name='email'
                      id='email'
                      className={styles.input}
                      value={email}
                      disabled
                      errorMessage={errorMessage}
                    />
                  </div>
                </div>
              </>
            }
          </>
        }
      </div>
      {(activeTabId === 2 || !isManagerDashboard) && <ResetPassword className={className}/>}
    </section>
  )
}
