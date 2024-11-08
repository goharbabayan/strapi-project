import { useState, useRef, useEffect } from 'react';
import styles from './clientDetails.module.css';
import { CREATE_MENU_BAR } from '@/app/utils/constants/menuBar';
import FavoriteEscorts from '../favoriteEscorts/FavoriteEscorts';
import MenuBar from '../menuBar/MenuBar';
import ResetPassword from '../resetPassword/ResetPassword';
import AccountInfo from '../accountInfo/AccountInfo';
import { navigate } from '@/app/actions';

export default function ClientDetails({ user, onChanges, hasUnsavedChanges, errorMessage }) {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const token = JSON.parse(localStorage.getItem('token'));
  const [formData, setFormData] = useState(
    {
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
  const favoriteEscortsSectionRef = useRef(null);
  const profileSectionRef = useRef(null);
  const settingsSectionRef = useRef(null);

  const menuItems = [
    { name: 'Profile', sectionRef: profileSectionRef },
    { name: 'Favorite Escorts', sectionRef: favoriteEscortsSectionRef },
    { name: 'Settings', sectionRef: settingsSectionRef },
  ];
  const menu = CREATE_MENU_BAR(menuItems);

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
    const updatedFavoritesIds = formData.favoriteProvidersIds.filter(object => object.item != id);
    setFormData({...formData, favoriteProvidersIds: updatedFavoritesIds});
    onChanges(true, {...formData, favoriteProvidersIds: updatedFavoritesIds});
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

  const handleScrollToSection = (sectionRef) => {
    let topPosition;
      topPosition = sectionRef.current.offsetTop - 20;
    if (sectionRef.current) {
      window.scrollTo({ top: topPosition, behavior: 'smooth' });
    };
  };

  return (
    <div className={styles.mainWrap}>
      <div className={`${styles.container} page-width`}>
        <MenuBar
          isNotificationBarOpen={hasUnsavedChanges}
          onScrollToSection={handleScrollToSection}
          items={menu}
          isClientDashboard={true}
        />
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
        <FavoriteEscorts
          ref={favoriteEscortsSectionRef}
          providers={favoriteProviders}
          title={'My Favorite Escorts'}
          onStarIconClick={handleStarIconClick}
        />
        <ResetPassword
          password={formData.password}
          ref={settingsSectionRef}
        />
      </div>
    </div>
  )
}
