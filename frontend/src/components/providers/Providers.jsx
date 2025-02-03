import styles from './providers.module.css';
import { useState, useEffect } from 'react';
import { SwiperNavButtons } from '../swiperNavButtons/SwiperNavButtons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { providersSectionOneTitle, providersSectionTwoTitle, providersSectionThreeTitle } from '@/app/utils/constants/homePageSectionTitles';
import ProviderCard from '../providerCard/ProviderCard';
import Text from '../text/Text';
import Button from '../button/Button';
import { SERVICE_PROVIDER } from '@/app/utils/constants/userRoles';
import Link from 'next/link';

export default function Providers ({
  sectionName,
  providerCardCountPerRow,
  showSlider,
  showBadge,
  showCategories,
  resData
}) {
  const [heading, setHeading] = useState('');
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showCategoriesInTheCenter, setShowCategoriesInTheCenter] = useState(false);
  const [button, setButton] = useState(null);

  useEffect(() => {
    if (resData != undefined) {
      setHeading(resData[`${sectionName}`]?.heading);
      setCategories(resData[`${sectionName}`]?.categories);
      setShowCategoriesInTheCenter(resData[`${sectionName}`]?.show_categories_in_the_center);
      setButton(resData[`${sectionName}`]?.Button);
      const providersArray = resData[`${sectionName}`]?.providers !== null ? resData[`${sectionName}`]?.providers?.data : [];
      setProviders(providersArray && [...providersArray.map(provider => {
        return {
          id: provider?.id,
          ...provider?.attributes
        }
      })]);
    }
  }, [resData]);

  const myBreakpoints = {
    200: {
      slidesPerView: 1.2,
    },
    481: {
      slidesPerView: 2.2,
    },
    800: {
      slidesPerView: 3.2,
    },
    1024: {
      slidesPerView: 4,
    },
  };

  const atLeastOneCardExists = providers && providers.length > 0;
  const contentIsNotEmpty = heading || atLeastOneCardExists;

  return (
    <>
    {contentIsNotEmpty &&
      <section
        className={`${styles.mainWrap} ${sectionName === providersSectionTwoTitle ? 'popular_providers' : ''} ${sectionName === providersSectionThreeTitle ? styles.findByType : ''}`}
      >
        {
          <div>
            {heading &&
              <div className="page-width">
                <Text
                  tag={'h3'}
                  className={`${styles.heading}`}
                  children={`${heading}`}
                />
              </div>
            }
            {showCategories && !!categories.length &&
              <div className={`${styles.categoriesWrap} page-width`}>
                <div className={`${styles.categories} ${categories && showCategoriesInTheCenter ? styles.centered : ''}`}>
                  {categories.map(category => {
                    const {id, name, link} = category;
                    return (
                      <Link
                        key={id}
                        className={`link ${styles.category}`}
                        {...(link && { href: link })}
                      >
                        {name}
                        </Link>
                    )
                  })}
                </div>
              </div>
            }
            <div
              className={`${styles.container} ${sectionName === providersSectionOneTitle ? styles.topProviders : ''} ${sectionName === providersSectionThreeTitle ? styles.findByType : ''} page-width`}
            >
            {showSlider ?
              <Swiper
                modules={[Navigation, A11y]}
                spaceBetween={22}
                slidesPerView={4}
                navigation={{
                  prevEl: '.swiper-button-prev',
                  nextEl: '.swiper-button-next',
                }}
                breakpoints={myBreakpoints}
                data-slides={4}
              >
                {atLeastOneCardExists &&
                  providers.map((provider, index) => {
                    const { role: { data: { attributes: { type } } }, isApprovedByAdmin } = provider;
                    if (type !== SERVICE_PROVIDER.type || !isApprovedByAdmin) return;

                    return (
                      <SwiperSlide key={index} virtualIndex={index}>
                        <ProviderCard
                          provider={provider}
                          showBadge={showBadge}
                          badge={provider.badge}
                          roleType={type}
                          verificationStatus={provider?.verificationStatus}
                        />
                      </SwiperSlide>
                  )})
                }
                <SwiperNavButtons />
              </Swiper>
              :
              <>
                {atLeastOneCardExists &&
                  providers.map((card, index) => {
                    const { role: { data: { attributes: { type } } } } = card;

                    return (
                      <ProviderCard
                        key={index}
                        provider={card}
                        showBadge={showBadge}
                        badge={card.badge}
                        count={providerCardCountPerRow}
                        roleType={type}
                        verificationStatus={card?.verificationStatus}
                      />
                  )})
                }
              </>
            }
            </div>
            {button &&
              <div className={`${styles.buttonWrap} `}>
                <Button
                  className={`${styles.button}`}
                  {...(button.link && { href: button.link })}
                  children={button.title}
                />
              </div>
            }
          </div>
        }
      </section>
    }
    </>
  )
}
