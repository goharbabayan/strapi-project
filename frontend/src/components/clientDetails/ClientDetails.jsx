import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import styles from './clientDetails.module.css';
import FavoriteProviders from '../favoriteProviders/FavoriteProviders';
import ResetPassword from '../resetPassword/ResetPassword';
import ProfileDetailsTabs from '../profileDetails/profileDetailsTabs/ProfileDetailsTabs';
import { GET_CLIENT_DASHBOARD_PAGE_QUERIES } from '@/app/graphql/clientDashboardPageQueries';
import Loading from '@/app/loading';
import ClientProfile from '../clientProfile/ClientProfile';
import { CLIENT_DASHBOARD_PAGE_TABS } from '@/app/utils/constants/dashboardPageTabs';

export default function ClientDetails({
  user,
  onChanges,
  errorMessage,
  activeTab,
  setActiveTab,
}) {
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
  const [bannerData, setBannerData] = useState({
    title: '',
    desktopImage: null,
    mobileImage: null,
  });
  const {loading, error, data} = useQuery(GET_CLIENT_DASHBOARD_PAGE_QUERIES);

  useEffect(() => {
    if (data !== undefined) {
      setBannerData({
        title: data?.clientDashboardPage?.data?.attributes?.title,
        desktopImage: data?.clientDashboardPage?.data?.attributes?.image_for_desktop?.data?.attributes,
        mobileImage: data?.clientDashboardPage?.data?.attributes?.image_for_mobile?.data?.attributes
      });
    }
  }, [data]);

  const handleChange = (field, value) => {
    setFormData({...formData, [field]: value});
    onChanges(field, value);
  };

  return (
    <div className={styles.mainWrap}>
      {loading ? <Loading/> :
        <div className={`${styles.container}`}>
          <ProfileDetailsTabs
            profileDetailsTabsData={CLIENT_DASHBOARD_PAGE_TABS}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          {activeTab === 'account' &&
            <FavoriteProviders
              favoriteProvidersIds={formData.favoriteProvidersIds}
              bannerData={bannerData}
              clientId={user.id}
              formData={formData}
              setFormData={setFormData}
            />
          }
          {activeTab === 'profile_info' &&
            <ClientProfile
              formData={formData}
              title={'Good to see you'}
              onChange={handleChange}
              errorMessage={errorMessage}
            />
          }
          {activeTab === 'settings' &&
            <ResetPassword/>
          }
        </div>
      }
    </div>
  )
}
