import { useState, useRef, useEffect } from 'react';
import styles from './clientDetails.module.css';
import FavoriteEscorts from '../favoriteEscorts/FavoriteEscorts';
import ResetPassword from '../resetPassword/ResetPassword';
import AccountInfo from '../accountInfo/AccountInfo';
import { navigate } from '@/app/actions';
import ProfileDetailsTabs from '../profileDetails/profileDetailsTabs/ProfileDetailsTabs';
import { useFetchData } from '@/app/utils/hooks/useFetch';

export default function ClientDetails({ user, onChanges, errorMessage }) {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const token = JSON.parse(localStorage.getItem('token'));
  const [formData, setFormData] = useState({
      username: user.username || '',
      name: user.name || '',
      lastName: user.lastName || '',
      userId: user.id || '',
      email: user.email || '',
      gender: user.gender,
      profilePicture: user.profilePicture || null,
      isApprovedByAdmin: user.isApprovedByAdmin,
      favoriteProvidersIds: user.favoriteProvidersIds || [],
    }
  );
  const [favoriteProviders, setFavoriteProviders] = useState([]);
  const [activeTabId, setActiveTabId] = useState(0);

  const profileSectionRef = useRef(null);
  const settingsSectionRef = useRef(null);

  useEffect(() => {
    const favoritesIdsArray = formData.favoriteProvidersIds.map((obj) => obj.item);
    token && favoritesIdsArray.length > 0 &&
      fetch(`${baseUrl}/api/user/favorites?ids=${favoritesIdsArray}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          // the token is expired need to login again to update existing token;
          navigate('/login');
        } else {
          setFavoriteProviders(data);
        }
      })
      .catch(err => console.log('err', err))
  }, [formData.favoriteProvidersIds]);

  const handleStarIconClick = (id) => {
    const token = JSON.parse(localStorage.getItem('token'));
    const updatedFavoritesIds = formData.favoriteProvidersIds.filter(object => object.item != id);
    const updatedProviders = favoriteProviders.filter(provider => provider.id !== id);
    setFormData({...formData, favoriteProvidersIds: updatedFavoritesIds});
    setFavoriteProviders(updatedProviders);

    token && user.id && user &&
      useFetchData(`${baseUrl}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({...formData, favoriteProvidersIds: updatedFavoritesIds}),
      })
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    onChanges(true, {...formData, [event.target.name]: event.target.value });
  };

  const handleMouseDown = async (name, value) => {
    setFormData({ ...formData, [name]: value });
    onChanges(true, { ...formData, [name]: value });
  };

  const handleChildFormDataChange = (field, value) => {
    setFormData({...formData, [field]: value});
    onChanges(true, {...formData, [field]: value});
  };
// ToDo: move the constant to constant file
  const CLIENT_PROFILE_DETAILS_TABS = [
    {
      id: 0,
      label: 'Account details',
      icon: null
    },
    {
      id: 1,
      label: 'My favorites',
      icon: null,
    },
    {
      id: 2,
      label: 'Settings',
      icon: null
    }
  ];

  return (
    <div className={styles.mainWrap}>
      <div className={`${styles.container}`}>
        <ProfileDetailsTabs
          profileDetailsTabsData={CLIENT_PROFILE_DETAILS_TABS}
          activeTabId={activeTabId}
          setActiveTabId={setActiveTabId}
        />
        {activeTabId === 0 &&
          <AccountInfo
            ref={profileSectionRef}
            email={formData.email}
            gender={formData.gender}
            formData={formData}
            onChange={handleChange}
            onMouseDown={handleMouseDown}
            onChildFormDataChange={handleChildFormDataChange}
            errorMessage={errorMessage}
          />
        }
        {activeTabId === 1 &&
          <FavoriteEscorts
            providers={favoriteProviders}
            title={'My Favorite Escorts'}
            onStarIconClick={handleStarIconClick}
          />
        }
        {activeTabId === 2 &&
          <ResetPassword
            password={formData.password}
            ref={settingsSectionRef}
          />
        }
      </div>
    </div>
  )
}
