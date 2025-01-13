import { useState, useEffect } from 'react';
import styles from './favoriteEscorts.module.css';
import Text from '../text/Text';
import ProviderCard from '../providerCard/ProviderCard';
import Banner from '../banner/Banner';
import { useFetchData } from '@/app/utils/hooks/useFetch';
import { navigate } from '@/app/actions';
import Modal from '../modal/Modal';
import InfoIcon from '../icons/Info';
import Button from '../button/Button';

const FavoriteEscorts = ({
  favoriteProvidersIds,
  bannerData,
  clientId,
  formData,
  setFormData
}) => {
  const [favoriteProviders, setFavoriteProviders] = useState([]);
  const [displayedProviders, setDisplayedProviders] = useState([]);
  const [showLoadMore, setShowLoadMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const token = JSON.parse(localStorage.getItem('token'));
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  useEffect(() => {
    if (favoriteProvidersIds.length === 0) {
      setDisplayedProviders([]);
      return;
    }
    const favoritesIdsArray = favoriteProvidersIds.map((obj) => obj.item);
    token && favoritesIdsArray && getFavoriteProviders(favoritesIdsArray);
  }, [favoriteProvidersIds]);

  const getFavoriteProviders = async (favoritesIds) => {
    const favoritesData = await useFetchData(`${baseUrl}/api/user/favorites?ids=${favoritesIds}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    if (favoritesData) {
      setFavoriteProviders(favoritesData);
      setDisplayedProviders(favoritesData.slice(0, 8));
      setShowLoadMore(favoritesData.length > 8);
    } else {
      // the token is expired need to login again to update existing token;
      navigate('/login');
    }
  };

  const handleLoadMore = () => {
    const favoriteProvidersToDisplay = favoriteProviders.slice(0, displayedProviders.length + 8);
    const isfavoriteProvidersToDisplayLessThenFavoriteProviders = displayedProviders.length + 8 < favoriteProviders.length;
    setDisplayedProviders(favoriteProvidersToDisplay);
    setShowLoadMore(isfavoriteProvidersToDisplayLessThenFavoriteProviders);
  };

  const handleStarIconClick = async (e, id) => {
    e.preventDefault();
    const updatedFavoritesIds = favoriteProvidersIds.filter(object => object.item != id);
    const updatedProviders = favoriteProviders.filter(provider => provider.id !== id);
    setFormData({...formData, favoriteProvidersIds: updatedFavoritesIds});
    setFavoriteProviders(updatedProviders);

    if (token && clientId) {
      const removeFromFavoritesJsonData = await useFetchData(`${baseUrl}/api/users/${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({...formData, favoriteProvidersIds: updatedFavoritesIds}),
      });
      removeFromFavoritesJsonData && setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 5000);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      {bannerData &&
        <Banner
          desktopImage={bannerData?.desktopImage}
          mobileImage={bannerData?.mobileImage}
          showOverlay={true}
          text={bannerData?.title}
          infoWrapperClassName={styles.bannerTitleWrapper}
        />
      }
      <div className="page-width">
        <section className={`section ${styles.section}`}>
          {favoriteProviders.length === 0 &&
            <Text
              tag={'h4'}
              className='subtitle'
              children={`You don't have favorite escorts yet.`}
            />
          }
          {displayedProviders.length > 0 &&
            <div className={`${styles.wrapper} collections-wrap`}>
              {displayedProviders.map(data => {
                return (
                  <ProviderCard
                    key={data.id}
                    provider={data}
                    count={4}
                    roleType={data.role.type}
                    showStarIcon={true}
                    onStarIconClick={(e) => handleStarIconClick(e, data.id)}
                  />
                )
              })}
            </div>
          }
          {showLoadMore && favoriteProvidersIds.length > 0 &&
            <div className={styles.button}>
              <Button
                onClick={handleLoadMore}
                children={'Load More'}
                variant={'main'}
              />
            </div>
          }
        </section>
      </div>
      {showModal &&
        <Modal
          title={'Successfully removed'}
          text={'The girl has been removed from favorite escorts'}
          Icon={<InfoIcon/>}
          onClose={handleCloseModal}
          contentClassName={styles.modal}
        />
      }
    </div>
  )
};

export default FavoriteEscorts;
