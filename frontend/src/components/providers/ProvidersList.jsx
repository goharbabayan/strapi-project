import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import ProviderCard from '../providerCard/ProviderCard';
import styles from './providersList.module.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const ProvidersList = ( props ) => {
  const { providersSection, providers, index } = props;
  const isBlackScheme = providersSection.activateBlackMode === true ? true : false;
  const sectionTitle = providersSection.title;
  let hasGreyBackgroundFone = true;
  let shouldBeVisibleThreeGrids = false;
  index === 0 ? hasGreyBackgroundFone = false : true;
  index === 2 ? shouldBeVisibleThreeGrids = true : false

  const myBreakpoints = {
    200: {
      slidesPerView: 1.2,
    },
    375: {
      slidesPerView: shouldBeVisibleThreeGrids ? 1.2 : 1.5,
    },
    570: {
      slidesPerView: shouldBeVisibleThreeGrids ? 1.5 : 2.5,
    },
    650: {
      slidesPerView: shouldBeVisibleThreeGrids ? 2.5 : 3.5,
    },
    1024: {
      slidesPerView: shouldBeVisibleThreeGrids ? 3 : 4,
    },
  };
  return (
    <div className={`${styles.mainWrap} ${hasGreyBackgroundFone && styles.greyFone}`}>
      { providers.length > 0 &&
        <div className={`${styles.container} page-width`}>
          { (sectionTitle && providers.length) > 0 &&
            <h3 className={styles.title}>{sectionTitle}</h3>
          }
          { providers.length > 0 &&
            <div className={styles.wrapper}>
              <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                spaceBetween={shouldBeVisibleThreeGrids ? 32 : 22}
                slidesPerView={shouldBeVisibleThreeGrids ? 3 : 4}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                breakpoints={myBreakpoints}
                data-sldes={shouldBeVisibleThreeGrids ? 3 : 4}
              >
                { providers.map((provider, index) => {
                  return <SwiperSlide key={index} virtualIndex={index}><ProviderCard provider={provider} key={index} blackScheme={isBlackScheme}/></SwiperSlide>
                })}
              </Swiper>
            </div>
          }
        </div>
      }
    </div>
  )
};

export default ProvidersList;
