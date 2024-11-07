import Text from '@/components/text/Text';
import styles from './headerAccountTab.module.css';
import ArrowDown from '@/components/icons/arrowDown/ArrowDown';
import { useContext, useState } from 'react';
import { AuthContext } from '@/app/Context';
import { navigate } from '@/app/actions';
import profileAvatarPlaceholder from '../../../../public/assets/profile_avatar_placeholder.png'

export default function HeaderAccountTab({loggedInCustomerData, isMobileLayout}) {
  const [showLoggedInTabs, setShowLoggedInTabs] = useState(false);
  const {setCustomerToken, setLoggedInUserData} = useContext(AuthContext);

  const handleUserLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUserdata');
    setCustomerToken('');
    navigate(`/`);
    setLoggedInUserData(null);
  }

  return (
    <div
      className={styles.headerAccountTabWrapper}
      onMouseOver={() => setShowLoggedInTabs(true)}
      onMouseLeave={() => setShowLoggedInTabs(false)}
    >
      <div className={styles.headerAccountTabContainer}>
        {!isMobileLayout && (
          <>
            {loggedInCustomerData?.name && loggedInCustomerData?.lastname && (
              <Text
                tag={'h3'}
                className={styles.userName}
                children={`${loggedInCustomerData?.name} ${loggedInCustomerData?.lastname}`}
              />
            )}
            <ArrowDown />
          </>
        )}
        {loggedInCustomerData?.profilePicture ?
          <img
            src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${loggedInCustomerData?.profilePicture}`}
            alt={'profile picture'}
            width={50}
            height={50}
            className={`${styles.image} ${isMobileLayout ? styles.mobileImage : ''}`}
          />
          :
          <img
            src={`${profileAvatarPlaceholder.src}`}
            alt={'profile picture'}
            width={50}
            height={50}
            className={`${styles.image} ${isMobileLayout ? styles.mobileImage : ''}`}
          />
        }
      </div>
      
      {showLoggedInTabs && (
        <div className={`${styles.headerAccountTabDetails} ${isMobileLayout ? styles.mobileHeaderAccountTabDetails : ''}`}>
          <a href={`/my-account/${loggedInCustomerData.username}`} className={styles.headerAccountTabItem}>My Account</a>
          <h4 onClick={() => handleUserLogOut()} className={styles.headerAccountTabItem}>Log out</h4>
        </div>
        )
      }
    </div>
  )
}
