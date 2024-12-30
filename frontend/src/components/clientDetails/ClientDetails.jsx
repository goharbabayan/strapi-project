import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import styles from './clientDetails.module.css';
import FavoriteEscorts from '../favoriteEscorts/FavoriteEscorts';
import ResetPassword from '../resetPassword/ResetPassword';
import ProfileDetailsTabs from '../profileDetails/profileDetailsTabs/ProfileDetailsTabs';
import { GET_CLIENT_DASHBOARD_PAGE_QUERIES } from '@/app/graphql/clientDashboardPageQueries';
import Loading from '@/app/loading';
import ClientProfile from '../clientProfile/ClientProfile';
import { CLIENT_DASHBOARD_PAGE_TABS } from '@/app/utils/constants/dashboardPageTabs';

export default function ClientDetails({
  user,
  onChanges,
  errorMessage
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
  const [activeTabId, setActiveTabId] = useState(0);
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

  const handleChildFormDataChange = (field, value) => {
    setFormData({...formData, [field]: value});
    onChanges({...formData, [field]: value})
  };

  return (
    <div className={styles.mainWrap}>
      {loading ? <Loading/> :
        <div className={`${styles.container}`}>
          <ProfileDetailsTabs
            profileDetailsTabsData={CLIENT_DASHBOARD_PAGE_TABS}
            activeTabId={activeTabId}
            setActiveTabId={setActiveTabId}
          />
          {activeTabId === 0 &&
            <FavoriteEscorts
              favoriteProvidersIds={formData.favoriteProvidersIds}
              bannerData={bannerData}
              clientId={user.id}
              formData={formData}
              setFormData={setFormData}
            />
          }
          {activeTabId === 1 &&
            <ClientProfile
              formData={formData}
              onChildFormDataChange={handleChildFormDataChange}
              errorMessage={errorMessage}
            />
          }
          {activeTabId === 2 &&
            <ResetPassword/>
          }
        </div>
      }
    </div>
  )
}
